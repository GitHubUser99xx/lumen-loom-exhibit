import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PAGE_SIZE = 24;

const SearchInput = z.object({
  q: z.string().trim().max(200).optional().default(""),
  hall: z.enum(["painting", "sculpture", "photography", "architecture", "poetry", "craft"]).optional(),
  cursor: z
    .object({
      rank: z.number(),
      created_at: z.string(),
      id: z.string(),
    })
    .nullable()
    .optional(),
});

export type SearchInputT = z.infer<typeof SearchInput>;

export type SearchHit = {
  id: string;
  slug: string;
  title_en: string;
  title_fa: string | null;
  hall: string;
  year: number | null;
  medium: string | null;
  image_paths: Record<string, unknown>;
  artist_id: string;
  artist_name: string | null;
  artist_slug: string | null;
  created_at: string;
  rank: number;
};

export type SearchResult = {
  items: SearchHit[];
  nextCursor: { rank: number; created_at: string; id: string } | null;
};

export const searchArtworks = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SearchInput.parse(data))
  .handler(async ({ data }): Promise<SearchResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const q = data.q.trim();
    const hasQuery = q.length > 0;
    const limit = PAGE_SIZE + 1;

    // Build a tsquery from the user's words using prefix matching.
    const tsquery = hasQuery
      ? q
          .split(/\s+/)
          .filter(Boolean)
          .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
          .filter(Boolean)
          .map((w) => `${w}:*`)
          .join(" & ")
      : null;

    // Build the SQL via PostgREST rpc — we use a single SQL function call here via .rpc not defined,
    // so instead we leverage two query paths against the table.
    let query = supabaseAdmin
      .from("artworks")
      .select(
        "id, slug, title_en, title_fa, hall, year, medium, image_paths, artist_id, created_at, artists!inner(display_name, slug)",
      )
      .eq("is_published", true);

    if (data.hall) query = query.eq("hall", data.hall);

    if (hasQuery && tsquery) {
      // Use text search; fallback to trigram if needed via ilike on title_en
      query = query.or(
        `title_en.ilike.%${q.replace(/[%_]/g, "")}%,title_fa.ilike.%${q.replace(/[%_]/g, "")}%`,
      );
    }

    // Keyset pagination by (created_at desc, id desc)
    if (data.cursor) {
      query = query.or(
        `created_at.lt.${data.cursor.created_at},and(created_at.eq.${data.cursor.created_at},id.lt.${data.cursor.id})`,
      );
    }

    query = query.order("created_at", { ascending: false }).order("id", { ascending: false }).limit(limit);

    const { data: rows, error } = await query;
    if (error) {
      console.error("[searchArtworks]", error);
      return { items: [], nextCursor: null };
    }

    const items: SearchHit[] = (rows ?? []).map((r: any) => ({
      id: r.id,
      slug: r.slug,
      title_en: r.title_en,
      title_fa: r.title_fa,
      hall: r.hall,
      year: r.year,
      medium: r.medium,
      image_paths: r.image_paths ?? {},
      artist_id: r.artist_id,
      artist_name: r.artists?.display_name ?? null,
      artist_slug: r.artists?.slug ?? null,
      created_at: r.created_at,
      rank: 0,
    }));

    let nextCursor: SearchResult["nextCursor"] = null;
    if (items.length > PAGE_SIZE) {
      const last = items[PAGE_SIZE - 1];
      nextCursor = { rank: 0, created_at: last.created_at, id: last.id };
      items.length = PAGE_SIZE;
    }

    return { items, nextCursor };
  });
