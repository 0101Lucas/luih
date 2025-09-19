import React from "react";
import MediaDisplay from "./MediaDisplay";

export default function LogFeedEntry({ entry }: { entry: any }) {
  const created = new Date(entry.created_at + "T12:00:00");
  const time = created.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();

  return (
    <article className="space-y-2">
      <div className="font-semibold">{entry.title}</div>
      <div className="text-xs text-muted-foreground">
        Created at {time} · by {minify(entry.author_name)}
      </div>

      {entry.body && (
        <div>
          <span className="text-sm text-muted-foreground">Log Body: </span>
          <Clamp text={entry.body} />
        </div>
      )}

      {entry.attachments?.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Attachments:</div>
          <MediaDisplay items={entry.attachments} mode="preview-first" />
        </div>
      )}
    </article>
  );
}

function minify(n?: string | null) {
  if (!n) return "—";
  const p = n.split(" ");
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : n;
}

function Clamp({ text }: { text: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <p className={open ? "" : "line-clamp-3"}>{text}</p>
      {!open && (
        <button className="text-xs underline" onClick={() => setOpen(true)}>
          Read more
        </button>
      )}
    </div>
  );
}
