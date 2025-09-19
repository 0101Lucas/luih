-- Drop existing view if it exists
DROP VIEW IF EXISTS public.v_daily_log_feed;

-- Create view for unified daily log feed
CREATE VIEW public.v_daily_log_feed AS
-- Manual notes from daily_logs
SELECT
  dl.project_id,
  dl.id as entry_id,
  dl.created_at::date as entry_date,
  'note' as kind,
  dl.title,
  dl.body,
  dl.todo_id,
  dl.created_by,
  null as status,
  null as reason_label,
  null as detail,
  null as review_status,
  null as review_comment,
  (SELECT COUNT(*) FROM media m WHERE m.log_id = dl.id) as media_count,
  (SELECT t.title FROM to_dos t WHERE t.id = dl.todo_id) as todo_title
FROM daily_logs dl

UNION ALL

-- Auto To-Do items: surface due To-Dos as feed entries
SELECT
  t.project_id,
  t.id as entry_id,
  t.due_date as entry_date,
  'todo' as kind,
  null as title,
  null as body,
  t.id as todo_id,
  null as created_by,
  COALESCE(er.status, 'incomplete') as status,
  r.label as reason_label,
  er.detail,
  er.review_status,
  er.review_comment,
  (SELECT COUNT(*) FROM media m WHERE m.todo_id = t.id) as media_count,
  t.title as todo_title
FROM to_dos t
LEFT JOIN execution_reports er ON er.todo_id = t.id
LEFT JOIN reasons r ON r.id = er.reason_id
WHERE t.due_date IS NOT NULL;

-- Grant permissions for the view
GRANT SELECT ON public.v_daily_log_feed TO authenticated, anon;