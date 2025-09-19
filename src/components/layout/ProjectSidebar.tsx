import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { listProjects, createProject, updateProject, deleteProject } from "@/lib/api";
import { Project, CreateProject } from "@/lib/types";
import { useAppStore } from "@/store/app";
import { useToast } from "@/hooks/use-toast";

export function ProjectSidebar() {
  const [searchValue, setSearchValue] = useState("");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
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

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      code: project.external_ref || "",
      city: "",
      state: "",
      template: "",
    });
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      const projectData: Partial<CreateProject> = {
        name: newProject.name,
        code: newProject.code,
      };
      
      await updateProject(editingProject.id, projectData);
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      setShowEditProjectModal(false);
      setEditingProject(null);
      setNewProject({ name: "", code: "", city: "", state: "", template: "" });
      loadProjects(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProject(projectToDelete.id);
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      // If the deleted project was selected, clear selection
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(null);
        navigate('/');
      }
      
      setShowDeleteDialog(false);
      setProjectToDelete(null);
      loadProjects(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
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
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border flex justify-center">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/luih-logo.png" 
            alt="LUIH Luxury Homes" 
            className="h-20 w-auto"
          />
        </button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Projects</h2>
          <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
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

      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {projects.length === 0 ? "No projects yet" : "No projects match your search"}
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-3 transition-all rounded-md ${
                selectedProject?.id === project.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-sidebar-hover text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleProjectSelect(project)}
                >
                  <h3 className="font-medium text-sm truncate">
                    {project.name}
                  </h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 ml-2 hover:bg-background/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleEditProject(project)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setProjectToDelete(project);
                        setShowDeleteDialog(true);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Project Modal */}
      <Dialog open={showEditProjectModal} onOpenChange={setShowEditProjectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Project Code</Label>
              <Input
                id="edit-code"
                value={newProject.code}
                onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                placeholder="e.g., MFH-2024-001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject} className="bg-primary hover:bg-primary-hover">
              Update Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}