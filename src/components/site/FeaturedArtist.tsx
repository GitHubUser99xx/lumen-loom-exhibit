import portrait from "@/assets/artist-ali-shahidi.jpg";
import phoenix from "@/assets/artwork-photography.jpg";
import { useT } from "@/lib/i18n";
import { useState } from "react";

function CompactImage({ src, alt, ratio = "aspect-4/5" }: { src: string; alt: string; ratio?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-sm bg-midnight-mid shadow-cinematic ring-1 ring-ivory/10">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-midnight-mid" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${ratio} w-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export function FeaturedArtist() {
  const { t } = useT();
  return (
    <section id="exhibition" className="bg-midnight py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("artist.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">
              {t("artist.name")}
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ivory-soft/60">
            Section 02
          </span>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-14">
          <figure className="md:col-span-5">
            <CompactImage src={portrait} alt="Painting by Ali Shahidi" />
          </figure>

          <div className="md:col-span-7">
            <p className="font-display text-xl leading-snug text-ivory text-balance md:text-2xl">
              <em>{t("artist.quote")}</em>
            </p>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-ivory-soft">
              <p>{t("artist.bio.1")}</p>
              <p>{t("artist.bio.2")}</p>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ivory/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory-soft/70">
              <div>
                <dt>{t("artist.works")}</dt>
                <dd className="mt-1 font-display text-2xl text-ivory normal-case tracking-normal">134</dd>
              </div>
              <div>
                <dt>{t("artist.years")}</dt>
                <dd className="mt-1 font-display text-2xl text-ivory normal-case tracking-normal">2004—26</dd>
              </div>
              <div>
                <dt>{t("artist.floors")}</dt>
                <dd className="mt-1 font-display text-2xl text-ivory normal-case tracking-normal">IV</dd>
              </div>
            </dl>

            <a
              href="#collection"
              className="mt-10 inline-flex items-center gap-3 border-b border-aurora pb-1 font-mono text-[11px] uppercase tracking-[0.25em] text-aurora transition-opacity hover:opacity-70"
            >
              {t("artist.cta")}
            </a>
          </div>
        </div>

        {/* Secondary featured work — compact */}
        <div className="mt-24 grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7 md:order-1 order-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("work.3.title")}
            </span>
            <h3 className="mt-3 font-display text-3xl italic text-ivory md:text-4xl">
              {t("work.3.title")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ivory-soft">
              {t("work.3.medium")}
            </p>
          </div>
          <figure className="md:col-span-5 md:order-2 order-1">
            <CompactImage src={phoenix} alt="Phoenix — work by Ali Shahidi" ratio="aspect-square" />
          </figure>
        </div>

        
      </div>
    </section>
  );
}
