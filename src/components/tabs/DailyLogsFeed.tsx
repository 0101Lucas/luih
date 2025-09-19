import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LogFeedEntry from "../daily-logs/LogFeedEntry";
import TodoExecutionCard from "../daily-logs/TodoExecutionCard";

interface DayData {
  date: string;
  formattedDate: string;
  missingReports: number;
  logs: any[];
  uncompleted: any[];
  completed: any[];
}

interface DailyLogsFeedProps {
  days: DayData[];
}

export default function DailyLogsFeed({ days }: DailyLogsFeedProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {days.map((day, index) => (
        <React.Fragment key={day.date}>
          <DaySection
            date={day.formattedDate}
            missingReports={day.missingReports}
            logs={day.logs}
            uncompleted={day.uncompleted}
            completed={day.completed}
          />
          {index < days.length - 1 && (
            <div className="flex items-center gap-4 py-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground bg-background px-2">•••</span>
              <Separator className="flex-1" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function DaySection({
  date,
  missingReports,
  logs,
  uncompleted,
  completed
}: {
  date: string;
  missingReports: number;
  logs: any[];
  uncompleted: any[];
  completed: any[];
}) {
  return (
    <Card className="p-6 space-y-6">
      {/* Day Header */}
      <div className="space-y-2 border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">{date}</h2>
        {missingReports > 0 && (
          <div className="text-sm text-amber-600 dark:text-amber-400">
            {missingReports} To-Do's missing reports
          </div>
        )}
      </div>

      {/* Logs Section */}
      {logs.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Daily Notes</h3>
          <div className="space-y-4">
            {logs.map(log => (
              <LogFeedEntry key={log.entry_id} entry={log} />
            ))}
          </div>
        </section>
      )}

      {/* Tasks Section */}
      <TasksSection uncompleted={uncompleted} completed={completed} />
    </Card>
  );
}

function TasksSection({ uncompleted, completed }: { uncompleted: any[]; completed: any[] }) {
  const [openUncompleted, setOpenUncompleted] = React.useState(true);
  const [openCompleted, setOpenCompleted] = React.useState(false);

  if (uncompleted.length === 0 && completed.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Uncompleted Tasks */}
      {uncompleted.length > 0 && (
        <div className="space-y-3">
          <button 
            className="w-full flex items-center justify-between text-left py-2 hover:bg-muted/50 rounded px-2 transition-colors" 
            onClick={() => setOpenUncompleted(v => !v)}
          >
            <span className="font-medium text-foreground">
              Pending Tasks ({uncompleted.length})
            </span>
            <span className="text-muted-foreground">
              {openUncompleted ? "▾" : "▸"}
            </span>
          </button>
          {openUncompleted && (
            <div className="space-y-3 pl-4">
              {uncompleted.map((todo) => (
                <TodoExecutionCard
                  key={todo.todo_id}
                  title={todo.todo_title}
                  status={formatStatus(todo.exec_status)}
                  reason={todo.reason_label ?? todo.exec_detail ?? "—"}
                  media={todo.media_today ?? []}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <button 
            className="w-full flex items-center justify-between text-left py-2 hover:bg-muted/50 rounded px-2 transition-colors" 
            onClick={() => setOpenCompleted(v => !v)}
          >
            <span className="font-medium text-foreground">
              Completed Tasks ({completed.length})
            </span>
            <span className="text-muted-foreground">
              {openCompleted ? "▾" : "▸"}
            </span>
          </button>
          {openCompleted && (
            <div className="space-y-2 pl-4">
              {completed.map((todo) => (
                <div key={todo.todo_id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-medium text-foreground">{todo.todo_title}</span>
                  <span className="text-sm text-muted-foreground">— Completed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function formatStatus(status?: "executed"|"partial"|"not_executed"|null) {
  if (status === "executed") return "Executed";
  if (status === "partial") return "Partially Executed";
  return "Not Executed";
}