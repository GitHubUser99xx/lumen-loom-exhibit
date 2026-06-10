import heroImage from "@/assets/hero-exhibition.jpg";
import { useT } from "@/lib/i18n";

export function Hero() {
  const { t } = useT();
  return (
    <section
      id="top"
      className="relative flex h-[78svh] min-h-[560px] w-full items-end overflow-hidden bg-midnight"
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Filmic interior exhibition hall"
          width={1920}
          height={1080}
          className="h-full w-full animate-ken-burns object-cover"
        />
        {/* Lighter gradients so the artwork remains visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/75 via-midnight/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-24">
        <div className="max-w-3xl animate-reveal">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-12 bg-aurora animate-shimmer" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("hero.eyebrow")}
            </span>
          </div>

          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-ivory text-balance md:text-6xl lg:text-7xl">
            {t("hero.title.1")}
            <br />
            <em className="font-light text-aurora">{t("hero.title.2")}</em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory-soft md:text-lg">
            {t("hero.lead")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#exhibition"
              className="group inline-flex items-center gap-3 rounded-full bg-aurora px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-midnight-deep shadow-glow transition-transform hover:translate-y-[-1px] active:scale-95"
            >
              {t("hero.cta.enter")}
              <span className="h-1.5 w-1.5 rounded-full bg-midnight-deep transition-transform group-hover:scale-150" />
            </a>
            <a
              href="#hall"
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-ivory underline underline-offset-8 transition-colors hover:text-aurora"
            >
              {t("hero.cta.walk")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
