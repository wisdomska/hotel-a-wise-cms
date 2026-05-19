-- =============================================================================
-- Hotel A-Wise — Supabase schema
--
-- Run this file once in your Supabase project's SQL editor.
-- It creates the content tables, RLS policies, an admin profile table, and
-- a Storage bucket for media uploads.
-- =============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Profiles  (mirror of auth.users for admin metadata)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin', 'editor')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are visible to their owner" on public.profiles;
create policy "Profiles are visible to their owner"
  on public.profiles for select
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Helper: is current user an admin?
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ----------------------------------------------------------------------------
-- Hero  (singleton — id is always 'main')
-- ----------------------------------------------------------------------------
create table if not exists public.hero (
  id                    text primary key default 'main',
  headline              text not null,
  subtext               text not null,
  cta_text              text not null,
  cta_link              text not null,
  background_image_url  text not null,
  updated_at            timestamptz not null default now()
);

insert into public.hero (id, headline, subtext, cta_text, cta_link, background_image_url)
values (
  'main',
  'Your Gateway to Unforgettable Memories',
  'Experience exquisite accommodations, premium amenities and warm service tailored to exceed your expectations.',
  'View Rooms',
  '#rooms',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1920&q=80'
) on conflict (id) do nothing;

alter table public.hero enable row level security;

drop policy if exists "Hero is publicly readable"     on public.hero;
drop policy if exists "Hero is editable by admins"    on public.hero;

create policy "Hero is publicly readable"
  on public.hero for select using (true);

create policy "Hero is editable by admins"
  on public.hero for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Amenities  (features + coming-soon)
-- ----------------------------------------------------------------------------
create table if not exists public.amenities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null check (type in ('feature', 'coming_soon')),
  description   text,
  image_url     text,
  display_order int  not null default 0,
  status        text not null default 'published' check (status in ('published', 'draft')),
  updated_at    timestamptz not null default now()
);

alter table public.amenities enable row level security;

drop policy if exists "Published amenities are public"      on public.amenities;
drop policy if exists "Amenities are editable by admins"    on public.amenities;

create policy "Published amenities are public"
  on public.amenities for select
  using (status = 'published');

create policy "Amenities are editable by admins"
  on public.amenities for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed amenities only if table is empty
insert into public.amenities (name, type, display_order)
select x.name, 'feature', x.ord from (values
  ('Luxurious Rooms', 1),
  ('Customised Sheets', 2),
  ('Conference Room', 3),
  ('Porch for Outdoor Relaxation', 4),
  ('Spacious Hallway', 5),
  ('Premium Bathrooms', 6),
  ('Compound for Events', 7)
) as x(name, ord)
where not exists (select 1 from public.amenities);

-- ----------------------------------------------------------------------------
-- Rooms
-- ----------------------------------------------------------------------------
create table if not exists public.rooms (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  description     text,
  bed_summary     text not null,
  capacity        int  not null,
  price_per_night numeric(10, 2),
  hero_image_url  text not null,
  gallery         text[] default '{}',
  display_order   int  not null default 0,
  status          text not null default 'published' check (status in ('published', 'draft')),
  updated_at      timestamptz not null default now()
);

alter table public.rooms enable row level security;
drop policy if exists "Published rooms are public" on public.rooms;
drop policy if exists "Rooms are editable by admins" on public.rooms;
create policy "Published rooms are public"
  on public.rooms for select using (status = 'published');
create policy "Rooms are editable by admins"
  on public.rooms for all using (public.is_admin()) with check (public.is_admin());

-- Seed rooms only if table is empty
insert into public.rooms (name, slug, description, bed_summary, capacity, hero_image_url, display_order)
select * from (values
  ('Royal Penthouse',     'royal-penthouse',     'The pinnacle of our portfolio.',  '3 King Beds', 6, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80', 1),
  ('Presidential Suite',  'presidential-suite',  'Quiet grandeur for the discerning traveller.', '2 King Beds', 4, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80', 2)
) as v(name, slug, description, bed_summary, capacity, hero_image_url, display_order)
where not exists (select 1 from public.rooms);

-- ----------------------------------------------------------------------------
-- Testimonials
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  quote         text not null,
  author        text not null,
  location      text,
  rating        int check (rating between 1 and 5),
  featured      boolean not null default false,
  display_order int not null default 0,
  status        text not null default 'published' check (status in ('published', 'draft')),
  updated_at    timestamptz not null default now()
);

alter table public.testimonials enable row level security;
drop policy if exists "Published testimonials are public" on public.testimonials;
drop policy if exists "Testimonials are editable by admins" on public.testimonials;
create policy "Published testimonials are public"
  on public.testimonials for select using (status = 'published');
create policy "Testimonials are editable by admins"
  on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

insert into public.testimonials (quote, author, location, rating, featured, display_order)
select * from (values
  (
    'Our stay at Hotel A-Wise was nothing short of extraordinary. From the moment we arrived, we were greeted with warmth and professionalism. The room was impeccably clean, the bed incredibly comfortable, and the view from our window breathtaking.',
    'John and Mary P.', 'Achimota', 5, true, 1
  )
) as v(quote, author, location, rating, featured, display_order)
where not exists (select 1 from public.testimonials);

-- ----------------------------------------------------------------------------
-- Contact / footer info
-- ----------------------------------------------------------------------------
create table if not exists public.contact (
  id              text primary key default 'main',
  phone           text not null,
  email           text not null,
  address         text not null,
  maps_link       text,
  copyright_text  text not null,
  footer_tagline  text,
  updated_at      timestamptz not null default now()
);

alter table public.contact enable row level security;
drop policy if exists "Contact is publicly readable" on public.contact;
drop policy if exists "Contact is editable by admins" on public.contact;
create policy "Contact is publicly readable"
  on public.contact for select using (true);
create policy "Contact is editable by admins"
  on public.contact for all using (public.is_admin()) with check (public.is_admin());

insert into public.contact (id, phone, email, address, maps_link, copyright_text, footer_tagline)
values (
  'main',
  '+233 (0) 540 120 400',
  'info@hotelawise.com',
  'No. 1 Wisepak Lane, New Asofan — Accra',
  'https://www.google.com/maps/search/?api=1&query=Hotel+A-Wise+Accra',
  'Hotel A-Wise | © 2025',
  'Affordable luxury, made in Accra.'
) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Media  (metadata only — files live in Storage)
-- ----------------------------------------------------------------------------
create table if not exists public.media (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null,
  filename      text not null,
  mime_type     text,
  width         int,
  height        int,
  alt           text,
  uploaded_by   uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);

alter table public.media enable row level security;
drop policy if exists "Media is publicly readable"  on public.media;
drop policy if exists "Media is writable by admins" on public.media;
create policy "Media is publicly readable"
  on public.media for select using (true);
create policy "Media is writable by admins"
  on public.media for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Storage bucket for media
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: anyone can read, admins can write
drop policy if exists "Public read on media bucket"      on storage.objects;
drop policy if exists "Admins can manage media objects"  on storage.objects;

create policy "Public read on media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Admins can manage media objects"
  on storage.objects for all
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- =============================================================================
-- Done. Verify by selecting from each table:
--   select count(*) from public.hero, public.amenities, public.rooms, public.testimonials, public.contact;
-- =============================================================================
