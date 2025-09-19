import { useState } from "react";
import { Play, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaItem, getPublicMediaUrl } from "@/lib/db/dailyLogs";
import { cn } from "@/lib/utils";

interface MediaDisplayProps {
  items: MediaItem[];
  className?: string;
  onMediaClick?: (media: { url: string; type: 'photo' | 'video' }) => void;
}

export function MediaDisplay({ items, className, onMediaClick }: MediaDisplayProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  if (!items || items.length === 0) {
    return null;
  }

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => new Set(prev).add(itemId));
  };

  const handleDownload = async (item: MediaItem) => {
    try {
      const publicUrl = getPublicMediaUrl(item.url);
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.url.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const openInNewTab = (item: MediaItem) => {
    const publicUrl = getPublicMediaUrl(item.url);
    window.open(publicUrl, '_blank');
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const publicUrl = getPublicMediaUrl(item.url);
          const hasError = imageErrors.has(item.id);

          return (
            <div
              key={item.id}
              className="relative group border border-border rounded-lg overflow-hidden bg-muted"
            >
              {item.type === 'photo' ? (
                <div 
                  className="aspect-video relative cursor-pointer"
                  onClick={() => onMediaClick?.({ url: item.url, type: 'photo' })}
                >
                  {!hasError ? (
                    <img
                      src={publicUrl}
                      alt="Log attachment"
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(item.id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center text-muted-foreground">
                        <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Image unavailable</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="aspect-video relative cursor-pointer"
                  onClick={() => onMediaClick?.({ url: item.url, type: 'video' })}
                >
                  <video
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    <source src={publicUrl} />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
              )}

              {/* Overlay controls */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openInNewTab(item)}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* File info */}
              <div className="p-2 bg-background/95 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground truncate">
                  {item.url.split('/').pop()?.split('-').slice(1).join('-') || 'Unknown file'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}