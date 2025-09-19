// src/integrations/supabase/lib/db/dailyLogs.ts
import { supabase } from "../supabase";

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
  // header count
  const { data: miss, error: e1 } = await supabase
    .from("scratch_daily.v_missing_reports_count")
    .select("missing_reports")
    .eq("project_id", projectId)
    .eq("day_date", dayISO)
    .maybeSingle();
  if (e1) console.error(e1);

  // logs
  const { data: logs, error: e2 } = await supabase
    .from("scratch_daily.v_logs_by_day")
    .select("log_id, title, body, created_at, author_name, attachments")
    .eq("project_id", projectId)
    .eq("day_date", dayISO)
    .order("created_at", { ascending: false });
  if (e2) console.error(e2);

  // todos
  const { data: todos, error: e3 } = await supabase
    .from("scratch_daily.v_todo_status_by_day")
    .select("todo_id, todo_title, exec_status, exec_detail, reason_label, media_today")
    .eq("project_id", projectId)
    .eq("day_date", dayISO);
  if (e3) console.error(e3);

  const uncompleted = (todos ?? []).filter(t => (t.exec_status ?? "not_executed") !== "executed");
  const completed = (todos ?? []).filter(t => (t.exec_status ?? "not_executed") === "executed");

  return {
    missingReports: miss?.missing_reports ?? 0,
    logs: (logs ?? []) as DayLog[],
    uncompleted: uncompleted as DayTodo[],
    completed: completed as DayTodo[],
  };
}
