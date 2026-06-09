import { createFileRoute } from "@tanstack/react-router";

function html(body: string, title: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><title>${title}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{margin:0;background:#1a2438;color:#f3f3ee;font-family:Inter,system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;padding:2rem}
  .card{max-width:480px;text-align:center;border:1px solid rgba(243,243,238,.18);background:rgba(0,0,0,.2);padding:2.5rem;border-radius:6px}
  h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:2rem;margin:0 0 1rem;color:#e7fbff}
  p{line-height:1.6;color:#d8d8d0}
  a{color:#7ee0f5;text-decoration:none;border-bottom:1px solid #7ee0f5;padding-bottom:2px;font-family:monospace;letter-spacing:.18em;text-transform:uppercase;font-size:.7rem}
</style></head><body><div class="card">${body}<p style="margin-top:2rem"><a href="/">Return to LUMEN ←</a></p></div></body></html>`;
}

export const Route = createFileRoute("/api/public/subscribe/confirm")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        if (!token) {
          return new Response(html("<h1>Invalid link</h1><p>This confirmation link is missing its token.</p>", "Invalid link"), {
            status: 400,
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("subscribers")
          .update({ confirmed: true, confirmed_at: new Date().toISOString() })
          .eq("confirmation_token", token)
          .select("email")
          .maybeSingle();
        if (error || !data) {
          return new Response(html("<h1>Link expired</h1><p>This confirmation link is invalid or has already been used.</p>", "Link expired"), {
            status: 404,
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
        return new Response(html(`<h1>You're on the list</h1><p>Thank you — <strong>${data.email}</strong> is confirmed for LUMEN dispatches from info@lumen.ca.</p>`, "Subscribed"), {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
