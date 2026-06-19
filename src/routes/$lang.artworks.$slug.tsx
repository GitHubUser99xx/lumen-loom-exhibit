import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getArtworkBySlug } from "@/lib/public.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const artworkQuery = (slug: string) =>
  queryOptions({
    queryKey: ["artwork", slug],
    queryFn: async () => {
      const r = await getArtworkBySlug({ data: { slug } });
      if (!r) throw notFound();
      return r;
    },
  });

export const Route = createFileRoute("/$lang/artworks/$slug")({
  parseParams: (p) => ({ lang: p.lang as "en" | "fa", slug: p.slug }),
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(artworkQuery(params.slug)),
  head: ({ params, loaderData }) => {
    const d: any = loaderData;
    const url = `https://lumen-loom-exhibit.lovable.app/${params.lang}/artworks/${params.slug}`;
    const title = params.lang === "fa" && d?.title_fa ? d.title_fa : d?.title_en ?? "Artwork";
    const desc =
      (params.lang === "fa" ? d?.description_fa : d?.description_en) ??
      `${title} by ${d?.artists?.display_name ?? "LUMEN"}`;
    const image = d?.hero_url ?? undefined;
    return {
      meta: [
        { title: `${title} — LUMEN` },
        { name: "description", content: desc.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 160) },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            name: title,
            artMedium: d?.medium,
            dateCreated: d?.year,
            image,
            creator: d?.artists?.display_name && {
              "@type": "Person",
              name: d.artists.display_name,
            },
          }),
        },
      ],
    };
  },
  component: ArtworkPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-12 text-ivory">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background p-12 text-ivory">Artwork not found.</div>
  ),
});

function ArtworkPage() {
  const { lang, slug } = Route.useParams();
  const { data } = useSuspenseQuery(artworkQuery(slug));
  const d: any = data;
  const title = lang === "fa" && d.title_fa ? d.title_fa : d.title_en;
  const desc = lang === "fa" ? d.description_fa : d.description_en;
  const artist = d.artists;
  const images: Record<string, string | null> = d.image_urls ?? {};

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <nav className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/40">
          <Link to="/" className="hover:text-ivory">LUMEN</Link>
          <span className="mx-2">/</span>
          <Link to="/$lang/halls/$hall" params={{ lang, hall: d.hall }} className="hover:text-ivory">
            {d.hall}
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            {d.hero_url && (
              <img src={d.hero_url} alt={title} className="w-full rounded-lg" />
            )}
            {Object.entries(images)
              .slice(1)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <img key={k} src={v as string} alt={`${title} — ${k}`} className="w-full rounded-lg" loading="lazy" />
              ))}
          </div>

          <aside className="space-y-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">
                {d.hall}{d.year ? ` · ${d.year}` : ""}
              </p>
              <h1 className="mt-2 font-display text-4xl text-ivory">{title}</h1>
              {artist?.slug && (
                <Link
                  to="/$lang/artists/$slug"
                  params={{ lang, slug: artist.slug }}
                  className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-aurora hover:underline"
                >
                  {artist.display_name}
                </Link>
              )}
            </div>
            {d.medium && (
              <p className="font-mono text-[11px] uppercase tracking-widest text-ivory/60">
                {d.medium}
              </p>
            )}
            {desc && <p className="text-ivory/80 leading-relaxed">{desc}</p>}
            {d.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {d.tags.map((t: string) => (
                  <span key={t} className="rounded-full border border-ivory/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ivory/60">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
