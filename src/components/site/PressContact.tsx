import { useState } from "react";
import { useT } from "@/lib/i18n";

export function PressContact() {
  const { t } = useT();
  return (
    <section id="contact" className="bg-midnight-deep py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
        {/* Press */}
        <div id="press" className="md:col-span-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
            {t("press.eyebrow")}
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">
            {t("press.title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ivory-soft">
            {t("press.lead")}
          </p>

          <ul className="mt-8 divide-y divide-ivory/10 border-y border-ivory/10">
            {["1", "2", "3"].map((k) => (
              <li key={k} className="flex items-baseline justify-between gap-4 py-4">
                <div>
                  <div className="font-display text-lg text-ivory">{t(`press.item.${k}.title`)}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora/80">
                    {t(`press.item.${k}.source`)}
                  </div>
                </div>
                <a
                  href="#"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-ivory-soft underline-offset-4 hover:text-aurora hover:underline"
                >
                  {t("press.read")}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="mailto:press@lumen.ca"
            className="mt-8 inline-flex items-center gap-2 border-b border-aurora pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora hover:opacity-70"
          >
            press@lumen.ca →
          </a>
        </div>

        {/* Contact form */}
        <div className="md:col-span-7">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
            {t("contact.eyebrow")}
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">
            {t("contact.title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ivory-soft">
            {t("contact.lead")}
          </p>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const { t } = useT();
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sent");
      }}
      className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ivory-soft/70">
          {t("contact.name")}
        </span>
        <input
          required
          className="w-full rounded-sm border border-ivory/20 bg-midnight px-4 py-3 text-ivory placeholder:text-ivory-soft/40 focus:border-aurora focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ivory-soft/70">
          {t("contact.email")}
        </span>
        <input
          required
          type="email"
          className="w-full rounded-sm border border-ivory/20 bg-midnight px-4 py-3 text-ivory placeholder:text-ivory-soft/40 focus:border-aurora focus:outline-none"
        />
      </label>
      <label className="md:col-span-2 flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ivory-soft/70">
          {t("contact.message")}
        </span>
        <textarea
          required
          rows={5}
          className="w-full rounded-sm border border-ivory/20 bg-midnight px-4 py-3 text-ivory placeholder:text-ivory-soft/40 focus:border-aurora focus:outline-none"
        />
      </label>
      <div className="md:col-span-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-3 rounded-full bg-aurora px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-midnight-deep shadow-glow transition-transform hover:-translate-y-px active:scale-95"
        >
          {t("contact.send")}
        </button>
        {status === "sent" && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-aurora">
            {t("contact.sent")}
          </span>
        )}
      </div>
    </form>
  );
}
