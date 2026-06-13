import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";

const VALID = new Set(["en", "fa"]);

export const Route = createFileRoute("/$lang")({
  parseParams: (p) => {
    if (!VALID.has(p.lang)) throw notFound();
    return { lang: p.lang as "en" | "fa" };
  },
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Unknown language
      </p>
    </div>
  ),
});
