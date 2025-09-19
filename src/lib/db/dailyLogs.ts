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
  // Mock implementation for now - return empty data structure
  return {
    missingReports: 0,
    logs: [] as DayLog[],
    uncompleted: [] as DayTodo[],
    completed: [] as DayTodo[],
  };
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
  // Mock implementation - return data directly
  return [] as FeedItem[];
}

export async function createDailyLog(data: any) {
  // Mock implementation - return data directly
  return { uploadResults: [] };
}

export async function listProjectTodos(projectId: string) {
  // Mock implementation - return data directly
  return [] as ProjectTodo[];
}

export async function upsertExecutionReport(data: any) {
  // Mock implementation - return data directly
  return {};
}

export async function listReasons() {
  // Mock implementation - return data directly
  return [] as Reason[];
}

export function getPublicMediaUrl(url: string) {
  // Mock implementation - replace with actual logic
  return url;
}
