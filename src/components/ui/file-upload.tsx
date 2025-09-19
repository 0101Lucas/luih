import { useState, useRef } from "react";
import { Upload, X, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface FileUploadItem {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

interface FileUploadProps {
  files: FileUploadItem[];
  onFilesChange: (files: FileUploadItem[]) => void;
  onRetry?: (index: number) => void;
  accept?: string;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  files,
  onFilesChange,
  onRetry,
  accept = "image/*,video/*",
  maxFiles,
  disabled = false,
  className
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addFiles = (newFiles: File[]) => {
    const currentCount = files.length;
    let filesToAdd = newFiles;

    if (maxFiles && currentCount + newFiles.length > maxFiles) {
      filesToAdd = newFiles.slice(0, maxFiles - currentCount);
    }

    const newFileItems: FileUploadItem[] = filesToAdd.map(file => ({
      file,
      status: 'pending'
    }));

    onFilesChange([...files, ...newFileItems]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getStatusIcon = (status: FileUploadItem['status']) => {
    switch (status) {
      case 'uploading':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors",
          isDragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:border-primary/50 cursor-pointer"
        )}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-2">
          {isDragActive
            ? "Drop files here..."
            : "Click to select files or drag and drop"}
        </p>
        <p className="text-xs text-muted-foreground">
          Supports images and videos
          {maxFiles && ` (max ${maxFiles} files)`}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={!maxFiles || maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileItem, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-border rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">
                    {fileItem.file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(fileItem.status)}
                    {fileItem.status === 'error' && onRetry && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRetry(index)}
                        className="h-6 w-6 p-0"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileItem.file.size)}
                  {fileItem.error && ` • ${fileItem.error}`}
                </p>
                {fileItem.status === 'uploading' && fileItem.progress !== undefined && (
                  <Progress value={fileItem.progress} className="mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}