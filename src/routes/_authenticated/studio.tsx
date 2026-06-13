import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export const Route = createFileRoute("/_authenticated/studio")({
  component: StudioLayout,
});

function StudioLayout() {
  const { data: me, isLoading } = useCurrentUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (isLoading) {
    return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!me) return null;

  const tabs = [
    { to: "/studio", label: "My artworks" },
    { to: "/studio/artworks/new", label: "New artwork" },
    { to: "/studio/profile", label: "Artist profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl tracking-[0.2em]">LUMEN</Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Artist studio</p>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-6">
          {tabs.map((t) => {
            const active = pathname === t.to;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`border-b-2 px-3 py-2 text-sm ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8"><Outlet /></main>
    </div>
  );
}
