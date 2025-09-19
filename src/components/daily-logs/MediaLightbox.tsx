import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, X } from "lucide-react";
import { getPublicMediaUrl } from "@/lib/db/dailyLogs";

interface MediaLightboxProps {
  media: { url: string; type: 'photo' | 'video' } | null;
  onClose: () => void;
}

export function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  if (!media) return null;

  const publicUrl = getPublicMediaUrl(media.url);

  const handleDownload = async () => {
    try {
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = media.url.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const openInNewTab = () => {
    window.open(publicUrl, '_blank');
  };

  return (
    <Dialog open={!!media} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header with controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={openInNewTab}
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
          >
            <Download className="h-4 w-4" />
          </Button>
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        {/* Media content */}
        <div className="flex items-center justify-center min-h-[400px] bg-background">
          {media.type === 'photo' ? (
            <img
              src={publicUrl}
              alt="Media preview"
              className="max-w-full max-h-[80vh] object-contain"
              loading="lazy"
            />
          ) : (
            <video
              controls
              className="max-w-full max-h-[80vh] object-contain"
              preload="metadata"
            >
              <source src={publicUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Footer with file info */}
        <div className="p-4 bg-muted/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            {media.url.split('/').pop()?.split('-').slice(1).join('-') || 'Unknown file'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}