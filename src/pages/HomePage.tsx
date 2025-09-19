import { Building2 } from "lucide-react";
import { ProjectShell } from "@/components/layout/ProjectShell";

export function HomePage() {
  return (
    <ProjectShell>
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome to Vibe Code
            </h2>
            <p className="text-muted-foreground max-w-md">
              Select a section from the navigation above to get started.
            </p>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}