import { AlertTriangle, Calendar, CheckCircle, Clock, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: string;
  dueDate: string;
  progress: number;
}

interface OverviewTabProps {
  project: Project;
}

const quickActions = [
  { label: "Add Daily Log", icon: Plus, color: "bg-primary" },
  { label: "Create To-Do", icon: Plus, color: "bg-accent" },
  { label: "Schedule Meeting", icon: Calendar, color: "bg-success" },
  { label: "Upload Files", icon: Plus, color: "bg-warning" },
];

const pastDueItems = [
  { title: "Foundation inspection", type: "inspection", daysLate: 3 },
  { title: "Electrical rough-in", type: "task", daysLate: 1 },
];

const dueTodayItems = [
  { title: "Plumbing walkthrough", type: "meeting", time: "10:00 AM" },
  { title: "Material delivery", type: "delivery", time: "2:00 PM" },
];

const recentLogs = [
  { date: "2024-01-15", author: "John Smith", title: "Framing progress update", type: "progress" },
  { date: "2024-01-14", author: "Sarah Johnson", title: "Weather delay reported", type: "delay" },
  { date: "2024-01-13", author: "Mike Davis", title: "Inspection completed", type: "inspection" },
];

export function OverviewTab({ project }: OverviewTabProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>
            Common actions for {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-muted/50"
                >
                  <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Past Due Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Past Due
              </CardTitle>
              <CardDescription>Items that need immediate attention</CardDescription>
            </div>
            <Badge variant="destructive" className="text-xs">
              {pastDueItems.length}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastDueItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border-l-4 border-destructive">
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{item.type}</div>
                </div>
                <Badge variant="outline" className="text-destructive border-destructive">
                  {item.daysLate}d late
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Due Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center text-warning">
                <Clock className="h-5 w-5 mr-2" />
                Due Today
              </CardTitle>
              <CardDescription>Tasks and events scheduled for today</CardDescription>
            </div>
            <Badge className="bg-warning text-warning-foreground text-xs">
              {dueTodayItems.length}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {dueTodayItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border-l-4 border-warning">
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{item.type}</div>
                </div>
                <Badge variant="outline" className="text-warning border-warning">
                  {item.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Daily Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-success" />
              Recent Daily Logs
            </CardTitle>
            <CardDescription>Latest project updates and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer">
                <div className="flex-1">
                  <div className="font-medium text-sm">{log.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.author} • {log.date}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs capitalize">
                  {log.type}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Logs
            </Button>
          </CardContent>
        </Card>

        {/* This Week's Agenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              This Week's Agenda
            </CardTitle>
            <CardDescription>Upcoming events and milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                <div>
                  <div className="font-medium text-sm">Project milestone review</div>
                  <div className="text-xs text-muted-foreground">Tomorrow • 9:00 AM</div>
                </div>
                <Badge className="bg-primary text-primary-foreground text-xs">
                  Meeting
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border-l-4 border-accent">
                <div>
                  <div className="font-medium text-sm">HVAC installation begins</div>
                  <div className="text-xs text-muted-foreground">Wednesday • All day</div>
                </div>
                <Badge className="bg-accent text-accent-foreground text-xs">
                  Task
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border-l-4 border-success">
                <div>
                  <div className="font-medium text-sm">Final walkthrough</div>
                  <div className="text-xs text-muted-foreground">Friday • 3:00 PM</div>
                </div>
                <Badge className="bg-success text-success-foreground text-xs">
                  Inspection
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}