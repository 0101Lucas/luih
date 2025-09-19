// src/components/daily-logs/TodoExecutionCard.tsx
import MediaDisplay from "./MediaDisplay";

export default function TodoExecutionCard({
  title,
  status,   // "Executed" | "Partially Executed" | "Not Executed"
  reason,   // string curto
  media,    // attachments do dia (media_today)
}: {
  title: string;
  status: string;
  reason?: string | null;
  media: Array<{ id: string; type: "photo"|"video"|"file"; url: string }>;
}) {
  return (
    <div className="space-y-2 p-3 border rounded-lg bg-card">
      <div className="font-medium">{title} — {status}</div>
      {status !== "Executed" && (
        <div className="text-sm text-muted-foreground">Reason: {reason ?? "—"}</div>
      )}
      {media?.length ? (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Files:</div>
          <MediaDisplay items={media} mode="preview-first" />
        </div>
      ) : null}
    </div>
  );
}
