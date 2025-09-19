import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { FeedItem } from "@/lib/db/dailyLogs";

interface LogFeedEntryProps {
  item: FeedItem;
  onFillReport: (todoId: string) => void;
  onMediaClick: (media: { url: string; type: 'photo' | 'video' }) => void;
}

export function LogFeedEntry({ item, onFillReport, onMediaClick }: LogFeedEntryProps) {
  const formatTime = (dateString: string) => {
    if (!dateString) return 'Unknown time';
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'h:mm a');
      }
    } catch (error) {
      console.warn('Invalid date format:', dateString);
    }
    return 'Invalid time';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'executed':
        return <Badge variant="default" className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Executed</Badge>;
      case 'partial':
        return <Badge variant="default" className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Partial</Badge>;
      case 'not_executed':
        return <Badge variant="default" className="bg-destructive text-destructive-foreground"><XCircle className="h-3 w-3 mr-1" />Not Executed</Badge>;
      default:
        return null;
    }
  };

  const getReviewStatusBadge = (reviewStatus: string) => {
    switch (reviewStatus) {
      case 'approved':
        return <Badge variant="outline" className="text-success border-success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-destructive border-destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="text-warning border-warning">Pending Review</Badge>;
    }
  };

  return (
    <article className="space-y-3 py-4 border-b border-border last:border-b-0">
      {/* Header with chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Entry type */}
        {item.kind === 'note' ? (
          <Badge variant="secondary">
            <MessageSquare className="h-3 w-3 mr-1" />
            Note
          </Badge>
        ) : (
          <Badge variant="secondary">
            <ClipboardList className="h-3 w-3 mr-1" />
            Execution Report
          </Badge>
        )}

        {/* Status for execution reports */}
        {item.kind === 'execution_report' && item.status && getStatusBadge(item.status)}

        {/* Review status for execution reports */}
        {item.kind === 'execution_report' && item.review_status && getReviewStatusBadge(item.review_status)}

        {/* Linked to-do */}
        {item.todo_id && item.todo_title && (
          <Badge variant="outline" className="text-primary border-primary">
            <ClipboardList className="h-3 w-3 mr-1" />
            Linked: {item.todo_title}
          </Badge>
        )}
      </div>

      {/* Title */}
      {item.title && (
        <h4 className="font-medium text-foreground leading-relaxed">{item.title}</h4>
      )}

      {/* Content */}
      {item.body && (
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="whitespace-pre-wrap leading-relaxed">{item.body}</p>
        </div>
      )}

      {/* Execution report details */}
      {item.kind === 'execution_report' && (
        <div className="space-y-2">
          {item.reason_label && (
            <div className="text-sm">
              <span className="font-medium text-foreground">Reason: </span>
              <span className="text-muted-foreground">{item.reason_label}</span>
            </div>
          )}
          
          {item.detail && (
            <div className="text-sm">
              <span className="font-medium text-foreground">Detail: </span>
              <span className="text-muted-foreground">{item.detail}</span>
            </div>
          )}

          {item.review_comment && (
            <div className="text-sm">
              <span className="font-medium text-foreground">Review Comment: </span>
              <span className="text-muted-foreground">{item.review_comment}</span>
            </div>
          )}
        </div>
      )}

      {/* Media - TODO: Load actual media items for this entry */}
      {item.media_count && item.media_count > 0 && (
        <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          📎 {item.media_count} media file{item.media_count > 1 ? 's' : ''} attached
        </div>
      )}

      {/* Footer with author and time */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-2">
          <span>By User #{item.created_by?.slice(0, 8) || 'Unknown'}</span>
          <span>•</span>
          <span>Today</span>
        </div>
        
        {/* Action for incomplete to-dos */}
        {item.kind === 'note' && item.todo_id && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFillReport(item.todo_id!)}
            className="h-6 px-2 text-xs"
          >
            Fill Report
          </Button>
        )}
      </div>
    </article>
  );
}