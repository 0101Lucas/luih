// adicione prop opcional
export default function MediaDisplay({
  items,
  mode = "preview-first", // novo modo
}: {
  items: Array<{ id: string; type: "photo"|"video"|"file"; url: string }>;
  mode?: "preview-first" | "lightbox";
}) {
  if (mode === "lightbox") {
    // mantém comportamento antigo
    return <MediaLightbox items={items} />;
  }

  // preview-first clicável
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {items.map((m) => {
        if (m.type === "photo") {
          return (
            <a key={m.id} href={m.url} target="_blank" rel="noreferrer">
              <img src={m.url} className="w-full h-24 object-cover rounded" loading="lazy" />
            </a>
          );
        }
        if (m.type === "video") {
          return (
            <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="relative block">
              <video src={m.url} preload="metadata" className="w-full h-24 object-cover rounded" />
              <span className="absolute inset-0 grid place-items-center text-white text-xl">▶</span>
            </a>
          );
        }
        // file (inclui pdf)
        const name = decodeURIComponent(m.url.split("/").pop() || "file");
        return (
          <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 border rounded text-sm">
            <span>📄</span><span className="truncate">{name}</span>
          </a>
        );
      })}
    </div>
  );
}
