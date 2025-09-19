import { useState, useEffect } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createNoteLog, listProjectTodos, ProjectTodo } from "@/lib/db/dailyLogs";
import { useToast } from "@/hooks/use-toast";

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onSuccess: () => void;
}

export function CreateNoteModal({ open, onOpenChange, projectId, onSuccess }: CreateNoteModalProps) {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [linkedTodoId, setLinkedTodoId] = useState<string | undefined>();
  const [files, setFiles] = useState<File[]>([]);
  const [todos, setTodos] = useState<ProjectTodo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && projectId) {
      loadTodos();
    }
  }, [open, projectId]);

  const loadTodos = async () => {
    try {
      const data = await listProjectTodos(projectId);
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length > 2) {
      toast({
        title: "Too many files",
        description: "Maximum 2 files allowed",
        variant: "destructive",
      });
      return;
    }

    const imageFiles = selectedFiles.filter(f => f.type.startsWith('image/'));
    const videoFiles = selectedFiles.filter(f => f.type.startsWith('video/'));

    if (videoFiles.length > 1 || (videoFiles.length === 1 && imageFiles.length > 0)) {
      toast({
        title: "Invalid file combination",
        description: "Only 1 video file OR up to 2 images allowed",
        variant: "destructive",
      });
      return;
    }

    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please enter a comment for this log entry",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await createNoteLog({
        projectId,
        todoId: linkedTodoId,
        comment,
        files,
      });

      toast({
        title: "Success",
        description: "Log entry created successfully",
      });

      // Reset form
      setComment("");
      setLinkedTodoId(undefined);
      setFiles([]);
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create log entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Log Entry</DialogTitle>
          <DialogDescription>
            Document activities and progress for this project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the work completed, progress made, or other relevant information..."
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linked-todo">Link To-Do (Optional)</Label>
            <Select value={linkedTodoId} onValueChange={setLinkedTodoId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a to-do to link..." />
              </SelectTrigger>
              <SelectContent>
                {todos.map((todo) => (
                  <SelectItem key={todo.id} value={todo.id}>
                    {todo.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Evidence (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Camera className="h-4 w-4 mr-2" />
                  Browse
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
            {files.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {files.length} file{files.length > 1 ? 's' : ''} selected: {files.map(f => f.name).join(', ')}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum 2 images OR 1 video file
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (files.length > 0 ? "Uploading files..." : "Creating...") : "Create Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}