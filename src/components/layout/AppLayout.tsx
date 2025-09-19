import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toolbar } from "@/components/layout/Toolbar";

export function AppLayout() {
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (location.pathname.startsWith('/projects')) {
      return 'project-management';
    }
    if (location.pathname === '/') {
      return 'home';
    }
    return activeTab;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Toolbar */}
      <Toolbar activeTab={getActiveTab()} onTabChange={handleTabChange} />
      
      {/* Main Layout */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}