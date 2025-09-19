import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface FeedItem {
  entry_id: string;
  entry_date: string;
  kind: string;
  title?: string;
  body?: string;
  todo_id?: string;
  created_by?: string;
  status?: string;
  reason_label?: string;
  detail?: string;
  review_status?: string;
  review_comment?: string;
  media_count: number;
  todo_title?: string;
}

export interface FeedOptions {
  from: string;
  to: string;
  search?: string;
  authorId?: string;
}

export interface CreateNoteParams {
  projectId: string;
  todoId?: string;
  comment: string;
  files: File[];
}

export interface ExecutionReportParams {
  todoId: string;
  status: 'executed' | 'partial' | 'not_executed';
  reasonId?: string;
  detail?: string;
  files?: File[];
}

export interface Reason {
  id: string;
  label: string;
}

export interface ProjectTodo {
  id: string;
  title: string;
  due_date: string | null;
}

// Returns unified feed for [from..to] (inclusive), newest first
export async function listDailyLogFeed(
  projectId: string,
  opts: FeedOptions
): Promise<FeedItem[]> {
  let query = supabase
    .from('v_daily_log_feed')
    .select('*')
    .eq('project_id', projectId)
    .gte('entry_date', opts.from)
    .lte('entry_date', opts.to)
    .order('entry_date', { ascending: false })
    .order('entry_id', { ascending: false });

  const { data, error } = await query;
  
  if (error) throw error;

  let filteredData = data || [];

  // Apply client-side search filter
  if (opts.search) {
    const searchTerm = opts.search.toLowerCase();
    filteredData = filteredData.filter(item => 
      (item.title?.toLowerCase().includes(searchTerm)) ||
      (item.body?.toLowerCase().includes(searchTerm)) ||
      (item.todo_title?.toLowerCase().includes(searchTerm))
    );
  }

  // Apply author filter if provided
  if (opts.authorId) {
    filteredData = filteredData.filter(item => item.created_by === opts.authorId);
  }

  return filteredData;
}

// Manual note creation with storage upload
export async function createNoteLog(params: CreateNoteParams): Promise<void> {
  const { projectId, todoId, comment, files } = params;

  // Validate files
  if (files.length > 2) {
    throw new Error('Maximum 2 files allowed');
  }

  const imageFiles = files.filter(f => f.type.startsWith('image/'));
  const videoFiles = files.filter(f => f.type.startsWith('video/'));

  if (videoFiles.length > 1 || (videoFiles.length === 1 && imageFiles.length > 0)) {
    throw new Error('Only 1 video file OR up to 2 images allowed');
  }

  // Insert daily log entry
  const { data: logData, error: logError } = await supabase
    .from('daily_logs')
    .insert({
      project_id: projectId,
      todo_id: todoId || null,
      title: null,
      body: comment,
      entry_type: 'note'
    })
    .select()
    .single();

  if (logError) throw logError;

  // Upload files and insert media records
  for (const file of files) {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `logs/${logData.id}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Insert media record
    const { error: mediaError } = await supabase
      .from('media')
      .insert({
        project_id: projectId,
        log_id: logData.id,
        url: urlData.publicUrl,
        type: file.type.startsWith('video/') ? 'video' : 'photo'
      });

    if (mediaError) throw mediaError;
  }
}

// Execution Report upsert with optional evidence
export async function upsertExecutionReport(params: ExecutionReportParams): Promise<void> {
  const { todoId, status, reasonId, detail, files } = params;

  // Validate required fields
  if ((status === 'partial' || status === 'not_executed') && !reasonId) {
    throw new Error('Reason is required for partial or not executed status');
  }

  // Validate files
  if (files && files.length > 2) {
    throw new Error('Maximum 2 files allowed');
  }

  if (files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const videoFiles = files.filter(f => f.type.startsWith('video/'));

    if (videoFiles.length > 1 || (videoFiles.length === 1 && imageFiles.length > 0)) {
      throw new Error('Only 1 video file OR up to 2 images allowed');
    }
  }

  // Get project_id from todo
  const { data: todoData, error: todoError } = await supabase
    .from('to_dos')
    .select('project_id')
    .eq('id', todoId)
    .single();

  if (todoError) throw todoError;

  // Upsert execution report
  const { error: reportError } = await supabase
    .from('execution_reports')
    .upsert({
      todo_id: todoId,
      status,
      reason_id: reasonId || null,
      detail: detail || null
    }, {
      onConflict: 'todo_id'
    });

  if (reportError) throw reportError;

  // Upload evidence files if provided
  if (files && files.length > 0) {
    for (const file of files) {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `todos/${todoId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Insert media record
      const { error: mediaError } = await supabase
        .from('media')
        .insert({
          project_id: todoData.project_id,
          todo_id: todoId,
          url: urlData.publicUrl,
          type: file.type.startsWith('video/') ? 'video' : 'photo'
        });

      if (mediaError) throw mediaError;
    }
  }
}

export async function listReasons(): Promise<Reason[]> {
  const { data, error } = await supabase
    .from('reasons')
    .select('id, label')
    .eq('active', true)
    .order('label');

  if (error) throw error;
  
  return data || [];
}

export async function listProjectTodos(projectId: string): Promise<ProjectTodo[]> {
  const { data, error } = await supabase
    .from('to_dos')
    .select('id, title, due_date')
    .eq('project_id', projectId)
    .order('title');

  if (error) throw error;
  
  return data || [];
}