import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const tiles = [
    { to: "/admin/users", title: "Users & roles", desc: "Grant artist, curator, or admin access." },
    { to: "/admin/moderation", title: "Content moderation", desc: "Publish or unpublish any work." },
    { to: "/admin", title: "Analytics", desc: "Coming in Phase 5.5." },
    { to: "/admin", title: "SEO settings", desc: "Coming in Phase 5.5." },
  ];
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl">Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.title} to={t.to} className="rounded-lg border border-border p-5 transition-colors hover:bg-accent/10">
            <p className="font-display text-lg">{t.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
