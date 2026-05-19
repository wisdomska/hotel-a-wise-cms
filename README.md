# Hotel A-Wise — CMS

Admin app for editing the Hotel A-Wise public site.

## Stack

- **Next.js 16** App Router on Vercel
- **Supabase** (Postgres + Auth + Storage) — `@supabase/ssr` for server-side auth cookies
- **Tailwind CSS v4** with a quiet, paper-and-ink admin design

## Local development

```bash
npm install
cp .env.example .env.local      # fill in Supabase URL, anon key, revalidation secret
npm run dev
```

Then create your admin user in the **Supabase dashboard** under
*Authentication → Users → Add user* and sign in at `/login`.

## How it talks to the public site

When you save a section in the CMS, the server action upserts the row in
Supabase and then POSTs to the public site's `/api/revalidate` endpoint with
a shared secret. The public site uses on-demand ISR to refetch fresh content.

```
CMS form → server action → Supabase upsert → revalidatePublicSite() → /api/revalidate → revalidatePath
```

## Routes

```
/login                — Sign in form (no auth required)
/                     — Overview dashboard
/hero                 — Edit the hero section (working)
/amenities            — Manage amenities (scaffolded)
/rooms                — Manage rooms (scaffolded)
/testimonials         — Manage reviews (scaffolded)
/contact              — Edit footer contact info (scaffolded)
/media                — Media library (scaffolded)
/settings             — Connection status + manual revalidation
```

The middleware in `src/middleware.ts` redirects unauthenticated users to
`/login` and signed-in users back to `/` when they hit `/login`.
