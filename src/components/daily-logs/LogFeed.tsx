import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app";
import { listDailyLogFeed, FeedItem } from "@/lib/db/dailyLogs";
import { LogFeedFilters } from "@/components/daily-logs/LogFeedFilters";
import { LogFeedEntry } from "@/components/daily-logs/LogFeedEntry";
import { CreateNoteModal } from "@/components/daily-logs/CreateNoteModal";
import { ExecutionReportSheet } from "@/components/daily-logs/ExecutionReportSheet";
import { MediaLightbox } from "@/components/daily-logs/MediaLightbox";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isValid } from "date-fns";

interface GroupedFeedItem {
  date: string;
  displayDate: string;
  items: FeedItem[];
}

interface LogFeedProps {
  onCreateClick: () => void;
  onSuccess: () => void;
}

export function LogFeed({ onCreateClick, onSuccess }: LogFeedProps) {
  const { selectedProject } = useAppStore();
  const { toast } = useToast();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dateFrom, setDateFrom] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [authorFilter, setAuthorFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showExecutionReport, setShowExecutionReport] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [selectedTodoTitle, setSelectedTodoTitle] = useState<string | undefined>();
  const [lightboxMedia, setLightboxMedia] = useState<{ url: string; type: 'photo' | 'video' } | null>(null);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (selectedProject?.id) {
      loadFeed(true);
    }
  }, [selectedProject, dateFrom, dateTo, searchValue, authorFilter, typeFilter]);

  const loadFeed = async (reset = false) => {
    if (!selectedProject?.id) return;

    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const data = await listDailyLogFeed(selectedProject.id, {
        from: dateFrom,
        to: dateTo,
        search: searchValue || undefined,
      });

      if (reset) {
        setFeedItems(data);
        setPage(1);
      } else {
        setFeedItems(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === ITEMS_PER_PAGE);
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

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadFeed(false);
    }
  };

  const handleFillReport = (todoId: string) => {
    const item = feedItems.find(item => item.todo_id === todoId);
    setSelectedTodoId(todoId);
    setSelectedTodoTitle(item?.todo_title);
    setShowExecutionReport(true);
  };

  const handleSuccess = () => {
    loadFeed(true);
    onSuccess();
  };

  // Group items by date
  const groupedItems: GroupedFeedItem[] = feedItems.reduce((acc, item) => {
    if (!item.entry_date) return acc;
    
    const date = item.entry_date;
    let displayDate = 'Invalid Date';
    
    try {
      const parsedDate = parseISO(date);
      if (isValid(parsedDate)) {
        displayDate = format(parsedDate, 'EEE, MMM d');
      }
    } catch (error) {
      console.warn('Invalid date format:', date);
    }

    const existingGroup = acc.find(group => group.date === date);
    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({
        date,
        displayDate,
        items: [item]
      });
    }
    return acc;
  }, [] as GroupedFeedItem[]);

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
    <div className="space-y-6">
      {/* Filters */}
      <LogFeedFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        authorFilter={authorFilter}
        onAuthorFilterChange={setAuthorFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        projectId={selectedProject.id}
      />

      {/* Feed */}
      {loading && page === 1 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading daily logs...</div>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedItems.map((group) => (
            <div key={group.date} className="space-y-4">
              {/* Date Header */}
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm py-2 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">{group.displayDate}</h3>
              </div>
              
              {/* Entries for this date */}
              <div className="space-y-4 pl-4">
                {group.items.map((item) => (
                  <LogFeedEntry
                    key={item.entry_id}
                    item={item}
                    onFillReport={handleFillReport}
                    onMediaClick={setLightboxMedia}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && feedItems.length > 0 && (
        <div className="text-center py-6">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}

      {/* Loading More */}
      {loading && page > 1 && (
        <div className="text-center py-6">
          <div className="text-muted-foreground">Loading more...</div>
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
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create Log Entry
          </Button>
        </div>
      )}

      {/* Modals */}
      <ExecutionReportSheet
        open={showExecutionReport}
        onOpenChange={setShowExecutionReport}
        todoId={selectedTodoId}
        todoTitle={selectedTodoTitle}
        onSuccess={handleSuccess}
      />

      <MediaLightbox
        media={lightboxMedia}
        onClose={() => setLightboxMedia(null)}
      />
    </div>
  );
}