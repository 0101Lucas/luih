// src/lib/db/dailyLogs.ts
import { supabase } from "@/integrations/supabase/client";

export type DayLog = {
  log_id: string;
  title: string;
  body: string | null;
  created_at: string;
  author_name: string | null;
  attachments: Array<{ id: string; type: "photo"|"video"|"file"; url: string; created_at: string }> | null;
};

export type DayTodo = {
  todo_id: string;
  todo_title: string;
  exec_status: "executed"|"partial"|"not_executed"|null;
  exec_detail: string | null;
  reason_label: string | null;
  media_today: Array<{ id: string; type: "photo"|"video"|"file"; url: string }> | null;
};

export async function fetchDailyPage({
  projectId,
  dayISO,
}: { projectId: string; dayISO: string; }) {
  try {
    // Get daily logs for the day
    const { data: logs, error: logsError } = await supabase
      .from('v_daily_log_feed')
      .select('*')
      .eq('project_id', projectId)
      .eq('entry_date', dayISO)
      .eq('kind', 'log')
      .order('entry_date', { ascending: false });

    if (logsError) throw logsError;

    // Get todos with execution reports for the day
    const { data: todosData, error: todosError } = await supabase
      .from('v_daily_log_feed')
      .select('*')
      .eq('project_id', projectId)
      .eq('entry_date', dayISO)
      .eq('kind', 'execution_report')
      .order('entry_date', { ascending: false });

    if (todosError) throw todosError;

    // Calculate missing reports (todos due today without execution reports)
    const { data: dueTodos, error: dueError } = await supabase
      .from('to_dos')
      .select(`
        id, title,
        execution_reports!left(id, status)
      `)
      .eq('project_id', projectId)
      .lte('due_date', dayISO)
      .eq('status', 'incomplete');

    if (dueError) throw dueError;

    const missingReports = dueTodos?.filter(todo => 
      !todo.execution_reports || todo.execution_reports.length === 0
    ).length || 0;

    // Transform logs data
    const transformedLogs: DayLog[] = logs?.map(log => ({
      log_id: log.entry_id!,
      title: log.title!,
      body: log.body,
      created_at: log.entry_date!,
      author_name: log.created_by ? `User ${log.created_by.slice(0, 8)}` : null,
      attachments: log.media_urls ? JSON.parse(log.media_urls as string) : null
    })) || [];

    // Transform todos data
    const uncompleted: DayTodo[] = [];
    const completed: DayTodo[] = [];

    todosData?.forEach(item => {
      const todo: DayTodo = {
        todo_id: item.todo_id!,
        todo_title: item.todo_title!,
        exec_status: item.status as "executed"|"partial"|"not_executed"|null,
        exec_detail: item.detail,
        reason_label: item.reason_label,
        media_today: item.media_urls ? JSON.parse(item.media_urls as string) : null
      };

      if (item.status === 'executed') {
        completed.push(todo);
      } else {
        uncompleted.push(todo);
      }
    });

    return {
      missingReports,
      logs: transformedLogs,
      uncompleted,
      completed,
    };
  } catch (error) {
    console.error('Error fetching daily page:', error);
    return {
      missingReports: 0,
      logs: [] as DayLog[],
      uncompleted: [] as DayTodo[],
      completed: [] as DayTodo[],
    };
  }
}

export type FeedItem = {
  id: string;
  type: "log" | "todo" | "execution_report";
  title: string;
  body?: string;
  created_at: string;
  author_name?: string;
  attachments?: Array<{ id: string; type: "photo"|"video"|"file"; url: string }>;
  entry_date?: string;
  todo_id?: string;
  todo_title?: string;
  created_by?: string;
  media_count?: number;
  media?: Array<{ id: string; type: "photo"|"video"|"file"; url: string }>;
  entry_id?: string;
  status?: string;
  reason_label?: string;
  detail?: string;
  kind?: string;
};

export type ProjectTodo = {
  id: string;
  title: string;
  description?: string;
};

