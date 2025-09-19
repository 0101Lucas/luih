import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app";
import { LogFeed } from "@/components/daily-logs/LogFeed";
import { CreateNoteModal } from "@/components/daily-logs/CreateNoteModal";

export function DailyLogsTab() {
  const { selectedProject } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSuccess = () => {
    // Feed will handle its own refresh
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Daily Logs</h2>
          <p className="text-muted-foreground">
            {selectedProject ? `Unified feed for ${selectedProject.name} - Manual notes and to-do execution reports` : 'Daily logs and execution reports'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} disabled={!selectedProject}>
          <Plus className="h-4 w-4 mr-2" />
          Create Log Entry
        </Button>
      </div>

      {/* Feed */}
      <LogFeed 
        onCreateClick={() => setShowCreateModal(true)}
        onSuccess={handleSuccess}
      />

      {/* Create Modal */}
      {selectedProject && (
        <CreateNoteModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          projectId={selectedProject.id}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}