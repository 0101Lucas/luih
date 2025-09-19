import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LogFeedEntry from "../daily-logs/LogFeedEntry";
import TodoExecutionCard from "../daily-logs/TodoExecutionCard";
import { CreateNoteModal } from "../daily-logs/CreateNoteModal";

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
  projectId: string;
  onRefresh: () => void;
}

export default function DailyLogsFeed({ days, projectId, onRefresh }: DailyLogsFeedProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header with Create Log button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Daily Logs</h1>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus size={16} />
          Create Log
        </Button>
      </div>

      {/* Feed */}
      <div className="space-y-8">
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
              <div className="text-center py-6">
                <div className="text-muted-foreground font-mono">________________</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        projectId={projectId}
        onSuccess={onRefresh}
      />
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
    <div className="space-y-6">
      {/* Day Header */}
      <div className="space-y-2">
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
          {logs.map(log => (
            <LogFeedEntry key={log.entry_id || log.log_id} entry={log} />
          ))}
        </section>
      )}

      {/* Tasks Section */}
      <TasksSection uncompleted={uncompleted} completed={completed} />
    </div>
  );
}

function TasksSection({ uncompleted, completed }: { uncompleted: any[]; completed: any[] }) {
  const [openUncompleted, setOpenUncompleted] = React.useState(true);
  const [openCompleted, setOpenCompleted] = React.useState(false);

  if (uncompleted.length === 0 && completed.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* Uncompleted Tasks */}
      {uncompleted.length > 0 && (
        <div className="space-y-2">
          <button 
            className="text-left hover:underline" 
            onClick={() => setOpenUncompleted(v => !v)}
          >
            <span className="font-medium">
              Uncompleted To-Do's ({uncompleted.length}) {openUncompleted ? "▾" : "▸"}
            </span>
          </button>
          {openUncompleted && (
            <div className="space-y-2">
              {uncompleted.map((todo, index) => (
                <div key={todo.todo_id}>
                  <div className="font-medium">
                    {index + 1}) {todo.todo_title} — {formatStatus(todo.exec_status)}
                  </div>
                  {todo.reason_label && (
                    <div className="text-sm text-muted-foreground">
                      Reason: {todo.reason_label}
                    </div>
                  )}
                  {todo.media_today?.length > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Files: </span>
                      {todo.media_today.map((media: any, idx: number) => (
                        <a 
                          key={idx}
                          href={media.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block px-1 py-0.5 bg-muted rounded text-xs hover:bg-muted/80 mr-1"
                        >
                          [ {media.url.split('/').pop()?.split('.')[0] || 'file'} ]
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <button 
            className="text-left hover:underline" 
            onClick={() => setOpenCompleted(v => !v)}
          >
            <span className="font-medium">
              Completed To-Do's ({completed.length}) {openCompleted ? "▾" : "▸"}
            </span>
          </button>
          {openCompleted && (
            <div className="space-y-1">
              {completed.map((todo, index) => (
                <div key={todo.todo_id} className="font-medium">
                  {index + 1}) {todo.todo_title} — Executed
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