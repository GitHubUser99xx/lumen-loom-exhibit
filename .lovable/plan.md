# Phase 2 — Auth + Roles + Dashboards

The DB schema (artists, artworks, categories, themes, collections, exhibitions, user_roles, has_role) and storage buckets already landed in Phase 1. This phase ships the auth layer and the three role-gated dashboards on top of it.

## What ships

### 1. Auth
- Email/password + Google sign-in (Lovable Cloud defaults), via the broker (`lovable.auth.signInWithOAuth("google", ...)`).
- `supabase--configure_social_auth` for Google in the same turn.
- `/auth` route: sign-in / sign-up tabs, redirect-back via `?redirect=`.
- Root-level `onAuthStateChange` listener already pattern-documented; wire it in `__root.tsx` (filter to SIGNED_IN/OUT/USER_UPDATED).
- Integration-managed `_authenticated/route.tsx` gate (ssr:false → redirect `/auth`).

### 2. Role-aware UX
- `useCurrentUser()` hook → `{ user, roles[] }` via a `getMe` serverFn (`requireSupabaseAuth` + `user_roles` select).
- Header shows "Sign in" or avatar menu → Studio / Curator / Admin / Sign out depending on roles.
- Nested pathless layouts gate the three dashboards by role using `has_role()` checked in serverFns (RLS already enforces writes; layouts just hide the UI early).

### 3. Artist Studio — `/_authenticated/studio`
- `studio.index.tsx` — "My artworks" grid (calls `listMyArtworks` serverFn, paginated).
- `studio.artworks.new.tsx` — create artwork: title (en/fa/fr), year, medium, description, category multi-select, theme multi-select, publish toggle, drag-drop image upload to `artwork-media` bucket via signed upload URL serverFn.
- `studio.artworks.$id.tsx` — edit + delete + manage images.
- `studio.profile.tsx` — artist profile (display_name, country, languages, bio, socials, profile image).
- ServerFns: `upsertArtist`, `listMyArtworks`, `upsertArtwork`, `deleteArtwork`, `getSignedUploadUrl(bucket, path)`, `attachArtworkImage`.

### 4. Curator — `/_authenticated/curator`
- `curator.index.tsx` — exhibitions + collections lists.
- `curator.exhibitions.new.tsx` / `$id.tsx` — title/description/hall/dates/hero image, drag-order artworks via `exhibition_artworks.position`.
- `curator.collections.$id.tsx` — same shape for collections.
- ServerFns: `upsertExhibition`, `setExhibitionArtworks(id, orderedIds)`, `upsertCollection`, `setCollectionArtworks`.

### 5. Admin — `/_authenticated/admin`
- `admin.index.tsx` — tiles: users, content moderation, analytics placeholder, SEO settings placeholder.
- `admin.users.tsx` — list profiles + their roles, grant/revoke role (`assignRole`, `revokeRole` serverFns guarded by `has_role(admin)`).
- `admin.moderation.tsx` — unpublish/publish any artwork/artist/exhibition.
- Analytics + SEO settings: stub pages with "coming in Phase 5.5" copy.

### 6. Plumbing
- `src/lib/auth.functions.ts` — `getMe`.
- `src/lib/studio.functions.ts`, `curator.functions.ts`, `admin.functions.ts` — all writes via `requireSupabaseAuth`; admin-only fns also assert `has_role(userId, 'admin')`. Service-role only when a job legitimately needs to bypass RLS (loaded inside handler via `await import`).
- `src/components/site/Header.tsx` — sign-in CTA + user menu.
- `src/lib/i18n.tsx` — small additions for auth/studio labels (EN/FA; FR deferred).

## Out of scope (this phase)
- French locale, `/$lang` URL prefix, route restructure (`halls.*`, `artists.*`, `artworks.*`, `exhibitions.*`) — that's the original Phase 2 (routes + i18n URLs). Pulling it in with auth + 3 dashboards in one turn = too large; ships next.
- Cloudinary derivatives — originals upload to Supabase Storage with signed URLs; image transforms are placeholder (`<img src=signedUrl>`) until the perf phase.
- Drag-order UX uses simple up/down buttons in this phase; `@dnd-kit` lands later.
- Email confirmation flow, Stripe, MFA, audit log.

## Approval
Reply "go" to ship as above. Reply with edits to narrow scope (e.g. "studio only, skip curator/admin for now" — recommended if you want a faster, more focused turn).
