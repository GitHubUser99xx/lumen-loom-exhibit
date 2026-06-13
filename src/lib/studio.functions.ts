import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const slug = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/);

const ArtistSchema = z.object({
  slug,
  display_name: z.string().min(1).max(200),
  country: z.string().max(100).optional().nullable(),
  languages: z.array(z.string().max(10)).max(20).default([]),
  bio_en: z.string().max(8000).optional().nullable(),
  bio_fa: z.string().max(8000).optional().nullable(),
  bio_fr: z.string().max(8000).optional().nullable(),
  profile_image_path: z.string().max(512).optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  is_published: z.boolean().default(false),
});

export const upsertMyArtist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ArtistSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("artists")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    const payload = { ...data, user_id: userId, updated_at: new Date().toISOString() };
    if (existing) {
      const { data: row, error } = await supabase
        .from("artists")
        .update(payload)
        .eq("id", existing.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await supabase
      .from("artists")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getMyArtist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("artists")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    return data;
  });

const Hall = z.enum(["painting", "sculpture", "photography", "architecture", "poetry", "craft"]);

const ArtworkSchema = z.object({
  id: z.string().uuid().optional(),
  slug,
  title_en: z.string().min(1).max(300),
  title_fa: z.string().max(300).optional().nullable(),
  title_fr: z.string().max(300).optional().nullable(),
  description_en: z.string().max(8000).optional().nullable(),
  description_fa: z.string().max(8000).optional().nullable(),
  description_fr: z.string().max(8000).optional().nullable(),
  hall: Hall,
  medium: z.string().max(200).optional().nullable(),
  year: z.number().int().min(0).max(3000).optional().nullable(),
  tags: z.array(z.string().max(40)).max(30).default([]),
  image_paths: z.record(z.string(), z.string()).default({}),
  video_url: z.string().url().max(500).optional().nullable(),
  video_provider: z.enum(["youtube", "vimeo", "cloudinary"]).optional().nullable(),
  is_published: z.boolean().default(false),
});

export const listMyArtworks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: artist } = await context.supabase
      .from("artists")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!artist) return [];
    const { data, error } = await context.supabase
      .from("artworks")
      .select("id, slug, title_en, hall, is_published, image_paths, year, created_at")
      .eq("artist_id", artist.id)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const upsertMyArtwork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ArtworkSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: artist, error: aErr } = await context.supabase
      .from("artists")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (aErr) throw new Error(aErr.message);
    if (!artist) throw new Error("Create your artist profile first.");

    const payload = {
      ...data,
      artist_id: artist.id,
      created_by: context.userId,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("artworks")
        .update(payload)
        .eq("id", data.id)
        .select("id, slug, title_en, title_fa, title_fr, hall, medium, year, is_published, image_paths, video_url, video_provider, created_at, updated_at")
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("artworks")
      .insert(payload)
      .select("id, slug, title_en, title_fa, title_fr, hall, medium, year, is_published, image_paths, video_url, video_provider, created_at, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteMyArtwork = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("artworks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
