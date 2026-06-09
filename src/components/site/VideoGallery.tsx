import { useState } from "react";
import { useT } from "@/lib/i18n";

type Slot = {
  key: string;
  poster?: string;
  // Optional embed URL (YouTube/Vimeo). When empty, we render an inert placeholder.
  embedUrl?: string;
};

const slots: Slot[] = [
  { key: "1" },
  { key: "2" },
  { key: "3" },
];

export function VideoGallery() {
  const { t } = useT();
  return (
    <section id="films" className="bg-midnight-deep py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">
              {t("films.eyebrow")}
            </span>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">
              {t("films.title.1")} <em className="text-aurora">{t("films.title.2")}</em>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ivory-soft md:col-span-6 md:pt-6">
            {t("films.lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {slots.map((s) => (
            <VideoSlot key={s.key} slot={s} label={t(`films.${s.key}.title`)} sub={t(`films.${s.key}.sub`)} cta={t("films.play")} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSlot({ slot, label, sub, cta }: { slot: Slot; label: string; sub: string; cta: string }) {
  const [active, setActive] = useState(false);
  return (
    <figure className="group overflow-hidden rounded-sm bg-midnight-mid shadow-frame ring-1 ring-ivory/10">
      <div className="relative aspect-video w-full overflow-hidden">
        {active && slot.embedUrl ? (
          <iframe
            src={slot.embedUrl}
            title={label}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => slot.embedUrl && setActive(true)}
            aria-label={`${cta}: ${label}`}
            className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-midnight-mid via-midnight to-midnight-deep transition-transform group-hover:scale-[1.02]"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-aurora bg-midnight-deep/60 backdrop-blur transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-aurora" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="absolute bottom-3 left-3 right-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ivory-soft/70">
              {slot.embedUrl ? cta : "Placeholder · awaiting upload"}
            </span>
          </button>
        )}
      </div>
      <figcaption className="border-t border-ivory/10 p-5">
        <div className="font-display text-xl text-ivory">{label}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-aurora/80">{sub}</div>
      </figcaption>
    </figure>
  );
}