export type Reason = {
  id: string;
  label: string;
};

export async function listDailyLogFeed(projectId: string, filters?: any) {
  try {
    const { data, error } = await supabase
      .from('v_daily_log_feed')
      .select('*')
      .eq('project_id', projectId)
      .order('entry_date', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      id: item.entry_id!,
      type: item.kind as "log" | "todo" | "execution_report",
      title: item.title!,
      body: item.body,
      created_at: item.entry_date!,
      author_name: item.created_by ? `User ${item.created_by.slice(0, 8)}` : undefined,
      attachments: item.media_urls ? JSON.parse(item.media_urls as string) : undefined,
      entry_date: item.entry_date,
      todo_id: item.todo_id,
      todo_title: item.todo_title,
      created_by: item.created_by,
      media_count: item.media_count,
      media: item.media_urls ? JSON.parse(item.media_urls as string) : undefined,
      entry_id: item.entry_id,
      status: item.status,
      reason_label: item.reason_label,
      detail: item.detail,
      kind: item.kind
    })) || [];
  } catch (error) {
    console.error('Error fetching daily log feed:', error);
    return [];
  }
}

export async function createDailyLog(data: {
  projectId: string;
  title: string;
  body?: string;
  todoId?: string;
  files?: File[];
}) {
  try {
    // Insert the daily log
    const { data: logData, error: logError } = await supabase
      .from('daily_logs')
      .insert({
        project_id: data.projectId,
        title: data.title,
        body: data.body,
        todo_id: data.todoId,
        entry_type: 'note'
      })
      .select()
      .single();

    if (logError) throw logError;

    const uploadResults = [];

    // Upload files if any
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${data.projectId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        // Insert media record
        const { error: mediaError } = await supabase
          .from('media')
          .insert({
            project_id: data.projectId,
            log_id: logData.id,
            type: file.type.startsWith('image/') ? 'photo' : 
                  file.type.startsWith('video/') ? 'video' : 'file',
            url: publicUrl
          });

        if (!mediaError) {
          uploadResults.push({ fileName, url: publicUrl });
        }
      }
    }

    return { uploadResults };
  } catch (error) {
    console.error('Error creating daily log:', error);
    throw error;
  }
}

export async function listProjectTodos(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('to_dos')
      .select('id, title, notes')
      .eq('project_id', projectId)
      .eq('status', 'incomplete')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(todo => ({
      id: todo.id,
      title: todo.title,
      description: todo.notes
    })) || [];
  } catch (error) {
    console.error('Error fetching project todos:', error);
    return [];
  }
}

export async function upsertExecutionReport(data: {
  todoId: string;
  status: string;
  reasonId?: string;
  detail?: string;
  files?: File[];
}) {
  try {
    // Get project ID from todo
    const { data: todoData, error: todoError } = await supabase
      .from('to_dos')
      .select('project_id')
      .eq('id', data.todoId)
      .single();

    if (todoError) throw todoError;

    // Insert execution report
    const { data: reportData, error: reportError } = await supabase
      .from('execution_reports')
      .insert({
        todo_id: data.todoId,
        status: data.status,
        reason_id: data.reasonId,
        detail: data.detail
      })
      .select()
      .single();

    if (reportError) throw reportError;

    // Upload files if any
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${todoData.project_id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) continue;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        await supabase
          .from('media')
          .insert({
            project_id: todoData.project_id,
            todo_id: data.todoId,
            type: file.type.startsWith('image/') ? 'photo' : 
                  file.type.startsWith('video/') ? 'video' : 'file',
            url: publicUrl
          });
      }
    }

    return reportData;
  } catch (error) {
    console.error('Error upserting execution report:', error);
    throw error;
  }
}

export async function listReasons() {
  try {
    const { data, error } = await supabase
      .from('reasons')
      .select('id, label')
      .eq('active', true)
      .order('label');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching reasons:', error);
    return [];
  }
}

export function getPublicMediaUrl(url: string) {
  return url; // URLs from supabase storage are already public
}
