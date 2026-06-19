import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Hall = z.enum([
  "painting",
  "sculpture",
  "photography",
  "architecture",
  "poetry",
  "craft",
]);

export type HallSlug = z.infer<typeof Hall>;

async function signImage(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const bucket = path.startsWith("artists/") ? "artist-media" : "artwork-media";
  const key = path.replace(/^artists\//, "");
  const { data } = await supabaseAdmin.storage.from(bucket).createSignedUrl(key, 60 * 60);
  return data?.signedUrl ?? null;
}

function firstImage(image_paths: Record<string, string> | null | undefined): string | null {
  if (!image_paths) return null;
  return image_paths.main ?? image_paths.hero ?? Object.values(image_paths)[0] ?? null;
}

const stripTsv = <T extends { search_tsv?: unknown }>(row: T) => {
  if (!row) return row;
  const { search_tsv: _omit, ...rest } = row;
  return rest;
};

export type PublicArtworkCard = {
  id: string;
  slug: string;
  title_en: string;
  title_fa: string | null;
  title_fr: string | null;
  hall: string;
  year: number | null;
  medium: string | null;
  image_url: string | null;
  artist_name: string | null;
  artist_slug: string | null;
};

// ---------- Hall page ----------
export const getHallPage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ hall: Hall }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("artworks")
      .select(
        "id, slug, title_en, title_fa, title_fr, hall, year, medium, image_paths, artist_id, created_at, artists!inner(display_name, slug, is_published)",
      )
      .eq("is_published", true)
      .eq("hall", data.hall)
      .order("created_at", { ascending: false })
      .limit(48);
    if (error) throw new Error(error.message);

    const items: PublicArtworkCard[] = await Promise.all(
      (rows ?? []).map(async (r: any) => ({
        id: r.id,
        slug: r.slug,
        title_en: r.title_en,
        title_fa: r.title_fa,
        title_fr: r.title_fr,
        hall: r.hall,
        year: r.year,
        medium: r.medium,
        image_url: await signImage(firstImage(r.image_paths)),
        artist_name: r.artists?.display_name ?? null,
        artist_slug: r.artists?.slug ?? null,
      })),
    );
    return { hall: data.hall, items };
  });

// ---------- Artwork detail ----------
export const getArtworkBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("artworks")
      .select(
        "id, slug, title_en, title_fa, title_fr, description_en, description_fa, description_fr, hall, year, medium, tags, image_paths, video_url, video_provider, created_at, artist_id, artists!inner(display_name, slug, country, bio_en, bio_fa, bio_fr, profile_image_path)",
      )
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;

    const paths = (row.image_paths as Record<string, string>) ?? {};
    const images = await Promise.all(
      Object.entries(paths).map(async ([k, v]) => [k, await signImage(v)] as const),
    );
    return {
      ...stripTsv(row as any),
      image_urls: Object.fromEntries(images),
      hero_url: images[0]?.[1] ?? null,
    };
  });

// ---------- Artist detail ----------
export const getArtistBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: artist, error } = await supabaseAdmin
      .from("artists")
      .select(
        "id, slug, display_name, country, languages, bio_en, bio_fa, bio_fr, profile_image_path, socials, is_featured, created_at",
      )
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!artist) return null;

    const { data: works } = await supabaseAdmin
      .from("artworks")
      .select("id, slug, title_en, title_fa, title_fr, hall, year, medium, image_paths, created_at")
      .eq("artist_id", artist.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(36);

    const items: PublicArtworkCard[] = await Promise.all(
      (works ?? []).map(async (r: any) => ({
        id: r.id,
        slug: r.slug,
        title_en: r.title_en,
        title_fa: r.title_fa,
        title_fr: r.title_fr,
        hall: r.hall,
        year: r.year,
        medium: r.medium,
        image_url: await signImage(firstImage(r.image_paths)),
        artist_name: artist.display_name,
        artist_slug: artist.slug,
      })),
    );

    return {
      ...artist,
      profile_url: await signImage(artist.profile_image_path),
      works: items,
    };
  });

// ---------- Exhibition detail ----------
export const getExhibitionBySlug = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ex, error } = await supabaseAdmin
      .from("exhibitions")
      .select(
        "id, slug, hall, title_en, title_fa, title_fr, description_en, description_fa, description_fr, hero_image_path, starts_at, ends_at, created_at",
      )
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ex) return null;

    const { data: links } = await supabaseAdmin
      .from("exhibition_artworks")
      .select(
        "position, artworks!inner(id, slug, title_en, title_fa, title_fr, hall, year, medium, image_paths, is_published, artists!inner(display_name, slug))",
      )
      .eq("exhibition_id", ex.id)
      .order("position", { ascending: true });

    const items: PublicArtworkCard[] = await Promise.all(
      (links ?? [])
        .filter((l: any) => l.artworks?.is_published)
        .map(async (l: any) => {
          const r = l.artworks;
          return {
            id: r.id,
            slug: r.slug,
            title_en: r.title_en,
            title_fa: r.title_fa,
            title_fr: r.title_fr,
            hall: r.hall,
            year: r.year,
            medium: r.medium,
            image_url: await signImage(firstImage(r.image_paths)),
            artist_name: r.artists?.display_name ?? null,
            artist_slug: r.artists?.slug ?? null,
          };
        }),
    );

    return {
      ...ex,
      hero_url: await signImage(ex.hero_image_path),
      items,
    };
  });
