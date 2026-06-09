import painting from "@/assets/artwork-painting.jpg";
import sculpture from "@/assets/artwork-sculpture.jpg";
import photography from "@/assets/artwork-photography.jpg";
import crafts from "@/assets/artwork-crafts.jpg";

const artworks = [
  {
    title: "Liminal Bloom",
    medium: "Painting",
    src: painting,
    artist: "Amy Moore",
  },
  {
    title: "Threshold",
    medium: "Sculpture",
    src: sculpture,
    artist: "John Smith",
  },
  {
    title: "City of Quiet",
    medium: "Photography",
    src: photography,
    artist: "Ali Shahidi",
  },
  {
    title: "Echoes",
    medium: "Mixed Media",
    src: crafts,
    artist: "Amy Moore",
  },
];

const artists = [
  { name: "Ali Shahidi", img: "/src/assets/artist-ali-shahidi.jpg" },
  { name: "Amy Moore", img: "/src/assets/artwork-painting.jpg" },
  { name: "John Smith", img: "/src/assets/artwork-sculpture.jpg" },
];

export function BrowseIndex() {
  return (
    <section id="gallery" className="bg-midnight/80 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-aurora">Artists</span>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ivory md:text-5xl">Explore artists</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory-soft md:text-lg">Browse all participating artists in this exhibition.</p>
        </div>

        <div id="artists" className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {artists.map((a) => (
            <div key={a.name} className="flex items-center gap-4 rounded-2xl bg-midnight-deep p-4">
              <img src={a.img} alt={a.name} className="h-20 w-20 rounded-sm object-cover" />
              <div>
                <div className="font-display text-lg text-ivory">{a.name}</div>
                <div className="text-sm text-ivory-soft">Solo exhibition</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {artworks.map((art) => (
              <article
                key={art.title}
                className="overflow-hidden rounded-3xl border border-ivory/10 bg-midnight-deep shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5"
              >
                <div className="relative overflow-hidden bg-[#111827]">
                  <img src={art.src} alt={`${art.title} by Ali Shahidi`} className="h-64 w-full object-cover" />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-aurora">{art.medium}</p>
                  <h3 className="font-display text-xl text-ivory">{art.title}</h3>
                  <p className="text-sm text-ivory-soft">Ali Shahidi</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-ivory/10 bg-midnight-deep p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <h3 className="font-display text-2xl text-ivory">Main artist</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory-soft">
                Ali Shahidi is the centerpiece of this exhibition — his work spans painting, sculpture, photography, and mixed media.
              </p>
            </div>

            <div className="rounded-3xl border border-ivory/10 bg-midnight-deep p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <h3 className="font-display text-2xl text-ivory">Collections</h3>
              <ul className="mt-6 space-y-3 text-sm text-ivory-soft">
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">Painting: Abstract, Ancient Civilization, Exoplanet</li>
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">Sculpture: Material Stories, Monumental Gesture</li>
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">Photography: Portrait, Light & Landscape</li>
                <li className="rounded-2xl bg-ivory/5 px-4 py-3">Poetry: Ritual, Modern Frame</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
