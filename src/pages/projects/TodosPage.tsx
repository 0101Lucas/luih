import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProjectShell } from "@/components/layout/ProjectShell";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import { TodosTab } from "@/components/tabs/TodosTab";
import { useAppStore } from "@/store/app";

export function TodosPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useAppStore();

  useEffect(() => {
    if (!selectedProject && projectId) {
      // If no project selected but we have an ID, redirect to projects page
      navigate('/projects');
    }
  }, [selectedProject, projectId, navigate]);

  return (
    <ProjectShell>
      <div className="flex flex-col h-full">
        <ProjectHeader />
        <div className="flex-1 overflow-auto">
          <TodosTab />
        </div>
      </div>
    </ProjectShell>
  );
}