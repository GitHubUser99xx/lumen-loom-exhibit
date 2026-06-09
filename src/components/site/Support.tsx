import { useT } from "@/lib/i18n";

const tiers = ["patron", "donate", "membership", "foundation"] as const;

export function Support() {
  const { t } = useT();
  return (
    <section id="support" className="bg-midnight py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("support.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">
              {t("support.title.1")} <em className="text-aurora">{t("support.title.2")}</em>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ivory-soft md:col-span-6 md:pt-6">
            {t("support.lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((k, i) => (
            <article
              key={k}
              className="flex h-full flex-col rounded-sm border border-ivory/15 bg-midnight-mid p-7 shadow-frame transition-colors hover:border-aurora/60"
            >
              <span className="font-display text-3xl italic text-aurora">0{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl text-ivory">{t(`support.${k}.title`)}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora/80">
                {t(`support.${k}.tier`)}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ivory-soft">
                {t(`support.${k}.desc`)}
              </p>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 border-b border-aurora pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora self-start hover:opacity-70"
              >
                {t(`support.${k}.cta`)}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
