import { useState } from "react";
import { Toolbar } from "@/components/layout/Toolbar";
import { ProjectSidebar } from "@/components/layout/ProjectSidebar";
import { MainContent } from "@/components/layout/MainContent";

export function VibeCodeApp() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
          <ProjectSidebar />
        )}
        
        {/* Main Content Area */}
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
}