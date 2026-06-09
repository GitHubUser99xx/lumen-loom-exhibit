import { useT } from "@/lib/i18n";

export function Testimonials() {
  const { t } = useT();
  const items = ["1", "2", "3"];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-midnight-deep py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
            {t("testimonials.eyebrow")}
          </span>
          <h2 className="mt-4 font-display text-5xl tracking-tight text-ivory md:text-6xl">
            {t("testimonials.title.1")} <em className="text-aurora">{t("testimonials.title.2")}</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((k) => (
            <figure
              key={k}
              className="flex flex-col rounded-sm border border-ivory/10 bg-midnight p-10 shadow-frame transition-colors hover:border-aurora/40"
            >
              <span aria-hidden className="font-display text-7xl leading-none text-aurora">
                "
              </span>
              <blockquote className="mt-2 flex-1 font-display text-xl leading-snug text-ivory text-balance md:text-2xl">
                {t(`test.${k}.quote`)}
              </blockquote>
              <figcaption className="mt-8 border-t border-ivory/10 pt-6">
                <div className="font-display text-lg italic text-ivory">{t(`test.${k}.author`)}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora/70">
                  {t(`test.${k}.role`)}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
