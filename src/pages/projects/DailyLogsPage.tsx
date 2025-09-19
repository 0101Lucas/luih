// src/pages/projects/DailyLogsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDailyPage, DayLog, DayTodo } from "@/lib/db/dailyLogs";
import DailyLogsTab from "@/components/tabs/DailyLogsTab";
import { ProjectShell } from "@/components/layout/ProjectShell";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import { useAppStore } from "@/store/app";

export default function DailyLogsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useAppStore();
  
  // pegue o dia selecionado do filtro atual ou hoje
  const [dayISO, setDayISO] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [state, setState] = useState<{ missingReports: number; logs: DayLog[]; uncompleted: DayTodo[]; completed: DayTodo[] }>();

  useEffect(() => {
    if (!selectedProject && projectId) {
      navigate('/projects');
    }
  }, [selectedProject, projectId, navigate]);

  useEffect(() => {
    if (!projectId) return;
    fetchDailyPage({ projectId, dayISO }).then(setState);
  }, [projectId, dayISO]);

  const headerDate = useMemo(() => {
    // Thu, Sep 19 2025
    const d = new Date(dayISO + "T12:00:00-04:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" })
      .replace(/,/g, "");
  }, [dayISO]);

  if (!projectId || !state) return null;

  return (
    <ProjectShell>
      <div className="flex flex-col h-full">
        <ProjectHeader />
        <div className="flex-1 overflow-auto">
          <DailyLogsTab
            headerDate={headerDate}
            missingReports={state.missingReports}
            logs={state.logs}
            uncompleted={state.uncompleted}
            completed={state.completed}
            dayISO={dayISO}
            onChangeDay={setDayISO}
          />
        </div>
      </div>
    </ProjectShell>
  );
}
