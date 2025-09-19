import { Building2 } from "lucide-react";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";

export function ProjectsPage() {
  return (
    <div className="flex-1 flex overflow-hidden">
      <ProjectSidebar />
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Project Management
            </h2>
            <p className="text-muted-foreground max-w-md">
              Select a project from the sidebar to get started and view project details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}