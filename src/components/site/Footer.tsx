import { useState } from "react";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const [submitting, setSubmitting] = useState(false);

  const onJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("err");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setStatus("err");
      } else {
        setStatus("ok");
        setEmail("");
      }
    } catch {
      setStatus("err");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-midnight-deep text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl tracking-[0.2em] text-ivory">LUMEN</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-aurora">™</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory-soft/85">
              {t("footer.tagline")}
            </p>

            <form
              onSubmit={onJoin}
              aria-label={t("footer.newsletter")}
              className="mt-8 max-w-sm"
            >
              <div className="flex items-center gap-3 border-b border-ivory/30 pb-2 focus-within:border-aurora">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder={t("footer.email")}
                  aria-label={t("footer.email")}
                  className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory-soft/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-aurora hover:text-ivory disabled:opacity-50"
                >
                  {submitting ? "…" : t("footer.join")}
                </button>
              </div>
              {status === "ok" && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora">
                  {t("footer.join.ok")}
                </p>
              )}
              {status === "err" && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-destructive">
                  {t("footer.join.err")}
                </p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.28em] text-aurora">
                {t("footer.col.gallery")}
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-ivory-soft">
                <li><a href="#hall" className="hover:text-aurora">{t("nav.hall")}</a></li>
                <li><a href="#exhibition" className="hover:text-aurora">{t("nav.exhibitions")}</a></li>
                <li><a href="#collection" className="hover:text-aurora">{t("nav.collection")}</a></li>
                <li><a href="#films" className="hover:text-aurora">{t("nav.films")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.28em] text-aurora">
                {t("footer.col.support")}
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-ivory-soft">
                <li><a href="#support" className="hover:text-aurora">{t("support.patron.title")}</a></li>
                <li><a href="#support" className="hover:text-aurora">{t("support.donate.title")}</a></li>
                <li><a href="#support" className="hover:text-aurora">{t("support.membership.title")}</a></li>
                <li><a href="#support" className="hover:text-aurora">{t("support.foundation.title")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.28em] text-aurora">
                {t("footer.col.foundation")}
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-ivory-soft">
                <li><a href="#ip" className="hover:text-aurora">{t("nav.protect")}</a></li>
                <li><a href="#press" className="hover:text-aurora">{t("press.title")}</a></li>
                <li><a href="#contact" className="hover:text-aurora">{t("contact.title")}</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-ivory/15 pt-8">
          <div className="flex flex-col items-start justify-between gap-5 font-mono text-[10px] uppercase tracking-[0.28em] text-ivory-soft/60 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-ivory">LUMEN™</span>
              <span>© {year} · {t("footer.rights")}</span>
              <span>{t("footer.tm")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a href="#" className="hover:text-aurora">{t("footer.terms")}</a>
              <a href="#" className="hover:text-aurora">{t("footer.privacy")}</a>
              <a href="#" className="hover:text-aurora">{t("footer.accessibility")}</a>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <p className="text-center font-display text-base italic text-ivory-soft">
              {t("footer.credit")} <span className="text-aurora">Rodi V.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
