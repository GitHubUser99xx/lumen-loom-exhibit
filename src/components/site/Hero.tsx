import heroImage from "@/assets/virtual-hall.jpg";
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
          alt="Filmic exhibition hall by Ali Shahidi"
          width={1920}
          height={1080}
          className="h-full w-full animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-sky-100/60 mix-blend-multiply backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_25%)] mix-blend-screen" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-sky-100/60 to-transparent" />
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
