import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getArtistBySlug } from "@/lib/public.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtworkCard } from "@/components/site/ArtworkCard";

const artistQuery = (slug: string) =>
  queryOptions({
    queryKey: ["artist", slug],
    queryFn: async () => {
      const r = await getArtistBySlug({ data: { slug } });
      if (!r) throw notFound();
      return r;
    },
  });

export const Route = createFileRoute("/$lang/artists/$slug")({
  parseParams: (p) => ({ lang: p.lang as "en" | "fa", slug: p.slug }),
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(artistQuery(params.slug)),
  head: ({ params, loaderData }) => {
    const d: any = loaderData;
    const url = `https://lumen-loom-exhibit.lovable.app/${params.lang}/artists/${params.slug}`;
    const name = d?.display_name ?? "Artist";
    const bio = (params.lang === "fa" ? d?.bio_fa : d?.bio_en) ?? `${name} on LUMEN`;
    const image = d?.profile_url ?? undefined;
    return {
      meta: [
        { title: `${name} — LUMEN` },
        { name: "description", content: bio.slice(0, 160) },
        { property: "og:title", content: name },
        { property: "og:description", content: bio.slice(0, 160) },
        { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name,
            image,
            nationality: d?.country,
            description: bio,
          }),
        },
      ],
    };
  },
  component: ArtistPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-12 text-ivory">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background p-12 text-ivory">Artist not found.</div>
  ),
});

function ArtistPage() {
  const { lang, slug } = Route.useParams();
  const { data } = useSuspenseQuery(artistQuery(slug));
  const d: any = data;
  const bio = lang === "fa" ? d.bio_fa : d.bio_en;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <nav className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/40">
          <Link to="/" className="hover:text-ivory">LUMEN</Link>
          <span className="mx-2">/</span>
          <span>{d.display_name}</span>
        </nav>

        <header className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          {d.profile_url ? (
            <img src={d.profile_url} alt={d.display_name} className="w-full rounded-lg" />
          ) : (
            <div className="aspect-square rounded-lg border border-ivory/10 bg-midnight-deep/40" />
          )}
          <div className="space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50">
              {d.country ?? "Artist"}
            </p>
            <h1 className="font-display text-5xl text-ivory">{d.display_name}</h1>
            {bio && <p className="text-ivory/80 leading-relaxed">{bio}</p>}
          </div>
        </header>

        <section className="mt-20">
          <h2 className="font-display text-2xl text-ivory">Works</h2>
          {d.works.length === 0 ? (
            <p className="mt-6 text-ivory/60">No published works yet.</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {d.works.map((w: any) => (
                <ArtworkCard key={w.id} lang={lang} item={w} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
