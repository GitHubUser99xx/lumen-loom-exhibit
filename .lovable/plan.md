# LUMEN → Scalable Digital Museum Platform

Goal: turn the current single-page LUMEN shell into a museum-grade platform that can host 100k+ artworks, 10k+ artists, and thousands of videos — without losing the cinematic design, the i18n layer (EN/FR/FA), the Supabase wiring, or the Vercel deployment already in place.

The email confirmation flow is parked as-is (`/api/public/subscribe` keeps logging the confirm link; we revisit when `lumen.ca` DNS is added).

Scope is large, so it ships in 5 phases. Each phase is independently deployable.

## Preserved from current repo
- TanStack Start + Vite + Tailwind setup, `src/styles.css` cinematic tokens (midnight / aurora / ivory)
- `src/lib/i18n.tsx` (EN/FA) — extended with FR
- `Header`, `Footer`, `Hero`, `LanguageSwitcher`, `Testimonials`, `IPProtection`, `PressContact`, `Support`, `VideoGallery`
- Supabase client + `subscribers` table + subscribe routes
- Vercel config, robots.txt, asset pipeline

## Phase 1 — Data model + media architecture (backend)

One migration. All public-schema tables get explicit GRANTs + RLS.

Tables:
- `artists` — slug, display_name, country, languages[], bio_*, profile_image_path, socials jsonb, contact_email, is_published, created_by
- `artworks` — slug, title_*, artist_id, year, medium, description_*, image_paths jsonb (`original/thumb/medium/large`), video_url, video_provider (cloudinary|vimeo|youtube), is_published, created_by, search_tsv (generated)
- `categories` — slug, parent_id, name_*, hall (painting|sculpture|photography|architecture|poetry|craft)
- `themes` — slug, name_*
- `artwork_categories`, `artwork_themes` — join tables
- `collections` — slug, curator_id, title_*, description_*, cover_image_path
- `collection_artworks` — ordered join
- `exhibitions` — slug, hall, title_*, starts_at, ends_at, hero_image_path, description_*
- `exhibition_artworks` — ordered join
- `events` — slug, title_*, starts_at, location, description_*
- `profiles` — id (auth.users), display_name, avatar_path
- `user_roles` — (user_id, role enum: visitor|artist|curator|admin), with `has_role()` SECURITY DEFINER fn (per project rules)

Indexes:
- `artworks(search_tsv) GIN`, `artworks(is_published, created_at DESC)`, `artworks(artist_id)`
- `artists(is_published, display_name)`, slug uniques everywhere
- Trigram indexes on `display_name`, `title_en/fr/fa` for fuzzy search

Storage buckets (created via tool, not SQL):
- `artwork-media` (public) — `artworks/{id}/{original|thumb|medium|large}.{webp|avif}`
- `artist-media` (public) — profile photos
- `exhibition-media` (public)

RLS:
- Public can `SELECT` only where `is_published = true`
- `artist` role can insert/update their own rows
- `curator` can manage exhibitions/collections
- `admin` full access

## Phase 2 — Routes + i18n URLs (frontend shell)

Add FR to `src/lib/i18n.tsx`. Localized URL prefix `/$lang` (`en`, `fr`, `fa`), with browser-detect default redirect from `/`.

Route tree (TanStack file-based, under `src/routes/`):
```
$lang/
  index.tsx                  Floor 1 — Grand Entrance
  halls.index.tsx            Floor 2 — Halls index
  halls.$hall.tsx            Hall page (painting | sculpture | …)
  artists.index.tsx          Floor 3 — Artist directory (cursor-paginated)
  artists.$slug.tsx          Artist profile
  artworks.index.tsx         Floor 4 — Artwork browse (filters + infinite scroll)
  artworks.$slug.tsx         Artwork detail
  collections.$slug.tsx
  exhibitions.$slug.tsx
  events.index.tsx
  search.tsx                 Amazon-style discovery
_authenticated/
  studio.index.tsx           Artist dashboard
  studio.artworks.tsx        Upload + manage
  curator.index.tsx          Curator dashboard
  admin.index.tsx            Admin dashboard
```

Sitewide `Header` gets: language switcher (EN/FR/FA), global search bar, hall mega-menu.

## Phase 3 — Performance + media delivery

- Image component `<MuseumImage>` — responsive `srcset` across `thumb/medium/large`, AVIF→WebP fallback, lazy by default, `fetchpriority="high"` only for hero/LCP
- Upload pipeline: client → Supabase Storage `original`, server fn (`sharp` is Node-only and not Worker-safe → use Cloudinary upload preset OR generate variants client-side with `browser-image-compression` before upload). Plan goes with **Cloudinary upload preset** for derivatives + signed URLs (no Vercel egress for media).
- Video: `<VideoEmbed provider="vimeo|youtube|cloudinary" id=… />` with lazy iframe (poster-only until click)
- Lists: TanStack Query `useInfiniteQuery` + cursor pagination (keyset on `(created_at, id)`), `react-virtuoso` for virtualized grids
- Route-level `head()` per route for SEO; preload only the LCP image of the current route

## Phase 4 — Search + discovery

- Server fn `searchArtworks({ q, hall, category, theme, country, medium, cursor })` → uses `search_tsv` + trigram fallback
- Faceted filters: hall, category tree, themes, country, medium, year range
- `/search` page with debounced query, URL-synced filters, infinite results
- Schema.org JSON-LD per artwork (`VisualArtwork`), artist (`Person`), exhibition (`ExhibitionEvent`)
- Dynamic `sitemap.xml` server route enumerates published artists/artworks/exhibitions; `robots.txt` updated

## Phase 5 — Roles + studio

- Email/password + Google sign-in (default per Cloud guidelines)
- Artist studio: upload artwork (drag-drop, multi-image), assign categories/themes, publish toggle
- Curator: build exhibitions/collections, drag-order artworks, feature artists on the entrance
- Admin: user management, role assignment, content moderation, analytics tiles (GA4 events), SEO settings (per-route meta overrides table)

## Out of scope (this plan)
- Stripe donations + memberships — separate plan once Phase 1–3 land
- Live email confirmations from `info@lumen.ca` — waits on `lumen.ca` DNS delegation
- MFA for admins — phase 5.5 polish
- Audit logs — phase 5.5 polish

## Technical notes
- We stay on **TanStack Start on Vercel**, not Next.js. The brief mentions "Next.js SSR" but the repo is TanStack Start; TanStack Start gives us SSR + server fns + file routing already. Migrating frameworks would discard the entire current shell and is not recommended.
- `sharp` cannot run in the Vercel Edge/Worker runtime that server fns target → image derivatives go through Cloudinary's upload preset (free tier) rather than a server-side `sharp` pipeline.
- Supabase Storage holds originals; Cloudinary fetches + transforms + serves derivatives via its CDN (covers WebP/AVIF + responsive delivery in one).
- All public-schema tables follow CREATE TABLE → GRANT → ALTER … ENABLE RLS → CREATE POLICY order, and `user_roles` uses the `has_role()` SECURITY DEFINER pattern.

## Approval requested
Phase 1 alone (migration + buckets + role system) is the foundation everything else depends on. With your OK I'll execute Phase 1 in the next turn and queue Phase 2 right after. Reply with which phases to ship now, or any changes (e.g. drop FR, swap Cloudinary for pure Supabase transforms, defer roles).
