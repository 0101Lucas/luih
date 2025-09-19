// src/pages/projects/DailyLogsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDailyLogsFeed, DayData } from "@/lib/db/dailyLogs";
import DailyLogsFeed from "@/components/tabs/DailyLogsFeed";
import { ProjectShell } from "@/components/layout/ProjectShell";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import { useAppStore } from "@/store/app";

export default function DailyLogsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useAppStore();
  
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProject && projectId) {
      navigate('/projects');
    }
  }, [selectedProject, projectId, navigate]);

  const loadData = () => {
    if (!projectId) return;
    
    setLoading(true);
    fetchDailyLogsFeed({ projectId, daysBack: 7 })
      .then(setDays)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (!projectId) return null;

  if (loading) {
    return (
      <ProjectShell>
        <div className="flex flex-col h-full">
          <ProjectHeader />
          <div className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-muted-foreground">Loading daily logs...</div>
          </div>
        </div>
      </ProjectShell>
    );
  }

  return (
    <ProjectShell>
      <div className="flex flex-col h-full">
        <ProjectHeader />
        <div className="flex-1 overflow-auto">
          <DailyLogsFeed days={days} projectId={projectId} onRefresh={loadData} />
        </div>
      </div>
    </ProjectShell>
  );
}
