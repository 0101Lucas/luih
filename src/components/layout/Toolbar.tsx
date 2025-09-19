import { useState } from "react";
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

interface ToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", label: "Home" },
  { id: "sales", label: "Sales" },
  { id: "project-management", label: "Project Management", hasSubmenu: true },
  { id: "files", label: "Files" },
  { id: "messaging", label: "Messaging" },
  { id: "financials", label: "Financials" },
  { id: "reports", label: "Reports" },
];

export function Toolbar({ activeTab, onTabChange }: ToolbarProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="h-toolbar bg-toolbar border-b border-border flex items-center justify-between px-6">
      {/* Left side - Logo and Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">V</span>
          </div>
          <span className="font-heading font-semibold text-lg text-foreground">
            Vibe Code
          </span>
        </div>

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
                    <DropdownMenuItem onClick={() => onTabChange("overview")}>
                      Overview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTabChange("daily-logs")}>
                      Daily Logs
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTabChange("todos")}>
                      To-Do's
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onTabChange("schedule")}>
                      Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTabChange("change-orders")}>
                      Change Orders
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