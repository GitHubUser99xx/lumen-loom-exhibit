import heroImage from "@/assets/hero-exhibition.jpg";
import { useT } from "@/lib/i18n";

export function Hero() {
  const { t } = useT();

  return (
    <section
      id="top"
      className="relative flex h-[78svh] min-h-152 w-full items-end overflow-hidden bg-midnight"
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Interior exhibition hall — cinematic"
          width={1920}
          height={1080}
          style={{ filter: "contrast(1.12) saturate(1.12) brightness(1.12) hue-rotate(-4deg)" }}
          className="h-full w-full animate-ken-burns object-cover"
        />
        {/* Lighter cool overlay so architecture reads clearly */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-sky-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-black/18 to-transparent" />
        {/* Space-like radial fade overlay for cinematic depth (styled in CSS) */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 hero-space-fade-1" />
            <div className="absolute inset-0 hero-space-fade-2" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-12 md:pb-24">
        <div className="max-w-3xl animate-reveal">
          <div className="mb-5 flex items-center gap-4">
            <span className="h-px w-12 bg-sky-300 animate-shimmer" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-sky-200 drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)]">
              {t("hero.eyebrow")}
            </span>
          </div>

          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-white text-balance md:text-6xl lg:text-7xl drop-shadow-[0_25px_40px_rgba(0,0,0,0.65)]">
            {t("hero.title.1")}
            <br />
            <em className="font-light text-violet-400">{t("hero.title.2")}</em>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]">
            {t("hero.lead")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#hall"
              className="group inline-flex items-center gap-3 rounded-full bg-ivory px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-midnight shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-aurora hover:text-midnight active:translate-y-0.5"
            >
              {t("hero.cta.enter")}
              <span className="h-1.5 w-1.5 rounded-full bg-midnight-deep transition-transform group-hover:scale-150" />
            </a>
            <a
              href="#gallery"
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
