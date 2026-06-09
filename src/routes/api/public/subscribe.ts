import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

function originFrom(request: Request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export const Route = createFileRoute("/api/public/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
        }
        const parsed = Body.safeParse(body);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
        }
        const { email } = parsed.data;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // If already confirmed, treat as success (no resend); otherwise (re)issue a token.
        const { data: existing } = await supabaseAdmin
          .from("subscribers")
          .select("id,confirmed,confirmation_token")
          .eq("email", email)
          .maybeSingle();

        let token = existing?.confirmation_token ?? crypto.randomUUID().replace(/-/g, "");
        if (!existing) {
          const { error } = await supabaseAdmin
            .from("subscribers")
            .insert({ email, confirmation_token: token });
          if (error) {
            console.error("[subscribe] insert failed", error);
            return Response.json({ ok: false, error: "db_error" }, { status: 500 });
          }
        } else if (!existing.confirmed) {
          token = crypto.randomUUID().replace(/-/g, "");
          await supabaseAdmin
            .from("subscribers")
            .update({ confirmation_token: token })
            .eq("id", existing.id);
        } else {
          return Response.json({ ok: true, alreadyConfirmed: true });
        }

        const confirmUrl = `${originFrom(request)}/api/public/subscribe/confirm?token=${token}`;
        // TODO: once the email domain (info@lumen.ca) is verified, send via the
        // app-emails template `subscribe-confirm` instead of just logging.
        console.log("[subscribe] confirmation link for", email, "->", confirmUrl);

        return Response.json({ ok: true });
      },
    },
  },
});
