import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import { ComingSoonTab } from "@/components/tabs/ComingSoonTab";
import { useAppStore } from "@/store/app";

export function TimeClockPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useAppStore();

  useEffect(() => {
    if (!selectedProject && projectId) {
      navigate('/projects');
    }
  }, [selectedProject, projectId, navigate]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <ProjectSidebar />
      <div className="flex-1 flex flex-col bg-background">
        <ProjectHeader />
        <div className="flex-1 overflow-auto">
          <ComingSoonTab tabName="Time Clock" />
        </div>
      </div>
    </div>
  );
}