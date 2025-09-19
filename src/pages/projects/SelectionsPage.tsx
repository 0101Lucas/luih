import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ProjectShell } from "@/components/layout/ProjectShell";
import { ProjectHeader } from "@/components/layout/ProjectHeader";
import { ComingSoonTab } from "@/components/tabs/ComingSoonTab";
import { useAppStore } from "@/store/app";

export function SelectionsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject } = useAppStore();

  useEffect(() => {
    if (!selectedProject && projectId) {
      navigate('/projects');
    }
  }, [selectedProject, projectId, navigate]);

  return (
    <ProjectShell>
      <div className="flex flex-col h-full">
        <ProjectHeader />
        <div className="flex-1 overflow-auto">
          <ComingSoonTab tabName="Selections" />
        </div>
      </div>
    </ProjectShell>
  );
}