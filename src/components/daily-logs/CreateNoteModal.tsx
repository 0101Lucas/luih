import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { FileUpload, FileUploadItem } from "@/components/ui/file-upload";
import { createDailyLog, listProjectTodos, ProjectTodo } from "@/lib/db/dailyLogs";
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
  const [fileItems, setFileItems] = useState<FileUploadItem[]>([]);
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

  const handleRetryUpload = async (index: number) => {
    const fileItem = fileItems[index];
    if (!fileItem) return;

    // Mark as uploading
    const updatedItems = [...fileItems];
    updatedItems[index] = { ...fileItem, status: 'uploading', progress: 0 };
    setFileItems(updatedItems);

    try {
      // Simulate upload progress (in real implementation, this would be handled by the upload function)
      for (let progress = 0; progress <= 100; progress += 10) {
        updatedItems[index] = { ...fileItem, status: 'uploading', progress };
        setFileItems([...updatedItems]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      updatedItems[index] = { ...fileItem, status: 'success' };
      setFileItems([...updatedItems]);
    } catch (error) {
      updatedItems[index] = { 
        ...fileItem, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Upload failed'
      };
      setFileItems([...updatedItems]);
    }
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
    
    // Mark all files as uploading
    const updatedItems = fileItems.map(item => ({ ...item, status: 'uploading' as const, progress: 0 }));
    setFileItems(updatedItems);

    try {
      const files = fileItems.map(item => item.file);
      const result = await createDailyLog({
        projectId,
        todoId: linkedTodoId,
        comment,
        files,
      });

      // Update file statuses based on upload results
      const finalItems = fileItems.map((item, index) => {
        const uploadResult = result.uploadResults[index];
        return {
          ...item,
          status: uploadResult?.success ? 'success' as const : 'error' as const,
          error: uploadResult?.error
        };
      });
      setFileItems(finalItems);

      const failedCount = result.uploadResults.filter(r => !r.success).length;
      const successCount = result.uploadResults.filter(r => r.success).length;

      if (failedCount === 0) {
        toast({
          title: "Success",
          description: "Log entry created successfully with all files uploaded",
        });
        
        // Reset form and close
        setComment("");
        setLinkedTodoId(undefined);
        setFileItems([]);
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: "Partially successful",
          description: `Log entry created. ${successCount} files uploaded, ${failedCount} failed. You can retry failed uploads.`,
          variant: "default",
        });
        onSuccess(); // Still refresh the list
      }
    } catch (error) {
      console.error('Error creating note:', error);
      
      // Mark all files as error
      const errorItems = fileItems.map(item => ({ 
        ...item, 
        status: 'error' as const, 
        error: 'Upload failed' 
      }));
      setFileItems(errorItems);
      
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
            <FileUpload
              files={fileItems}
              onFilesChange={setFileItems}
              onRetry={handleRetryUpload}
              accept="image/*,video/*"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (fileItems.length > 0 ? "Uploading files..." : "Creating...") : "Create Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}