import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertCurator(supabase: any, userId: string) {
  const [a, b] = await Promise.all([
    supabase.rpc("has_role", { _user_id: userId, _role: "curator" }),
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
  ]);
  if (a.error) throw new Error(a.error.message);
  if (b.error) throw new Error(b.error.message);
  if (!a.data && !b.data) throw new Error("Forbidden");
}

const slug = z.string().min(1).max(200).regex(/^[a-z0-9-]+$/);
const Hall = z.enum(["painting", "sculpture", "photography", "architecture", "poetry", "craft"]);

const ExhibitionSchema = z.object({
  id: z.string().uuid().optional(),
  slug,
  hall: Hall,
  title_en: z.string().min(1).max(300),
  title_fa: z.string().max(300).optional().nullable(),
  title_fr: z.string().max(300).optional().nullable(),
  description_en: z.string().max(8000).optional().nullable(),
  starts_at: z.string().optional().nullable(),
  ends_at: z.string().optional().nullable(),
  hero_image_path: z.string().max(512).optional().nullable(),
  is_published: z.boolean().default(false),
});

export const listExhibitions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertCurator(context.supabase, context.userId);
    const { data } = await context.supabase
      .from("exhibitions")
      .select("id, slug, title_en, hall, is_published, starts_at, ends_at")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const upsertExhibition = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ExhibitionSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertCurator(context.supabase, context.userId);
    const payload = { ...data, curator_id: context.userId, updated_at: new Date().toISOString() };
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("exhibitions").update(payload).eq("id", data.id).select().single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("exhibitions").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return row;
  });
