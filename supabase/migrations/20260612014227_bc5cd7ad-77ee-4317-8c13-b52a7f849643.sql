
-- =========================================================================
-- LUMEN Phase 1 — museum data model, roles, search, storage RLS
-- =========================================================================
create extension if not exists pg_trgm;

-- Roles ------------------------------------------------------------------
create type public.app_role as enum ('visitor','artist','curator','admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid());
create policy "admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- updated_at helper ------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- Profiles ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles public read" on public.profiles for select using (true);
create policy "profiles self insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles self update" on public.profiles for update to authenticated using (id = auth.uid());
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'visitor') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Categories + Themes ----------------------------------------------------
create type public.hall_kind as enum ('painting','sculpture','photography','architecture','poetry','craft');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  parent_id uuid references public.categories(id) on delete set null,
  hall public.hall_kind not null,
  name_en text not null, name_fr text, name_fa text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null, name_fr text, name_fa text,
  created_at timestamptz not null default now()
);
grant select on public.themes to anon, authenticated;
grant all on public.themes to service_role;
alter table public.themes enable row level security;
create policy "themes public read" on public.themes for select using (true);
create policy "themes admin write" on public.themes for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Artists ----------------------------------------------------------------
create table public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  slug text not null unique,
  display_name text not null,
  country text,
  languages text[] not null default '{}',
  bio_en text, bio_fr text, bio_fa text,
  profile_image_path text,
  socials jsonb not null default '{}'::jsonb,
  contact_email text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.artists to anon, authenticated;
