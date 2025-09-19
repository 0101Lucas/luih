import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app";
import { DocumentView } from "@/components/daily-logs/DocumentView";
import { CreateNoteModal } from "@/components/daily-logs/CreateNoteModal";

export function DailyLogsTab() {
  const { selectedProject } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSuccess = () => {
    // Feed will handle its own refresh
  };

  return (
    <div className="h-full">
      {/* Document View */}
      <DocumentView 
        onCreateClick={() => setShowCreateModal(true)}
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