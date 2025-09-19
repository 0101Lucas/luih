import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { upsertExecutionReport, listReasons, Reason } from "@/lib/db/dailyLogs";
import { useToast } from "@/hooks/use-toast";

interface ExecutionReportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todoId: string | null;
  todoTitle?: string;
  onSuccess: () => void;
}

export function ExecutionReportSheet({ 
  open, 
  onOpenChange, 
  todoId, 
  todoTitle, 
  onSuccess 
}: ExecutionReportSheetProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<'executed' | 'partial' | 'not_executed'>('executed');
  const [reasonId, setReasonId] = useState<string | undefined>();
  const [detail, setDetail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedReason = reasons.find(r => r.id === reasonId);
  const requiresDetail = selectedReason?.label === 'Other';

  useEffect(() => {
    if (open) {
      loadReasons();
      // Reset form
      setStatus('executed');
      setReasonId(undefined);
      setDetail("");
      setFiles([]);
    }
  }, [open]);

  const loadReasons = async () => {
    try {
      const data = await listReasons();
      setReasons(data);
    } catch (error) {
      console.error('Error loading reasons:', error);
      toast({
        title: "Error",
        description: "Failed to load reasons",
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
    if (!todoId) return;

    // Validation
    if ((status === 'partial' || status === 'not_executed') && !reasonId) {
      toast({
        title: "Reason required",
        description: "Please select a reason for partial or not executed status",
        variant: "destructive",
      });
      return;
    }

    if (requiresDetail && !detail.trim()) {
      toast({
        title: "Detail required",
        description: "Please provide details when 'Other' reason is selected",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await upsertExecutionReport({
        todoId,
        status,
        reasonId: (status === 'partial' || status === 'not_executed') ? reasonId : undefined,
        detail: requiresDetail ? detail : undefined,
        files,
      });

      toast({
        title: "Success",
        description: "Execution report saved successfully",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving execution report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save execution report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Fill Execution Report</SheetTitle>
          <SheetDescription>
            Report on the execution status of: {todoTitle}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label>Status *</Label>
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as 'executed' | 'partial' | 'not_executed')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="executed" id="executed" />
                <Label htmlFor="executed">Executed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial">Partially Executed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_executed" id="not_executed" />
                <Label htmlFor="not_executed">Not Executed</Label>
              </div>
            </RadioGroup>
          </div>

          {(status === 'partial' || status === 'not_executed') && (
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason *</Label>
              <Select value={reasonId} onValueChange={setReasonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {requiresDetail && (
            <div className="grid gap-2">
              <Label htmlFor="detail">Detail *</Label>
              <Textarea
                id="detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Please provide specific details..."
                rows={3}
              />
            </div>
          )}

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
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Report"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}