grant insert, update, delete on public.artists to authenticated;
grant all on public.artists to service_role;
alter table public.artists enable row level security;
create index artists_published_idx on public.artists (is_published, display_name);
create index artists_name_trgm on public.artists using gin (display_name gin_trgm_ops);
create trigger artists_touch before update on public.artists for each row execute function public.touch_updated_at();
create policy "artists public read" on public.artists for select
  using (is_published or user_id = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'));
create policy "artists self insert" on public.artists for insert to authenticated
  with check (user_id = auth.uid() and public.has_role(auth.uid(),'artist'));
create policy "artists self update" on public.artists for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "artists admin delete" on public.artists for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

-- Artworks ---------------------------------------------------------------
create table public.artworks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  artist_id uuid not null references public.artists(id) on delete cascade,
  title_en text not null, title_fr text, title_fa text,
  description_en text, description_fr text, description_fa text,
  hall public.hall_kind not null,
  medium text,
  year int,
  tags text[] not null default '{}',
  image_paths jsonb not null default '{}'::jsonb,
  video_url text,
  video_provider text check (video_provider in ('cloudinary','vimeo','youtube') or video_provider is null),
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  search_tsv tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.artworks to anon, authenticated;
grant insert, update, delete on public.artworks to authenticated;
grant all on public.artworks to service_role;
alter table public.artworks enable row level security;
create index artworks_published_idx on public.artworks (is_published, created_at desc);
create index artworks_artist_idx on public.artworks (artist_id);
create index artworks_hall_idx on public.artworks (hall, is_published);
create index artworks_search_idx on public.artworks using gin (search_tsv);
create index artworks_title_trgm on public.artworks using gin (title_en gin_trgm_ops);
create trigger artworks_touch before update on public.artworks for each row execute function public.touch_updated_at();

create or replace function public.artworks_refresh_tsv()
returns trigger language plpgsql set search_path = public as $$
begin
  new.search_tsv :=
    setweight(to_tsvector('simple', coalesce(new.title_en,'') || ' ' || coalesce(new.title_fr,'') || ' ' || coalesce(new.title_fa,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.tags,' '),'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.description_en,'') || ' ' || coalesce(new.description_fr,'') || ' ' || coalesce(new.description_fa,'')), 'C');
  return new;
end $$;
create trigger artworks_tsv_trg before insert or update on public.artworks
  for each row execute function public.artworks_refresh_tsv();

create policy "artworks public read" on public.artworks for select
  using (is_published or created_by = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'));
create policy "artworks artist insert" on public.artworks for insert to authenticated
  with check (created_by = auth.uid()
    and exists (select 1 from public.artists a where a.id = artist_id and a.user_id = auth.uid()));
create policy "artworks artist update" on public.artworks for update to authenticated
  using (created_by = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'));
create policy "artworks owner delete" on public.artworks for delete to authenticated
  using (created_by = auth.uid() or public.has_role(auth.uid(),'admin'));

-- Joins ------------------------------------------------------------------
create table public.artwork_categories (
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (artwork_id, category_id)
);
grant select on public.artwork_categories to anon, authenticated;
grant insert, delete on public.artwork_categories to authenticated;
grant all on public.artwork_categories to service_role;
alter table public.artwork_categories enable row level security;
create policy "ac public read" on public.artwork_categories for select using (true);
create policy "ac owner write" on public.artwork_categories for all to authenticated
  using (exists (select 1 from public.artworks w where w.id = artwork_id
    and (w.created_by = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'))))
  with check (exists (select 1 from public.artworks w where w.id = artwork_id
    and (w.created_by = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'))));

create table public.artwork_themes (
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  theme_id uuid not null references public.themes(id) on delete cascade,
  primary key (artwork_id, theme_id)
);
grant select on public.artwork_themes to anon, authenticated;
grant insert, delete on public.artwork_themes to authenticated;
grant all on public.artwork_themes to service_role;
alter table public.artwork_themes enable row level security;
create policy "at public read" on public.artwork_themes for select using (true);
create policy "at owner write" on public.artwork_themes for all to authenticated
  using (exists (select 1 from public.artworks w where w.id = artwork_id
    and (w.created_by = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'))))
  with check (exists (select 1 from public.artworks w where w.id = artwork_id
    and (w.created_by = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'))));

-- Collections ------------------------------------------------------------
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  curator_id uuid references auth.users(id) on delete set null,
  title_en text not null, title_fr text, title_fa text,
  description_en text, description_fr text, description_fa text,
  cover_image_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.collections to anon, authenticated;
grant insert, update, delete on public.collections to authenticated;
grant all on public.collections to service_role;
alter table public.collections enable row level security;
create trigger collections_touch before update on public.collections for each row execute function public.touch_updated_at();
create policy "collections public read" on public.collections for select
  using (is_published or curator_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "collections curator write" on public.collections for all to authenticated
  using (curator_id = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'))
  with check (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'));

create table public.collection_artworks (
  collection_id uuid not null references public.collections(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  position int not null default 0,
  primary key (collection_id, artwork_id)
);
grant select on public.collection_artworks to anon, authenticated;
grant insert, update, delete on public.collection_artworks to authenticated;
grant all on public.collection_artworks to service_role;
alter table public.collection_artworks enable row level security;
create policy "ca public read" on public.collection_artworks for select using (true);
create policy "ca curator write" on public.collection_artworks for all to authenticated
  using (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'));

-- Exhibitions ------------------------------------------------------------
create table public.exhibitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  hall public.hall_kind not null,
  curator_id uuid references auth.users(id) on delete set null,
  title_en text not null, title_fr text, title_fa text,
  description_en text, description_fr text, description_fa text,
  hero_image_path text,
  starts_at timestamptz, ends_at timestamptz,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.exhibitions to anon, authenticated;
grant insert, update, delete on public.exhibitions to authenticated;
grant all on public.exhibitions to service_role;
alter table public.exhibitions enable row level security;
create index exhibitions_hall_idx on public.exhibitions (hall, is_published);
create trigger exhibitions_touch before update on public.exhibitions for each row execute function public.touch_updated_at();
create policy "exhibitions public read" on public.exhibitions for select
  using (is_published or curator_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "exhibitions curator write" on public.exhibitions for all to authenticated
  using (curator_id = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'))
  with check (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'));

create table public.exhibition_artworks (
  exhibition_id uuid not null references public.exhibitions(id) on delete cascade,
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  position int not null default 0,
  primary key (exhibition_id, artwork_id)
);
grant select on public.exhibition_artworks to anon, authenticated;
grant insert, update, delete on public.exhibition_artworks to authenticated;
grant all on public.exhibition_artworks to service_role;
alter table public.exhibition_artworks enable row level security;
create policy "ea public read" on public.exhibition_artworks for select using (true);
create policy "ea curator write" on public.exhibition_artworks for all to authenticated
  using (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'));

-- Events -----------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null, title_fr text, title_fa text,
  description_en text, description_fr text, description_fa text,
  starts_at timestamptz not null, ends_at timestamptz,
  location text, hero_image_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create trigger events_touch before update on public.events for each row execute function public.touch_updated_at();
create policy "events public read" on public.events for select
  using (is_published or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator'));
create policy "events curator write" on public.events for all to authenticated
  using (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'curator') or public.has_role(auth.uid(),'admin'));

-- Storage RLS ------------------------------------------------------------
create policy "museum public read" on storage.objects for select
  using (bucket_id in ('artwork-media','artist-media','exhibition-media'));
create policy "museum auth upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('artwork-media','artist-media','exhibition-media'));
create policy "museum owner update" on storage.objects for update to authenticated
  using (bucket_id in ('artwork-media','artist-media','exhibition-media')
    and (owner = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator')));
create policy "museum owner delete" on storage.objects for delete to authenticated
  using (bucket_id in ('artwork-media','artist-media','exhibition-media')
    and (owner = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'curator')));
