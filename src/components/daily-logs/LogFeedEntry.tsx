import MediaDisplay from "./MediaDisplay";

export default function LogFeedEntry({ entry }: { entry: any }) {
  const created = new Date(entry.created_at);
  const time = created.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();

  return (
    <article className="space-y-2 border-b pb-6">
      <div className="font-semibold">Log Title: {entry.title}</div>
      <div className="text-xs text-muted-foreground">
        Created at {time} · by {minify(entry.author_name)}
      </div>

      {entry.body && <Clamp text={entry.body} />}

      {entry.attachments?.length ? (
        <MediaDisplay items={entry.attachments} mode="preview-first" />
      ) : null}
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
