import { useT } from "@/lib/i18n";

export function VirtualHall() {
  const { t } = useT();
  const floors = [
    { num: "I", key: "1" },
    { num: "II", key: "2" },
    { num: "III", key: "3" },
    { num: "IV", key: "4" },
  ];

  return (
    <section id="hall" className="relative overflow-hidden bg-midnight-deep py-32 md:py-48">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-aurora/20 blur-[140px]" />
        <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-ember/15 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("hall.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-5xl tracking-tight text-ivory md:text-6xl">
              {t("hall.title.1")} <em className="text-aurora">{t("hall.title.2")}</em>
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-ivory/75 md:col-span-6 md:pt-8">
            {t("hall.lead")}
          </p>
        </div>

        <ol className="divide-y divide-ivory/10 border-y border-ivory/10">
          {floors.map((f) => (
            <li
              key={f.num}
              className="group grid grid-cols-12 items-center gap-6 py-10 transition-colors hover:bg-ivory/3"
            >
              <span className="col-span-2 font-display text-4xl italic text-aurora md:col-span-1 md:text-5xl">
                {f.num}
              </span>
              <h3 className="col-span-10 font-display text-2xl text-ivory transition-transform group-hover:translate-x-2 md:col-span-4 md:text-3xl">
                {t(`floors.${f.key}.name`)}
              </h3>
              <p className="col-span-12 text-base text-ivory/65 md:col-span-5">
                {t(`floors.${f.key}.desc`)}
              </p>
              <span className="col-span-12 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/40 md:col-span-2 md:text-right">
                {t(`floors.${f.key}.count`)}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex justify-center">
          <a
            href="#collection"
            className="inline-flex items-center gap-3 rounded-full border border-aurora/60 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] text-aurora transition-all hover:bg-aurora hover:text-midnight-deep"
          >
            {t("hall.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
