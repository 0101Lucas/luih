import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app";
export function ProjectHeader() {
  const {
    selectedProject
  } = useAppStore();
  if (!selectedProject) {
    return null;
  }
  return <div className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">
            {selectedProject.name}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>{selectedProject.external_ref || 'No code'}</span>
            <span>•</span>
            <span>Created {new Date(selectedProject.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <Badge variant="secondary" className="text-xs">
              {selectedProject.status}
            </Badge>
          </div>
        </div>
        
      </div>
    </div>;
}