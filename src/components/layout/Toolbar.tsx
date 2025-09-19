import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Bell, MessageCircle, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/app";
import { listProjects } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "sales", label: "Sales" },
  { id: "project-management", label: "Project Management", hasSubmenu: true },
  { id: "files", label: "Files" },
  { id: "messaging", label: "Messaging" },
  { id: "financials", label: "Financials" },
  { id: "reports", label: "Reports" },
];

export function Toolbar({ activeTab, onTabChange }: ToolbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const navigate = useNavigate();
  const { selectedProject, setSelectedProject } = useAppStore();
  const { toast } = useToast();

  const handleProjectMenuClick = async (section: string) => {
    if (selectedProject) {
      navigate(`/projects/${selectedProject.id}/${section}`);
      return;
    }

    // Auto-select first project if none selected
    setIsLoadingProject(true);
    try {
      const projects = await listProjects();
      if (projects.length === 0) {
        navigate('/projects');
        toast({
          title: "No projects found",
          description: "Create a project first to access project management features.",
          variant: "destructive",
        });
        return;
      }

      const firstProject = projects[0];
      setSelectedProject(firstProject);
      navigate(`/projects/${firstProject.id}/${section}`);
    } catch (error) {
      console.error('Failed to load projects:', error);
      navigate('/projects');
      toast({
        title: "Error loading projects",
        description: "Please try again or select a project manually.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProject(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 h-toolbar bg-toolbar border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* Left side - Logo and Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/luih-logo.png" 
            alt="LUIH Luxury Homes" 
            className="h-8"
          />
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative">
              {tab.hasSubmenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`
                        px-4 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                          activeTab === tab.id
                            ? "bg-nav-active text-primary-foreground"
                            : "text-toolbar-foreground hover:bg-nav-hover hover:text-foreground"
                        }
                      `}
                    >
                      {tab.label}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("schedule")}
                      disabled={isLoadingProject}
                    >
                      Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("daily-logs")}
                      disabled={isLoadingProject}
                    >
                      Daily Logs
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("todos")}
                      disabled={isLoadingProject}
                    >
                      To-Do's
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("change-orders")}
                      disabled={isLoadingProject}
                    >
                      Change Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("selections")}
                      disabled={isLoadingProject}
                    >
                      Selections
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("warranties")}
                      disabled={isLoadingProject}
                    >
                      Warranties
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("time-clock")}
                      disabled={isLoadingProject}
                    >
                      Time Clock
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleProjectMenuClick("client-updates")}
                      disabled={isLoadingProject}
                    >
                      Client Updates
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-nav-active text-primary-foreground"
                        : "text-toolbar-foreground hover:bg-nav-hover hover:text-foreground"
                    }
                  `}
                >
                  {tab.label}
                </Button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right side - Search and Actions */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, contacts..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 w-80 bg-background"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <Button size="sm" className="bg-primary hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-accent hover:bg-accent">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}