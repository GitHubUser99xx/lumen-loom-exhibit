import { Link } from "@tanstack/react-router";
import type { PublicArtworkCard } from "@/lib/public.functions";

export function ArtworkCard({
  lang,
  item,
}: {
  lang: "en" | "fa";
  item: PublicArtworkCard;
}) {
  const title = lang === "fa" && item.title_fa ? item.title_fa : item.title_en;
  return (
    <Link
      to="/$lang/artworks/$slug"
      params={{ lang, slug: item.slug }}
      className="group block overflow-hidden rounded-lg border border-ivory/10 bg-midnight-deep/40 transition-colors hover:border-aurora/40"
    >
      <div className="aspect-[4/5] overflow-hidden bg-midnight-deep">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-ivory/30">
            no image
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-display text-base leading-tight text-ivory">{title}</h3>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ivory/50">
          {item.artist_name ?? "—"}{item.year ? ` · ${item.year}` : ""}
        </p>
      </div>
    </Link>
  );
}
