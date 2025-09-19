import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app";
import { listDailyLogFeed, FeedItem } from "@/lib/db/dailyLogs";
import { DailyLogsFilters } from "@/components/daily-logs/DailyLogsFilters";
import { LogNoteCard } from "@/components/daily-logs/LogNoteCard";
import { TodoExecutionCard } from "@/components/daily-logs/TodoExecutionCard";
import { CreateNoteModal } from "@/components/daily-logs/CreateNoteModal";
import { ExecutionReportSheet } from "@/components/daily-logs/ExecutionReportSheet";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function DailyLogsTab() {
  const { selectedProject } = useAppStore();
  const { toast } = useToast();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dateFrom, setDateFrom] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExecutionReport, setShowExecutionReport] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [selectedTodoTitle, setSelectedTodoTitle] = useState<string | undefined>();

  useEffect(() => {
    if (selectedProject?.id) {
      loadFeed();
    }
  }, [selectedProject, dateFrom, dateTo]);

  const loadFeed = async () => {
    if (!selectedProject?.id) return;

    setLoading(true);
    try {
      const data = await listDailyLogFeed(selectedProject.id, {
        from: dateFrom,
        to: dateTo,
        search: searchValue || undefined,
      });
      setFeedItems(data);
    } catch (error) {
      console.error('Error loading feed:', error);
      toast({
        title: "Error",
        description: "Failed to load daily logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    // Debounce search or trigger immediately for demo
    setTimeout(() => {
      if (selectedProject?.id) {
        loadFeed();
      }
    }, 300);
  };

  const handleFillReport = (todoId: string) => {
    const item = feedItems.find(item => item.todo_id === todoId);
    setSelectedTodoId(todoId);
    setSelectedTodoTitle(item?.todo_title);
    setShowExecutionReport(true);
  };

  const handleSuccess = () => {
    loadFeed(); // Refresh the feed
  };

  if (!selectedProject) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Project Selected</h3>
          <p className="text-muted-foreground">
            Please select a project from the sidebar to view daily logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Daily Logs</h2>
          <p className="text-muted-foreground">
            Unified feed for {selectedProject.name} - Manual notes and to-do execution reports
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Log Entry
        </Button>
      </div>

      {/* Filters */}
      <DailyLogsFilters
        searchValue={searchValue}
        onSearchChange={handleSearch}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {/* Feed */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading daily logs...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedItems.map((item) => {
            if (item.kind === 'note') {
              return <LogNoteCard key={item.entry_id} item={item} />;
            } else {
              return (
                <TodoExecutionCard
                  key={item.entry_id}
                  item={item}
                  onFillReport={handleFillReport}
                />
              );
            }
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && feedItems.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No entries found</h3>
          <p className="text-muted-foreground mb-4">
            {searchValue 
              ? "Try adjusting your search terms or date range." 
              : "Create your first log entry or check if there are any to-dos due in this date range."
            }
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Log Entry
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        projectId={selectedProject.id}
        onSuccess={handleSuccess}
      />

      <ExecutionReportSheet
        open={showExecutionReport}
        onOpenChange={setShowExecutionReport}
        todoId={selectedTodoId}
        todoTitle={selectedTodoTitle}
        onSuccess={handleSuccess}
      />
    </div>
  );
}