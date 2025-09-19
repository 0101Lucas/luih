import { ReactNode } from "react";
import { ProjectSidebar } from "./ProjectSidebar";

interface ProjectShellProps {
  children: ReactNode;
}

export function ProjectShell({ children }: ProjectShellProps) {
  return (
    <div className="min-h-screen grid grid-cols-[280px_1fr]">
      {/* Left Column - Project Sidebar */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto">
        <ProjectSidebar />
      </div>
      
      {/* Right Column - Main Content */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto px-6 py-6">
        {children}
      </div>
    </div>
  );
}