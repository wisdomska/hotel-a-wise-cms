-- =============================================================================
-- Hotel A-Wise — CLEAN INSTALL
--
-- Paste this whole file into Supabase SQL Editor and click Run.
-- It wipes any prior partial setup in the public schema, then creates
-- everything fresh. Safe to re-run.
--
-- DOES NOT touch auth.users — your accounts and existing sessions are preserved.
-- =============================================================================

-- 0. Wipe public-schema state ------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

drop policy if exists "Public read on media bucket"     on storage.objects;
drop policy if exists "Admins can manage media objects" on storage.objects;

drop table if exists public.inquiries      cascade;
drop table if exists public.media          cascade;
drop table if exists public.contact        cascade;
drop table if exists public.testimonials   cascade;
drop table if exists public.rooms          cascade;
drop table if exists public.amenities      cascade;
drop table if exists public.features       cascade;  -- prototype name
drop table if exists public.hero           cascade;
drop table if exists public.profiles       cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin()        cascade;

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Profiles -------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin', 'editor')),
  created_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are visible to their owner" on public.profiles for select using (auth.uid() = id);

create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', null))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Back-fill profiles for any pre-existing auth users
insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', null)
from auth.users
on conflict (id) do nothing;

-- is_admin helper ------------------------------------------------------------
create function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'));
$$;

-- Hero (singleton) -----------------------------------------------------------
create table public.hero (
  id                    text primary key default 'main',
  headline              text not null,
  subtext               text not null,
  cta_text              text not null,
  cta_link              text not null,
  background_image_url  text not null,
  updated_at            timestamptz not null default now()
);
insert into public.hero (id, headline, subtext, cta_text, cta_link, background_image_url) values (
  'main',
  'Your Gateway to Unforgettable Memories',
  'Experience exquisite accommodations, premium amenities and warm service tailored to exceed your expectations.',
  'View Rooms',
  '#rooms',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1920&q=80'
);
alter table public.hero enable row level security;
create policy "Hero is publicly readable" on public.hero for select using (true);
create policy "Hero is editable by admins" on public.hero for all using (public.is_admin()) with check (public.is_admin());

-- Amenities ------------------------------------------------------------------
create table public.amenities (
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
create policy "Published amenities are public"   on public.amenities for select using (status = 'published');
create policy "Amenities are editable by admins" on public.amenities for all using (public.is_admin()) with check (public.is_admin());

insert into public.amenities (name, type, display_order) values
  ('Luxurious Rooms',              'feature', 1),
  ('Customised Sheets',            'feature', 2),
  ('Conference Room',              'feature', 3),
  ('Porch for Outdoor Relaxation', 'feature', 4),
  ('Spacious Hallway',             'feature', 5),
  ('Premium Bathrooms',            'feature', 6),
  ('Compound for Events',          'feature', 7);

insert into public.amenities (name, type, description, image_url, display_order) values
  ('Breakfast',  'coming_soon',
   'A new all-day dining concept rooted in West African flavours.',
   'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80', 1),
  ('Summer Hut', 'coming_soon',
   'An open-air lounge for sundowners, cocktails and slow afternoons.',
   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 2);

-- Rooms ----------------------------------------------------------------------
create table public.rooms (
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
create policy "Published rooms are public"   on public.rooms for select using (status = 'published');
create policy "Rooms are editable by admins" on public.rooms for all using (public.is_admin()) with check (public.is_admin());

insert into public.rooms (name, slug, description, bed_summary, capacity, hero_image_url, display_order) values
  ('Royal Penthouse',     'royal-penthouse',
   'The pinnacle of our portfolio.',
   '3 King Beds', 6,
   'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80', 1),
  ('Presidential Suite',  'presidential-suite',
   'Quiet grandeur for the discerning traveller.',
   '2 King Beds', 4,
   'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80', 2);

-- Testimonials ---------------------------------------------------------------
create table public.testimonials (
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
create policy "Published testimonials are public"   on public.testimonials for select using (status = 'published');
create policy "Testimonials are editable by admins" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());

insert into public.testimonials (quote, author, location, rating, featured, display_order) values
  ('Our stay at Hotel A-Wise was nothing short of extraordinary. From the moment we arrived, we were greeted with warmth and professionalism. The room was impeccably clean, the bed incredibly comfortable, and the view from our window breathtaking.',
   'John and Mary P.', 'Achimota', 5, true, 1);

-- Contact (singleton) --------------------------------------------------------
create table public.contact (
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
create policy "Contact is publicly readable" on public.contact for select using (true);
create policy "Contact is editable by admins" on public.contact for all using (public.is_admin()) with check (public.is_admin());

insert into public.contact (id, phone, email, address, maps_link, copyright_text, footer_tagline) values (
  'main',
  '+233 (0) 540 120 400',
  'info@hotelawise.com',
  'No. 1 Wisepak Lane, New Asofan — Accra',
  'https://www.google.com/maps/search/?api=1&query=Hotel+A-Wise+Accra',
  'Hotel A-Wise | © 2025',
  'Affordable luxury, made in Accra.'
);

-- Media metadata -------------------------------------------------------------
create table public.media (
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
create policy "Media is publicly readable"  on public.media for select using (true);
create policy "Media is writable by admins" on public.media for all using (public.is_admin()) with check (public.is_admin());

-- Inquiries ------------------------------------------------------------------
create table public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  message       text not null,
  room_slug     text,
  source        text default 'website',
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);
alter table public.inquiries enable row level security;
create policy "Anyone can submit an inquiry"    on public.inquiries for insert with check (true);
create policy "Inquiries are visible to admins" on public.inquiries for select using (public.is_admin());

-- Storage bucket -------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

create policy "Public read on media bucket"
  on storage.objects for select using (bucket_id = 'media');

create policy "Admins can manage media objects"
  on storage.objects for all
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- =============================================================================
-- Done. Verify with:
--   select 'hero',         count(*) from public.hero
--   union all select 'amenities',    count(*) from public.amenities
--   union all select 'rooms',        count(*) from public.rooms
--   union all select 'testimonials', count(*) from public.testimonials
--   union all select 'contact',      count(*) from public.contact;
-- Expected: hero=1, amenities=9, rooms=2, testimonials=1, contact=1
-- =============================================================================
