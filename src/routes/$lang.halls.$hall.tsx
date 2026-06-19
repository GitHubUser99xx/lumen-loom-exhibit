import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getHallPage } from "@/lib/public.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArtworkCard } from "@/components/site/ArtworkCard";

const Hall = z.enum(["painting", "sculpture", "photography", "architecture", "poetry", "craft"]);

const HALL_TITLES: Record<string, { en: string; fa: string }> = {
  painting: { en: "Paintings", fa: "نقاشی" },
  sculpture: { en: "Sculpture & Relief", fa: "مجسمه" },
  photography: { en: "Photography", fa: "عکاسی" },
  architecture: { en: "Architecture", fa: "معماری" },
  poetry: { en: "Poetry", fa: "شعر" },
  craft: { en: "Craft", fa: "صنایع" },
};

const hallQuery = (hall: z.infer<typeof Hall>) =>
  queryOptions({
    queryKey: ["hall", hall],
    queryFn: () => getHallPage({ data: { hall } }),
  });

export const Route = createFileRoute("/$lang/halls/$hall")({
  parseParams: (p) => {
    const parsed = Hall.safeParse(p.hall);
    if (!parsed.success) throw notFound();
    return { lang: p.lang as "en" | "fa", hall: parsed.data };
  },
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(hallQuery(params.hall)),
  head: ({ params }) => {
    const title = HALL_TITLES[params.hall];
    const url = `https://lumen-loom-exhibit.lovable.app/${params.lang}/halls/${params.hall}`;
    const display = params.lang === "fa" ? title.fa : title.en;
    return {
      meta: [
        { title: `${display} — LUMEN` },
        { name: "description", content: `Browse the ${title.en} hall at LUMEN.` },
        { property: "og:title", content: `${display} — LUMEN` },
        { property: "og:description", content: `Browse the ${title.en} hall at LUMEN.` },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: HallPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background p-12 text-ivory">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background p-12 text-ivory">Hall not found.</div>
  ),
});

function HallPage() {
  const { lang, hall } = Route.useParams();
  const { data } = useSuspenseQuery(hallQuery(hall));
  const title = HALL_TITLES[hall];
  const display = lang === "fa" ? title.fa : title.en;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-20">
        <nav className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/40">
          <Link to="/" className="hover:text-ivory">LUMEN</Link>
          <span className="mx-2">/</span>
          <span>{display}</span>
        </nav>
        <h1 className="font-display text-5xl text-ivory">{display}</h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ivory/50">
          {data.items.length} works on view
        </p>

        {data.items.length === 0 ? (
          <p className="mt-16 text-ivory/60">No published works in this hall yet.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((item) => (
              <ArtworkCard key={item.id} lang={lang} item={item} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
