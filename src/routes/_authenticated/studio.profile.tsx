import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { upsertMyArtist, getMyArtist } from "@/lib/studio.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/studio/profile")({
  component: StudioProfile,
});

function StudioProfile() {
  const get = useServerFn(getMyArtist);
  const upsert = useServerFn(upsertMyArtist);
  const { data } = useQuery({ queryKey: ["my-artist"], queryFn: () => get() });
  const [form, setForm] = useState<any>({});
  const navigate = useNavigate();

  const current = { ...(data ?? {}), ...form };
  const mut = useMutation({
    mutationFn: () =>
      upsert({
        data: {
          slug: current.slug,
          display_name: current.display_name,
          country: current.country ?? null,
          languages: current.languages ?? [],
          bio_en: current.bio_en ?? null,
          bio_fa: current.bio_fa ?? null,
          contact_email: current.contact_email ?? null,
          is_published: !!current.is_published,
        },
      }),
    onSuccess: () => navigate({ to: "/studio" }),
  });

  function set<K extends string>(k: K, v: any) { setForm((f: any) => ({ ...f, [k]: v })); }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl">Artist profile</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Display name</Label>
            <Input required value={current.display_name ?? ""} onChange={(e) => set("display_name", e.target.value)} />
          </div>
          <div>
            <Label>Slug (lowercase, dashes)</Label>
            <Input required pattern="[a-z0-9-]+" value={current.slug ?? ""} onChange={(e) => set("slug", e.target.value)} />
          </div>
          <div>
            <Label>Country</Label>
            <Input value={current.country ?? ""} onChange={(e) => set("country", e.target.value)} />
          </div>
          <div>
            <Label>Contact email</Label>
            <Input type="email" value={current.contact_email ?? ""} onChange={(e) => set("contact_email", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Bio (English)</Label>
          <textarea rows={5} className="w-full rounded-md border border-input bg-transparent p-2 text-sm" value={current.bio_en ?? ""} onChange={(e) => set("bio_en", e.target.value)} />
        </div>
        <div>
          <Label>Bio (Farsi)</Label>
          <textarea dir="rtl" rows={5} className="w-full rounded-md border border-input bg-transparent p-2 text-sm" value={current.bio_fa ?? ""} onChange={(e) => set("bio_fa", e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!current.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          Publish profile publicly
        </label>
        {mut.error && <p className="text-sm text-destructive">{(mut.error as Error).message}</p>}
        <button disabled={mut.isPending} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">
          {mut.isPending ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
