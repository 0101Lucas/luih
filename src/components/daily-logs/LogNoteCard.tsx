import { Calendar, User, Camera, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedItem } from "@/lib/db/dailyLogs";
import MediaDisplay from "@/components/daily-logs/MediaDisplay";
import { format, parseISO } from "date-fns";

interface LogNoteCardProps {
  item: FeedItem;
}

export function LogNoteCard({ item }: LogNoteCardProps) {
  const entryDate = typeof item.entry_date === 'string' 
    ? parseISO(item.entry_date) 
    : item.entry_date;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {item.title && (
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              )}
              <Badge variant="secondary" className="text-xs">
                Note
              </Badge>
              {item.todo_title && (
                <Badge variant="outline" className="text-xs">
                  Linked: {item.todo_title}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(entryDate, 'MMM dd, yyyy')}
              </div>
              {item.created_by && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {item.created_by}
                </div>
              )}
              {item.media_count > 0 && (
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  {item.media_count} file{item.media_count > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.body && (
          <p className="text-foreground leading-relaxed">{item.body}</p>
        )}
        {item.media && item.media.length > 0 && (
          <MediaDisplay items={item.media} />
        )}
      </CardContent>
    </Card>
  );
}