import { useState } from "react";
import { Toolbar } from "@/components/layout/Toolbar";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { MainContent } from "@/components/layout/MainContent";

interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: "active" | "pending" | "completed";
  dueDate: string;
  progress: number;
}

export function VibeCodeApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // If switching to project management tab, ensure we show overview by default
    if (tab === "project-management" && !selectedProject) {
      // Could potentially auto-select first project or show project selection prompt
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    // When a project is selected, switch to project management if not already there
    if (!["project-management", "overview", "daily-logs", "todos", "schedule", "change-orders", "selections", "warranties", "time-clock", "client-updates"].includes(activeTab)) {
      setActiveTab("overview");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <Toolbar activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Only show for project-related tabs */}
        {(activeTab === "project-management" || 
          ["overview", "daily-logs", "todos", "schedule", "change-orders", "selections", "warranties", "time-clock", "client-updates"].includes(activeTab)) && (
          <ProjectSidebar 
            selectedProject={selectedProject} 
            onSelectProject={handleSelectProject} 
          />
        )}
        
        {/* Main Content Area */}
        <MainContent 
          selectedProject={selectedProject} 
          activeTab={activeTab}
        />
      </div>
    </div>
  );
}