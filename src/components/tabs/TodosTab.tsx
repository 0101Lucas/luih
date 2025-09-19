import { useState } from "react";
import { Plus, Search, Filter, Calendar, User, CheckCircle, Circle, AlertTriangle, Paperclip, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAppStore } from "@/store/app";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
  attachments: number;
  comments: number;
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Electrical Rough-in Inspection",
    description: "Schedule and complete electrical rough-in inspection with city inspector",
    status: "overdue",
    priority: "urgent",
    assignee: "John Smith",
    dueDate: "2024-01-12",
    attachments: 2,
    comments: 3,
    subtasks: [
      { id: "1a", title: "Contact inspector", completed: true },
      { id: "1b", title: "Prepare electrical panels", completed: true },
      { id: "1c", title: "Complete inspection", completed: false },
    ],
  },
  {
    id: "2",
    title: "Plumbing Installation",
    description: "Install all plumbing fixtures in master bathroom",
    status: "in-progress",
    priority: "high",
    assignee: "Mike Davis",
    dueDate: "2024-01-18",
    attachments: 1,
    comments: 1,
    subtasks: [
      { id: "2a", title: "Install bathtub", completed: true },
      { id: "2b", title: "Install toilet", completed: false },
      { id: "2c", title: "Install vanity", completed: false },
    ],
  },
  {
    id: "3",
    title: "HVAC System Installation",
    description: "Install heating and cooling system throughout the house",
    status: "pending",
    priority: "medium",
    assignee: "Sarah Johnson",
    dueDate: "2024-01-25",
    attachments: 0,
    comments: 0,
    subtasks: [
      { id: "3a", title: "Install ductwork", completed: false },
      { id: "3b", title: "Install units", completed: false },
      { id: "3c", title: "Test system", completed: false },
    ],
  },
];

export function TodosTab() {
  const { selectedProject } = useAppStore();
  const [searchValue, setSearchValue] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    assignee: "",
    dueDate: "",
  });

  const filteredTodos = mockTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    todo.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    todo.assignee.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-primary text-primary-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-accent text-accent-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleCreateTodo = () => {
    console.log("Creating todo:", newTodo);
    setShowCreateModal(false);
    setNewTodo({ title: "", description: "", priority: "medium", assignee: "", dueDate: "" });
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    // Implementation would update the subtask completion status
    console.log("Toggle subtask:", todoId, subtaskId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">To-Do's</h2>
          <p className="text-muted-foreground">Manage tasks and project deliverables</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create To-Do
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New To-Do</DialogTitle>
              <DialogDescription>
                Add a new task for {selectedProject?.name || 'this project'}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="Provide details about this task..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTodo.priority} onValueChange={(value: any) => setNewTodo({ ...newTodo, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={newTodo.assignee} onValueChange={(value) => setNewTodo({ ...newTodo, assignee: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="mike-davis">Mike Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTodo} className="bg-primary hover:bg-primary-hover">
                Create To-Do
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
            placeholder="Search to-dos..."
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

      {/* To-Do List */}
      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <Card key={todo.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedTodo(todo)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(todo.status)}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{todo.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(todo.status)}`}>
                          {todo.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Subtasks */}
                    {todo.subtasks.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Subtasks:</div>
                        <div className="space-y-1">
                          {todo.subtasks.map((subtask) => (
                            <div key={subtask.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={subtask.completed}
                                onCheckedChange={() => toggleSubtask(todo.id, subtask.id)}
                                className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                              />
                              <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {todo.assignee}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due {todo.dueDate}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {todo.attachments > 0 && (
                          <div className="flex items-center">
                            <Paperclip className="h-4 w-4 mr-1" />
                            {todo.attachments}
                          </div>
                        )}
                        {todo.comments > 0 && (
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {todo.comments}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No to-dos found</h3>
          <p className="text-muted-foreground mb-4">
            {searchValue ? "Try adjusting your search terms." : "Start by creating your first to-do item."}
          </p>
          {!searchValue && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-primary hover:bg-primary-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create First To-Do
            </Button>
          )}
        </div>
      )}
    </div>
  );
}