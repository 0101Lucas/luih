// src/components/tabs/DailyLogsTab.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { headerDate, missingReports, logs, uncompleted, completed, dayISO, onChangeDay } = props;

  const handlePreviousDay = () => {
    const date = new Date(dayISO + "T12:00:00");
    date.setDate(date.getDate() - 1);
    onChangeDay(date.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const date = new Date(dayISO + "T12:00:00");
    date.setDate(date.getDate() + 1);
    onChangeDay(date.toISOString().slice(0, 10));
  };

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-medium">{headerDate}</div>
          <Button variant="ghost" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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
