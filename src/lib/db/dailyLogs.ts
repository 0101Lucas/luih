import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface MediaItem {
  id: string;
  project_id: string;
  log_id?: string;
  todo_id?: string;
  url: string; // Storage path, not full URL
  type: 'photo' | 'video';
  created_at: string;
}

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
  media?: MediaItem[];
}

export interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
  fileName: string;
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

export interface DailyLogWithMedia {
  id: string;
  project_id: string;
  todo_id?: string;
  title?: string;
  body?: string;
  entry_type: string;
  created_by?: string;
  created_at: string;
  media: MediaItem[];
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

// Storage helpers
export function getMediaStoragePath(projectId: string, logId: string, fileName: string): string {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `projects/${projectId}/logs/${logId}/${timestamp}-${cleanFileName}`;
}

export function getPublicMediaUrl(path: string): string {
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

// Upload files in parallel with error handling
export async function uploadFiles(projectId: string, logId: string, files: File[]): Promise<UploadResult[]> {
  const uploadPromises = files.map(async (file): Promise<UploadResult> => {
    try {
      const filePath = getMediaStoragePath(projectId, logId, file.name);
      
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        return {
          success: false,
          error: uploadError.message,
          fileName: file.name
        };
      }

      return {
        success: true,
        path: filePath,
        fileName: file.name
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fileName: file.name
      };
    }
  });

  return Promise.allSettled(uploadPromises).then(results =>
    results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        success: false,
        error: 'Upload failed',
        fileName: 'unknown'
      }
    )
  );
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

// Get daily logs with media for detailed view
export async function listDailyLogs(projectId: string, filters?: {
  from?: string;
  to?: string;
  search?: string;
}): Promise<DailyLogWithMedia[]> {
  let query = supabase
    .from('daily_logs')
    .select(`
      *,
      media (
        id,
        url,
        type,
        created_at
      )
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (filters?.from) {
    query = query.gte('created_at', filters.from);
  }
  if (filters?.to) {
    query = query.lte('created_at', filters.to);
  }

  const { data, error } = await query;
  if (error) throw error;

  let results = data || [];

  // Apply search filter
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    results = results.filter(log => 
      log.title?.toLowerCase().includes(searchTerm) ||
      log.body?.toLowerCase().includes(searchTerm)
    );
  }

  return results as DailyLogWithMedia[];
}

// Enhanced note creation with multiple files and better error handling
export async function createDailyLog(params: CreateNoteParams): Promise<{ logId: string; uploadResults: UploadResult[] }> {
  const { projectId, todoId, comment, files } = params;

  // Insert daily log entry first
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

  // Upload files in parallel
  const uploadResults = await uploadFiles(projectId, logData.id, files);

  // Insert media records for successful uploads only
  const mediaInserts = uploadResults
    .filter(result => result.success && result.path)
    .map(result => ({
      project_id: projectId,
      log_id: logData.id,
      url: result.path!, // Store path, not full URL
      type: files.find(f => f.name === result.fileName)?.type.startsWith('video/') ? 'video' as const : 'photo' as const
    }));

  if (mediaInserts.length > 0) {
    const { error: mediaError } = await supabase
      .from('media')
      .insert(mediaInserts);

    if (mediaError) {
      console.error('Error inserting media records:', mediaError);
      // Don't throw here - log exists, just media insertion failed
    }
  }

  return {
    logId: logData.id,
    uploadResults
  };
}

// Legacy wrapper for backward compatibility
export async function createNoteLog(params: CreateNoteParams): Promise<void> {
  const result = await createDailyLog(params);
  
  // Check if any uploads failed
  const failedUploads = result.uploadResults.filter(r => !r.success);
  if (failedUploads.length > 0) {
    console.warn('Some file uploads failed:', failedUploads);
    // Don't throw - log was created successfully
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
    // Use consistent path format for todos
    const uploadPromises = files.map(async (file) => {
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `projects/${todoData.project_id}/todos/${todoId}/${timestamp}-${cleanFileName}`;

      try {
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Insert media record with path (not full URL)
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            project_id: todoData.project_id,
            todo_id: todoId,
            url: filePath, // Store path, not full URL
            type: file.type.startsWith('video/') ? 'video' : 'photo'
          });

        if (mediaError) throw mediaError;
        
        return { success: true, fileName: file.name };
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return { success: false, fileName: file.name, error };
      }
    });

    // Wait for all uploads to complete
    await Promise.allSettled(uploadPromises);
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