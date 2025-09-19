import { Calendar, Camera, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedItem } from "@/lib/db/dailyLogs";
import { MediaDisplay } from "@/components/daily-logs/MediaDisplay";
import { format, parseISO } from "date-fns";

interface TodoExecutionCardProps {
  item: FeedItem;
  onFillReport: (todoId: string) => void;
}

export function TodoExecutionCard({ item, onFillReport }: TodoExecutionCardProps) {
  const entryDate = typeof item.entry_date === 'string' 
    ? parseISO(item.entry_date) 
    : item.entry_date;

  const getStatusIcon = () => {
    switch (item.status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4" />;
      case 'partial':
        return <Clock className="h-4 w-4" />;
      case 'not_executed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (item.status) {
      case 'executed':
        return 'bg-success text-success-foreground';
      case 'partial':
        return 'bg-warning text-warning-foreground';
      case 'not_executed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    switch (item.status) {
      case 'executed':
        return 'Executed';
      case 'partial':
        return 'Partial';
      case 'not_executed':
        return 'Not Executed';
      default:
        return 'Incomplete';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-foreground">{item.todo_title}</h3>
              <Badge className={`text-xs ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-1">{getStatusLabel()}</span>
              </Badge>
              {item.reason_label && (
                <Badge variant="outline" className="text-xs">
                  {item.reason_label}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Due: {format(entryDate, 'MMM dd, yyyy')}
              </div>
              {item.media_count > 0 && (
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  {item.media_count} evidence file{item.media_count > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {item.status === 'incomplete' ? (
              <Button 
                size="sm" 
                onClick={() => onFillReport(item.todo_id!)}
                className="bg-primary hover:bg-primary-hover"
              >
                Fill Execution Report
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onFillReport(item.todo_id!)}
              >
                Edit Report
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {(item.detail || (item.media && item.media.length > 0)) && (
        <CardContent className="space-y-4">
          {item.detail && (
            <p className="text-sm text-muted-foreground">{item.detail}</p>
          )}
          {item.media && item.media.length > 0 && (
            <MediaDisplay items={item.media} />
          )}
        </CardContent>
      )}
    </Card>
  );
}