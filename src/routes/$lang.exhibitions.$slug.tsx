import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getExhibitionBySlug } from "@/lib/public.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtworkCard } from "@/components/site/ArtworkCard";

const exhibitionQuery = (slug: string) =>
  queryOptions({
    queryKey: ["exhibition", slug],
    queryFn: async () => {
      const r = await getExhibitionBySlug({ data: { slug } });
      if (!r) throw notFound();
      return r;
    },
  });

export const Route = createFileRoute("/$lang/exhibitions/$slug")({
  parseParams: (p) => ({ lang: p.lang as "en" | "fa", slug: p.slug }),
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(exhibitionQuery(params.slug)),
  head: ({ params, loaderData }) => {
    const d: any = loaderData;
    const url = `https://lumen-loom-exhibit.lovable.app/${params.lang}/exhibitions/${params.slug}`;
    const title = params.lang === "fa" && d?.title_fa ? d.title_fa : d?.title_en ?? "Exhibition";
    const desc = (params.lang === "fa" ? d?.description_fa : d?.description_en) ?? title;
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
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ExhibitionEvent",
            name: title,
            description: desc,
            image,
            startDate: d?.starts_at,
            endDate: d?.ends_at,
          }),
        },
      ],
    };
  },
  component: ExhibitionPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-12 text-ivory">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background p-12 text-ivory">Exhibition not found.</div>
  ),
});

function ExhibitionPage() {
  const { lang, slug } = Route.useParams();
  const { data } = useSuspenseQuery(exhibitionQuery(slug));
  const d: any = data;
  const title = lang === "fa" && d.title_fa ? d.title_fa : d.title_en;
  const desc = lang === "fa" ? d.description_fa : d.description_en;

  return (
    <>
      <Header />
      <main>
        {d.hero_url && (
          <div className="relative h-[55vh] w-full overflow-hidden">
            <img src={d.hero_url} alt={title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        )}
        <div className="mx-auto max-w-6xl px-6 py-16">
          <nav className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/40">
            <Link to="/" className="hover:text-ivory">LUMEN</Link>
            <span className="mx-2">/</span>
            <span>Exhibitions</span>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="font-display text-5xl text-ivory">{title}</h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ivory/50">
            {d.hall}
            {d.starts_at && ` · ${new Date(d.starts_at).getFullYear()}`}
          </p>
          {desc && <p className="mt-8 max-w-2xl text-ivory/80 leading-relaxed">{desc}</p>}

          <section className="mt-16">
            <h2 className="font-display text-2xl text-ivory">Works on view</h2>
            {d.items.length === 0 ? (
              <p className="mt-6 text-ivory/60">No works assigned yet.</p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {d.items.map((w: any) => (
                  <ArtworkCard key={w.id} lang={lang} item={w} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
