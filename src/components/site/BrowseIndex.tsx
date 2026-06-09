import painting from "@/assets/artwork-painting.jpg";
import sculpture from "@/assets/artwork-sculpture.jpg";
import photography from "@/assets/artwork-photography.jpg";
import crafts from "@/assets/artwork-crafts.jpg";
import artistAli from "@/assets/artist-ali-shahidi.jpg";
import portraitAmy from "@/assets/portrait-amy.jpg";
import portraitJohn from "@/assets/portrait-john.jpg";
import { useT } from "@/lib/i18n";

const artworks = [
  {
    titleKey: "art.liminal.title",
    mediumKey: "art.liminal.medium",
    src: painting,
    artist: "Amy Moore",
  },
  {
    titleKey: "art.threshold.title",
    mediumKey: "art.threshold.medium",
    src: sculpture,
    artist: "John Smith",
  },
  {
    titleKey: "art.city.title",
    mediumKey: "art.city.medium",
    src: photography,
    artist: "Ali Shahidi",
  },
  {
    titleKey: "art.echoes.title",
    mediumKey: "art.echoes.medium",
    src: crafts,
    artist: "Amy Moore",
  },
];

const artists = [
  { name: "Ali Shahidi", img: artistAli },
  { name: "Amy Moore", img: portraitAmy },
  { name: "John Smith", img: portraitJohn },
];

export function BrowseIndex() {
  const { t } = useT();

  return (
    <section id="gallery" className="bg-midnight/80 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">{t("browse.artists")}</span>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">{t("browse.title")}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory-soft md:text-lg">{t("browse.lead")}</p>
        </div>

        <div id="artists" className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {artists.map((a) => (
            <div key={a.name} className="flex items-center gap-4 rounded-2xl bg-midnight-deep p-4">
              <img src={a.img} alt={a.name} className="h-20 w-20 rounded-sm object-cover" />
              <div>
                <div className="font-display text-lg text-ivory">{a.name}</div>
                <div className="text-sm text-ivory-soft">{t("browse.solo")}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {artworks.map((art) => (
              <article
                key={`${art.titleKey}-${art.artist}`}
                className="overflow-hidden rounded-3xl border border-ivory/10 bg-midnight-deep shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5"
              >
                <div className="relative overflow-hidden bg-[#111827]">
                  <img src={art.src} alt={`${t(art.titleKey)} by ${art.artist}`} className="h-64 w-full object-cover" />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-aurora">{t(art.mediumKey)}</p>
                  <h3 className="font-display text-xl text-ivory">{t(art.titleKey)}</h3>
                  <p className="text-sm text-ivory-soft">{art.artist}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-ivory/10 bg-midnight-deep p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <h3 className="font-display text-2xl text-ivory">{t("browse.mainArtist.title")}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory-soft">{t("browse.mainArtist.desc")}</p>
            </div>

            <div className="rounded-3xl border border-ivory/10 bg-midnight-deep p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <h3 className="font-display text-2xl text-ivory">{t("browse.collections.title")}</h3>
              <ul className="mt-6 space-y-3 text-sm text-ivory-soft">
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">{t("browse.collections.painting")}</li>
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">{t("browse.collections.sculpture")}</li>
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">{t("browse.collections.photography")}</li>
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">{t("browse.collections.poetry")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
