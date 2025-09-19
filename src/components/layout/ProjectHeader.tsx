import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app";

export function ProjectHeader() {
  const { selectedProject } = useAppStore();

  if (!selectedProject) {
    return null;
  }

  return (
    <div className="bg-card border-b border-border p-6">
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
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-lg font-semibold text-foreground">
              0%
            </div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="0, 100"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}