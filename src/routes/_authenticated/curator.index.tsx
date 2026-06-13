import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listExhibitions, upsertExhibition } from "@/lib/curator.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/curator/")({
  component: CuratorIndex,
});

const HALLS = ["painting", "sculpture", "photography", "architecture", "poetry", "craft"] as const;

function CuratorIndex() {
  const list = useServerFn(listExhibitions);
  const upsert = useServerFn(upsertExhibition);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["exhibitions"], queryFn: () => list() });
  const [form, setForm] = useState<any>({ hall: "painting", is_published: false });

  const mut = useMutation({
    mutationFn: () => upsert({
      data: {
        slug: form.slug,
        hall: form.hall,
        title_en: form.title_en,
        description_en: form.description_en ?? null,
        starts_at: form.starts_at || null,
        ends_at: form.ends_at || null,
        is_published: !!form.is_published,
      },
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["exhibitions"] }); setForm({ hall: "painting", is_published: false }); },
  });

  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h1 className="mb-4 font-display text-2xl">Exhibitions</h1>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <ul className="space-y-2">
            {(data ?? []).map((e: any) => (
              <li key={e.id} className="rounded-lg border border-border p-3">
                <p className="font-display">{e.title_en}</p>
                <p className="text-xs text-muted-foreground">{e.hall} · {e.is_published ? "Published" : "Draft"}</p>
              </li>
            ))}
            {(data ?? []).length === 0 && <li className="text-sm text-muted-foreground">No exhibitions yet.</li>}
          </ul>
        )}
      </div>
      <form onSubmit={(ev) => { ev.preventDefault(); mut.mutate(); }} className="space-y-3 rounded-lg border border-border p-4">
        <p className="font-display text-lg">New exhibition</p>
        <div><Label>Title (EN)</Label><Input required value={form.title_en ?? ""} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
        <div><Label>Slug</Label><Input required pattern="[a-z0-9-]+" value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
        <div>
          <Label>Hall</Label>
          <select value={form.hall} onChange={(e) => setForm({ ...form, hall: e.target.value })} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
            {HALLS.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div><Label>Description</Label><textarea rows={3} className="w-full rounded-md border border-input bg-transparent p-2 text-sm" value={form.description_en ?? ""} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><Label>Starts</Label><Input type="datetime-local" value={form.starts_at ?? ""} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></div>
          <div><Label>Ends</Label><Input type="datetime-local" value={form.ends_at ?? ""} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Publish
        </label>
        {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
        <button disabled={mut.isPending} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
          {mut.isPending ? "Saving…" : "Create exhibition"}
        </button>
      </form>
    </div>
  );
}
