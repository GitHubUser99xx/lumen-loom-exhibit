import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyArtworks, deleteMyArtwork } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/studio/")({
  component: StudioIndex,
});

function StudioIndex() {
  const list = useServerFn(listMyArtworks);
  const del = useServerFn(deleteMyArtwork);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["my-artworks"], queryFn: () => list() });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-artworks"] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const items = data ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl">My artworks</h1>
        <Link to="/studio/artworks/new" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
          New artwork
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No artworks yet. Create your <Link to="/studio/profile" className="underline">artist profile</Link> first, then add work.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a: any) => (
            <li key={a.id} className="rounded-lg border border-border p-4">
              <p className="font-display text-lg">{a.title_en}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.hall} · {a.year ?? "—"}</p>
              <p className="mt-2 text-[10px] font-mono uppercase tracking-wider">
                {a.is_published ? "Published" : "Draft"}
              </p>
              <div className="mt-3 flex gap-2">
                <Link to="/studio/artworks/$id" params={{ id: a.id }} className="text-xs underline">Edit</Link>
                <button onClick={() => { if (confirm("Delete?")) delMut.mutate(a.id); }} className="text-xs text-destructive underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
