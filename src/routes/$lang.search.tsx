import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { searchArtworks, type SearchResult } from "@/lib/search.functions";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const HALLS = ["painting", "sculpture", "photography", "architecture", "poetry", "craft"] as const;
type Hall = (typeof HALLS)[number];

type SearchParams = { q: string; hall?: Hall };

export const Route = createFileRoute("/$lang/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : "",
    hall: HALLS.includes(search.hall as Hall) ? (search.hall as Hall) : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: "Search — LUMEN" },
      { name: "description", content: "Search artworks across LUMEN's halls." },
      { name: "robots", content: "noindex,follow" },
      { property: "og:title", content: "Search — LUMEN" },
      { property: "og:url", content: `/${params.lang}/search` },
    ],
  }),
  component: SearchPage,
  errorComponent: ({ error }) => (
    <div className="p-12 text-center text-sm text-muted-foreground">
      {error.message}
    </div>
  ),
});

function SearchPage() {
  const { lang } = Route.useParams();
  const { q, hall } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const isFa = lang === "fa";

  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);

  const search = useServerFn(searchArtworks);

  const query = useInfiniteQuery<SearchResult>({
    queryKey: ["search", q, hall],
    initialPageParam: null as SearchResult["nextCursor"],
    queryFn: ({ pageParam }) =>
      search({ data: { q, hall, cursor: pageParam ?? null } }) as Promise<SearchResult>,
    getNextPageParam: (last) => last.nextCursor,
  });

  // IntersectionObserver for infinite scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div dir={isFa ? "rtl" : "ltr"} className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-aurora">
            {isFa ? "جست‌وجو" : "Discovery"}
          </p>
          <h1 className="font-display text-5xl text-foreground sm:text-6xl">
            {isFa ? "جست‌وجو در آثار" : "Search the Collection"}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {isFa
              ? "میان آثار منتشرشده در طبقات گالری جست‌وجو کنید."
              : "Search across every published artwork on every floor."}
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: (prev) => ({ ...prev, q: draft.trim() }) });
          }}
          className="mb-6 flex gap-2"
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={isFa ? "نام اثر، هنرمند، رسانه…" : "Title, artist, medium…"}
            className="h-12 flex-1 rounded-full border-ivory/20 bg-midnight-deep/60 px-5 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary-foreground"
          >
            {isFa ? "جست‌وجو" : "Search"}
          </button>
        </form>

        <div className="mb-10 flex flex-wrap gap-2">
          <FilterChip
            active={!hall}
            onClick={() => navigate({ search: (prev) => ({ ...prev, hall: undefined }) })}
          >
            {isFa ? "همه" : "All halls"}
          </FilterChip>
          {HALLS.map((h) => (
            <FilterChip
              key={h}
              active={hall === h}
              onClick={() => navigate({ search: (prev) => ({ ...prev, hall: h }) })}
            >
              {h}
            </FilterChip>
          ))}
        </div>

        {query.isLoading ? (
          <Grid>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
            ))}
          </Grid>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-ivory/10 bg-midnight-deep/40 p-16 text-center">
            <p className="font-display text-2xl text-foreground">
              {isFa ? "نتیجه‌ای یافت نشد" : "No works found"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isFa
                ? "عبارت یا فیلتر دیگری را امتحان کنید."
                : "Try a different keyword or remove filters."}
            </p>
          </div>
        ) : (
          <Grid>
            {items.map((it) => (
              <Link
                key={it.id}
                to="/$lang/search"
                params={{ lang }}
                search={{ q, hall }}
                className="group block"
              >
                <article className="overflow-hidden rounded-lg border border-ivory/10 bg-midnight-deep/40 transition-colors hover:border-aurora/40">
                  <div className="aspect-[3/4] bg-midnight-deep" />
                  <div className="p-4">
                    <h3 className="font-display text-lg text-foreground line-clamp-1">
                      {(isFa && it.title_fa) || it.title_en}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {it.artist_name} {it.year ? `· ${it.year}` : ""}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </Grid>
        )}

        <div ref={sentinelRef} className="h-12" aria-hidden />
        {query.isFetchingNextPage && (
          <p className="py-6 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {isFa ? "در حال بارگذاری…" : "Loading more…"}
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors " +
        (active
          ? "border-aurora bg-aurora/10 text-aurora"
          : "border-ivory/15 text-ivory/60 hover:border-ivory/30 hover:text-ivory")
      }
    >
      {children}
    </button>
  );
}
