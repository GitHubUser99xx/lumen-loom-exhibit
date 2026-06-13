import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/users", label: "Users & roles" },
    { to: "/admin/moderation", label: "Moderation" },
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl tracking-[0.2em]">LUMEN</Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Admin</p>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-6">
          {tabs.map((t) => {
            const active = pathname === t.to;
            return (
              <Link key={t.to} to={t.to} className={`border-b-2 px-3 py-2 text-sm ${active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
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
