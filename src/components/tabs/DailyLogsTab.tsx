import { useState } from "react";
import { Plus, Search, Filter, Calendar, User, FileText, Camera, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: string;
  dueDate: string;
  progress: number;
}

interface DailyLog {
  id: string;
  date: string;
  author: string;
  title: string;
  content: string;
  type: "progress" | "delay" | "inspection" | "safety" | "weather";
  attachments: number;
}

interface DailyLogsTabProps {
  project: Project;
}

const mockLogs: DailyLog[] = [
  {
    id: "1",
    date: "2024-01-15",
    author: "John Smith",
    title: "Framing Progress Update",
    content: "Completed framing for the second floor. All walls are up and square. Ready for electrical rough-in tomorrow.",
    type: "progress",
    attachments: 3,
  },
  {
    id: "2",
    date: "2024-01-14",
    author: "Sarah Johnson",
    title: "Weather Delay",
    content: "Heavy rain prevented concrete pour. Rescheduled for tomorrow morning. All materials covered and protected.",
    type: "weather",
    attachments: 1,
  },
  {
    id: "3",
    date: "2024-01-13",
    author: "Mike Davis",
    title: "Safety Inspection Completed",
    content: "OSHA safety inspection passed with no violations. Team commended for excellent safety practices.",
    type: "safety",
    attachments: 2,
  },
];

export function DailyLogsTab({ project }: DailyLogsTabProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLog, setNewLog] = useState({
    title: "",
    content: "",
    type: "progress" as const,
  });

  const filteredLogs = mockLogs.filter((log) =>
    log.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    log.content.toLowerCase().includes(searchValue.toLowerCase()) ||
    log.author.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "progress":
        return "bg-success text-success-foreground";
      case "delay":
        return "bg-warning text-warning-foreground";
      case "inspection":
        return "bg-primary text-primary-foreground";
      case "safety":
        return "bg-accent text-accent-foreground";
      case "weather":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const handleCreateLog = () => {
    console.log("Creating log:", newLog);
    setShowCreateModal(false);
    setNewLog({ title: "", content: "", type: "progress" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Daily Logs</h2>
          <p className="text-muted-foreground">Track daily progress and project updates</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Daily Log Entry</DialogTitle>
              <DialogDescription>
                Document today's progress and activities for {project.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Entry Title</Label>
                <Input
                  id="title"
                  value={newLog.title}
                  onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                  placeholder="Brief description of today's work"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Entry Type</Label>
                <Select value={newLog.type} onValueChange={(value: any) => setNewLog({ ...newLog, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progress">Progress Update</SelectItem>
                    <SelectItem value="delay">Delay Report</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="safety">Safety Report</SelectItem>
                    <SelectItem value="weather">Weather Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  value={newLog.content}
                  onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                  placeholder="Describe the work completed, challenges encountered, or other relevant information..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label>Attachments</Label>
                <Button variant="outline" className="justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLog} className="bg-primary hover:bg-primary-hover">
                Create Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search log entries..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Daily Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg">{log.title}</CardTitle>
                    <Badge className={`text-xs ${getTypeColor(log.type)}`}>
                      {log.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {log.date}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {log.author}
                    </div>
                    {log.attachments > 0 && (
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-1" />
                        {log.attachments} photo{log.attachments > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{log.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No log entries found</h3>
          <p className="text-muted-foreground mb-4">
            {searchValue ? "Try adjusting your search terms." : "Start by creating your first daily log entry."}
          </p>
          {!searchValue && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create First Entry
            </Button>
          )}
        </div>
      )}
    </div>
  );
}