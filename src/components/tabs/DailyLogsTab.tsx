// src/components/tabs/DailyLogsTab.tsx
import LogFeedEntry from "../daily-logs/LogFeedEntry";
import TodoExecutionCard from "../daily-logs/TodoExecutionCard";

export default function DailyLogsTab(props: {
  headerDate: string;
  missingReports: number;
  logs: any[];
  uncompleted: any[];
  completed: any[];
  dayISO: string;
  onChangeDay: (d: string) => void;
}) {
  const { headerDate, missingReports, logs, uncompleted, completed } = props;

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-8">
      <div>
        <div className="text-lg font-medium">{headerDate}</div>
        <div className="text-sm text-muted-foreground">{missingReports} To-Do&apos;s missing reports</div>
      </div>

      {/* Logs */}
      <section className="space-y-6">
        {logs.map(l => (
          <LogFeedEntry key={l.log_id} entry={l} />
        ))}
      </section>

      {/* Tasks */}
      <TasksBlock uncompleted={uncompleted} completed={completed} />
    </div>
  );
}

function TasksBlock({ uncompleted, completed }: { uncompleted: any[]; completed: any[] }) {
  const [openUn, setOpenUn] = React.useState(true);
  const [openDone, setOpenDone] = React.useState(false);

  return (
    <section className="space-y-4">
      <div>
        <button className="w-full flex items-center justify-between text-left py-2" onClick={() => setOpenUn(v => !v)}>
          <span className="font-semibold">Uncompleted To-Do&apos;s ({uncompleted.length})</span>
          <span>{openUn ? "▾" : "▸"}</span>
        </button>
        {openUn && (
          <ul className="space-y-3">
            {uncompleted.map((t) => (
              <li key={t.todo_id}>
                <TodoExecutionCard
                  title={t.todo_title}
                  status={label(t.exec_status)}
                  reason={t.reason_label ?? t.exec_detail ?? "—"}
                  media={t.media_today ?? []}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button className="w-full flex items-center justify-between text-left py-2" onClick={() => setOpenDone(v => !v)}>
          <span className="font-semibold">Completed To-Do&apos;s ({completed.length})</span>
          <span>{openDone ? "▾" : "▸"}</span>
        </button>
        {openDone && (
          <ul className="space-y-2">
            {completed.map((t) => (
              <li key={t.todo_id}>
                <div className="font-medium">{t.todo_title} — Executed</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function label(s?: "executed"|"partial"|"not_executed"|null) {
  if (s === "executed") return "Executed";
  if (s === "partial") return "Partially Executed";
  return "Not Executed";
}
