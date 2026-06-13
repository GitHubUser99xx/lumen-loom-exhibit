import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/studio/artworks/$id")({
  component: EditArtwork,
});

function EditArtwork() {
  const { id } = Route.useParams();
  return (
    <div>
      <h1 className="mb-2 font-display text-2xl">Edit artwork</h1>
      <p className="text-sm text-muted-foreground">ID: {id}</p>
      <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        Full editor coming in the next phase. Until then, delete and recreate from{" "}
        <Link to="/studio" className="underline">My artworks</Link>.
      </p>
    </div>
  );
}
