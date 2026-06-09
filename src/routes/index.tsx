import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { FeaturedArtist } from "@/components/site/FeaturedArtist";
import { VirtualHall } from "@/components/site/VirtualHall";
import { BrowseIndex } from "@/components/site/BrowseIndex";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUMEN — Ali Shahidi Exhibition" },
      {
        name: "description",
        content:
          "A focused exhibition of Ali Shahidi's paintings, sculptures, photography and mixed media, arranged across a small number of floors.",
      },
      { property: "og:title", content: "LUMEN — Ali Shahidi Exhibition" },
      {
        property: "og:description",
        content:
          "A virtual exhibition centered on Ali Shahidi's work, with distinct floors, featured artworks, and curated collections.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ArtGallery",
          name: "LUMEN",
          description:
            "A focused virtual exhibition for Ali Shahidi, showcasing painting, sculpture, photography, and mixed media.",
          inLanguage: ["en"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedArtist />
        <VirtualHall />
        <BrowseIndex />
      </main>
      <Footer />
    </>
  );
}
