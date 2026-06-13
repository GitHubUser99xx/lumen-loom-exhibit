import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { upsertMyArtwork } from "@/lib/studio.functions";
import { getSignedUploadUrl } from "@/lib/storage.functions";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/studio/artworks/new")({
  component: NewArtwork,
});

const HALLS = ["painting", "sculpture", "photography", "architecture", "poetry", "craft"] as const;

function NewArtwork() {
  const upsert = useServerFn(upsertMyArtwork);
  const sign = useServerFn(getSignedUploadUrl);
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({ hall: "painting", is_published: false, tags: [], image_paths: {} });
  const [uploading, setUploading] = useState(false);

  function set<K extends string>(k: K, v: any) { setForm((f: any) => ({ ...f, [k]: v })); }

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const safeName = `${Date.now()}.${ext}`;
      const { path, token } = await sign({ data: { bucket: "artwork-media", path: safeName } });
      const { error } = await supabase.storage.from("artwork-media").uploadToSignedUrl(path, token, file);
      if (error) throw error;
      set("image_paths", { ...(form.image_paths ?? {}), original: path });
    } finally {
      setUploading(false);
    }
  }

  const mut = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          slug: form.slug,
          title_en: form.title_en,
          title_fa: form.title_fa ?? null,
          description_en: form.description_en ?? null,
          hall: form.hall,
          medium: form.medium ?? null,
          year: form.year ? Number(form.year) : null,
          tags: form.tags ?? [],
          image_paths: form.image_paths ?? {},
          video_url: form.video_url ?? null,
          video_provider: form.video_provider ?? null,
          is_published: !!form.is_published,
        },
      }),
    onSuccess: () => navigate({ to: "/studio" }),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl">New artwork</h1>
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Title (EN)</Label>
            <Input required value={form.title_en ?? ""} onChange={(e) => set("title_en", e.target.value)} />
          </div>
          <div>
            <Label>Title (FA)</Label>
            <Input dir="rtl" value={form.title_fa ?? ""} onChange={(e) => set("title_fa", e.target.value)} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input required pattern="[a-z0-9-]+" value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} />
          </div>
          <div>
            <Label>Hall</Label>
            <select value={form.hall} onChange={(e) => set("hall", e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
              {HALLS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <Label>Year</Label>
            <Input type="number" value={form.year ?? ""} onChange={(e) => set("year", e.target.value)} />
          </div>
          <div>
            <Label>Medium</Label>
            <Input value={form.medium ?? ""} onChange={(e) => set("medium", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Description (EN)</Label>
          <textarea rows={4} className="w-full rounded-md border border-input bg-transparent p-2 text-sm" value={form.description_en ?? ""} onChange={(e) => set("description_en", e.target.value)} />
        </div>
        <div>
          <Label>Image</Label>
          <Input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
          {uploading && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
          {form.image_paths?.original && <p className="mt-1 text-xs text-muted-foreground">Stored: {form.image_paths.original}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Video URL</Label>
            <Input type="url" value={form.video_url ?? ""} onChange={(e) => set("video_url", e.target.value)} />
          </div>
          <div>
            <Label>Video provider</Label>
            <select value={form.video_provider ?? ""} onChange={(e) => set("video_provider", e.target.value || null)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
              <option value="">—</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="cloudinary">Cloudinary</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Publish now
        </label>
        {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
        <button disabled={mut.isPending || uploading} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
          {mut.isPending ? "Saving…" : "Save artwork"}
        </button>
      </form>
    </div>
  );
}
