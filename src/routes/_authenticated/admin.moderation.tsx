import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { moderationList, setPublished } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/moderation")({
  component: AdminModeration,
});

function AdminModeration() {
  const list = useServerFn(moderationList);
  const setPub = useServerFn(setPublished);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["mod"], queryFn: () => list() });
  const mut = useMutation({
    mutationFn: (v: { id: string; is_published: boolean }) =>
      setPub({ data: { table: "artworks", id: v.id, is_published: v.is_published } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mod"] }),
  });

  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl">Moderation — Artworks</h1>
      <ul className="space-y-2">
        {(data ?? []).map((a: any) => (
          <li key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-display">{a.title_en}</p>
              <p className="text-xs text-muted-foreground">{a.hall} · {a.is_published ? "Published" : "Draft"}</p>
            </div>
            <button
              onClick={() => mut.mutate({ id: a.id, is_published: !a.is_published })}
              className="rounded-md border border-border px-3 py-1 text-xs hover:bg-accent/10"
            >
              {a.is_published ? "Unpublish" : "Publish"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
