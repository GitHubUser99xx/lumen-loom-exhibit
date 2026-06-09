import { useT } from "@/lib/i18n";

export function IPProtection() {
  const { t } = useT();
  const steps = ["1", "2", "3"];
  const pillars = ["1", "2", "3", "4"];

  return (
    <section id="ip" className="relative overflow-hidden bg-midnight py-32 md:py-48">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-aurora/15 blur-[180px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("ip.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-5xl tracking-tight text-ivory md:text-6xl">
              {t("ip.title.1")} <em className="text-aurora">{t("ip.title.2")}</em>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ivory/80 md:col-span-6 md:pt-8">
            {t("ip.lead")}
          </p>
        </div>

        {/* How to protect — 3 steps */}
        <div className="mb-24 rounded-sm border border-aurora/30 bg-midnight-deep/70 p-10 shadow-cinematic backdrop-blur-sm md:p-16">
          <div className="mb-12 max-w-2xl">
            <h3 className="font-display text-3xl text-ivory md:text-4xl">
              {t("ip.howto.title")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ivory/75">
              {t("ip.howto.lead")}
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <li key={s} className="relative">
                {i < steps.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-12 top-6 hidden h-px w-full bg-linear-to-r from-aurora/60 to-transparent md:block"
                  />
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-aurora bg-midnight font-display text-xl text-aurora">
                  {s}
                </div>
                <h4 className="mt-6 font-display text-xl text-ivory md:text-2xl">
                  {t(`ip.step.${s}.title`)}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                  {t(`ip.step.${s}.desc`)}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Pillars */}
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-ivory/10 ring-1 ring-ivory/10 md:grid-cols-2">
          {pillars.map((p) => (
            <li key={p} className="bg-midnight-deep p-10 md:p-12">
              <div className="flex items-baseline gap-6">
                <span className="font-display text-4xl italic text-aurora">
                  0{p}
                </span>
                <h3 className="font-display text-2xl text-ivory md:text-3xl">
                  {t(`ip.pillar.${p}.title`)}
                </h3>
              </div>
              <p className="mt-6 text-base leading-relaxed text-ivory/75">
                {t(`ip.pillar.${p}.desc`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
