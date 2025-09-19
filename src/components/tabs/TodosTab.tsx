import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Calendar, User, CheckCircle, Circle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { listTodos, createTodo, updateTodo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CreateTodoForm {
  title: string;
  notes: string;
  priority: "none" | "low" | "medium" | "high";
  assigned_to: string;
  due_date: string;
  status: "incomplete" | "in_progress" | "complete";
}

const priorityColors = {
  none: "bg-muted text-muted-foreground",
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
};

const statusColors = {
  incomplete: "bg-gray-100 text-gray-800",
  complete: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
};

export function TodosTab() {
  const { selectedProject } = useAppStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [newTodo, setNewTodo] = useState<CreateTodoForm>({
    title: "",
    notes: "",
    priority: "none",
    assigned_to: "",
    due_date: "",
    status: "incomplete",
  });

  // Fetch todos
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos', selectedProject?.id],
    queryFn: () => selectedProject ? listTodos(selectedProject.id) : Promise.resolve([]),
    enabled: !!selectedProject?.id,
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTodoForm) => createTodo(selectedProject!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', selectedProject?.id] });
      setShowCreateModal(false);
      setNewTodo({ title: "", notes: "", priority: "none", assigned_to: "", due_date: "", status: "incomplete" });
      toast({ title: "To-Do created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create To-Do", variant: "destructive" });
    },
  });

  // Update todo mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTodoForm> }) => 
      updateTodo(selectedProject!.id, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', selectedProject?.id] });
      setEditingTodo(null);
      toast({ title: "To-Do updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update To-Do", variant: "destructive" });
    },
  });

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    (todo.notes && todo.notes.toLowerCase().includes(searchValue.toLowerCase()))
  );

  const handleCreateTodo = () => {
    if (!newTodo.title.trim()) return;
    createMutation.mutate(newTodo);
  };

  const handleEditTodo = (todo: any) => {
    setEditingTodo({
      ...todo,
      due_date: todo.due_date ? todo.due_date.split('T')[0] : "",
    });
  };

  const handleUpdateTodo = () => {
    if (!editingTodo.title.trim()) return;
    const { id, ...data } = editingTodo;
    updateMutation.mutate({ id, data });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

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
            <Button>
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newTodo.notes}
                  onChange={(e) => setNewTodo({ ...newTodo, notes: e.target.value })}
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
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <Input
                    id="assigned_to"
                    value={newTodo.assigned_to}
                    onChange={(e) => setNewTodo({ ...newTodo, assigned_to: e.target.value })}
                    placeholder="User ID"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTodo.due_date}
                  onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTodo} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create To-Do"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
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
      </div>

      {/* To-Do Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTodos.map((todo) => (
              <TableRow key={todo.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  {todo.status === 'complete' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{todo.title}</div>
                    {todo.notes && (
                      <div className="text-sm text-muted-foreground mt-1">{todo.notes}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {todo.priority !== 'none' && (
                    <Badge className={`text-xs ${priorityColors[todo.priority as keyof typeof priorityColors]}`}>
                      {todo.priority}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {todo.assigned_to && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-1" />
                      {todo.assigned_to}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {todo.due_date && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(todo.due_date).toLocaleDateString()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(todo.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTodo(todo);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Todo Dialog */}
      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit To-Do</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input
                  id="edit-title"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingTodo.notes || ""}
                  onChange={(e) => setEditingTodo({ ...editingTodo, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select value={editingTodo.priority} onValueChange={(value) => setEditingTodo({ ...editingTodo, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingTodo.status} onValueChange={(value) => setEditingTodo({ ...editingTodo, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-assigned">Assigned To</Label>
                  <Input
                    id="edit-assigned"
                    value={editingTodo.assigned_to || ""}
                    onChange={(e) => setEditingTodo({ ...editingTodo, assigned_to: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-due">Due Date</Label>
                  <Input
                    id="edit-due"
                    type="date"
                    value={editingTodo.due_date}
                    onChange={(e) => setEditingTodo({ ...editingTodo, due_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTodo(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTodo} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update To-Do"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredTodos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No to-dos found</h3>
          <p className="text-muted-foreground mb-4">
            {searchValue ? "Try adjusting your search terms." : "Start by creating your first to-do item."}
          </p>
          {!searchValue && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First To-Do
            </Button>
          )}
        </div>
      )}
    </div>
  );
}