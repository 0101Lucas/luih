import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Plus, Filter, MoreVertical, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listProjects, createProject } from "@/lib/api";
import { Project, CreateProject } from "@/lib/types";
import { useAppStore } from "@/store/app";
import { useToast } from "@/hooks/use-toast";

export function ProjectSidebar() {
  const [searchValue, setSearchValue] = useState("");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    name: "",
    code: "",
    city: "",
    state: "",
    template: "",
  });
  
  const { selectedProject, setSelectedProject } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await listProjects();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    (project.external_ref || "").toLowerCase().includes(searchValue.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "completed":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const handleCreateProject = async () => {
    try {
      const projectData: CreateProject = {
        name: newProject.name,
        code: newProject.code,
        location: `${newProject.city}, ${newProject.state}`,
        template_id: newProject.template || undefined,
      };
      
      const createdProject = await createProject(projectData);
      
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      
      // Auto-select the new project
      setSelectedProject(createdProject);
      
      // Navigate to daily-logs for the new project
      navigate(`/projects/${createdProject.id}/daily-logs`);
      
      setShowNewProjectModal(false);
      setNewProject({ name: "", code: "", city: "", state: "", template: "" });
      loadProjects(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    
    // Determine current section from URL to maintain it when switching projects
    const currentPath = location.pathname;
    let section = "daily-logs"; // default
    
    if (currentPath.includes("/schedule")) section = "schedule";
    else if (currentPath.includes("/daily-logs")) section = "daily-logs";
    else if (currentPath.includes("/todos")) section = "todos";
    else if (currentPath.includes("/change-orders")) section = "change-orders";
    else if (currentPath.includes("/selections")) section = "selections";
    else if (currentPath.includes("/warranties")) section = "warranties";
    else if (currentPath.includes("/time-clock")) section = "time-clock";
    else if (currentPath.includes("/client-updates")) section = "client-updates";
    
    // Navigate to the same section but with the new project ID
    navigate(`/projects/${project.id}/${section}`);
  };

  return (
    <div className="w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* New Project Button */}
        <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
          <DialogTrigger asChild>
            <Button className="w-full bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to your workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Project Code</Label>
                <Input
                  id="code"
                  value={newProject.code}
                  onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                  placeholder="e.g., MFH-2024-001"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newProject.city}
                    onChange={(e) => setNewProject({ ...newProject, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newProject.state}
                    onChange={(e) => setNewProject({ ...newProject, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="template">Template</Label>
                <Select value={newProject.template} onValueChange={(value) => setNewProject({ ...newProject, template: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential Construction</SelectItem>
                    <SelectItem value="commercial">Commercial Building</SelectItem>
                    <SelectItem value="renovation">Renovation Project</SelectItem>
                    <SelectItem value="custom">Custom Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewProjectModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} className="bg-primary hover:bg-primary-hover">
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {projects.length === 0 ? "No projects yet" : "No projects match your search"}
          </div>
        ) : (
          filteredProjects.map((project) => (
          <Card
            key={project.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedProject?.id === project.id
                ? "ring-2 ring-primary bg-primary-subtle"
                : "hover:bg-sidebar-hover"
            }`}
            onClick={() => handleProjectSelect(project)}
          >
            <div className="space-y-3">
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{project.external_ref || 'No code'}</p>
                </div>
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>

              {/* Location and Date */}
              <div className="space-y-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location TBD
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Status and Progress */}
              <div className="flex items-center justify-between">
                <Badge
                  className={`text-xs px-2 py-1 ${getStatusColor(project.status)} text-white`}
                >
                  {project.status}
                </Badge>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: '0%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    0%
                  </span>
                </div>
              </div>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}