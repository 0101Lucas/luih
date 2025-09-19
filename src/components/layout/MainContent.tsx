import { useState } from "react";
import { Building2, Calendar, CheckSquare, FileText, Clock, DollarSign, BarChart3, MessageSquare, Settings, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { DailyLogsTab } from "@/components/tabs/DailyLogsTab";
import { TodosTab } from "@/components/tabs/TodosTab";
import { ComingSoonTab } from "@/components/tabs/ComingSoonTab";

interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: string;
  dueDate: string;
  progress: number;
}

interface MainContentProps {
  selectedProject: Project | null;
  activeTab: string;
}

const projectTabs = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "daily-logs", label: "Daily Logs", icon: FileText },
  { id: "todos", label: "To-Do's", icon: CheckSquare },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "change-orders", label: "Change Orders", icon: Settings },
  { id: "selections", label: "Selections", icon: FolderOpen },
  { id: "warranties", label: "Warranties", icon: Settings },
  { id: "time-clock", label: "Time Clock", icon: Clock },
  { id: "client-updates", label: "Client Updates", icon: MessageSquare },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "financials", label: "Financials", icon: DollarSign },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

export function MainContent({ selectedProject, activeTab }: MainContentProps) {
  const [currentTab, setCurrentTab] = useState("overview");

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Job Summary
            </h2>
            <p className="text-muted-foreground max-w-md">
              Select a project from the sidebar to get started and view project details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return <OverviewTab project={selectedProject} />;
      case "daily-logs":
        return <DailyLogsTab project={selectedProject} />;
      case "todos":
        return <TodosTab project={selectedProject} />;
      default:
        return <ComingSoonTab tabName={projectTabs.find(tab => tab.id === currentTab)?.label || currentTab} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Project Header */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">
              {selectedProject.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{selectedProject.code}</span>
              <span>•</span>
              <span>{selectedProject.location}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {selectedProject.status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-lg font-semibold text-foreground">
                {selectedProject.progress}%
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${selectedProject.progress}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Project Tabs */}
      <div className="flex-1">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="h-full flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-card border-b border-border px-6">
            <TabsList className="h-auto p-0 bg-transparent grid grid-cols-6 lg:grid-cols-13 gap-0">
              {projectTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 px-4 py-3 text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary hover:bg-muted/50"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {renderTabContent()}
          </div>
        </Tabs>
      </div>
    </div>
  );
}