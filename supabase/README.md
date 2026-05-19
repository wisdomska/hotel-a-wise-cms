# Supabase setup

1. Create your project on supabase.com (or use the existing one).
2. In **SQL Editor**, paste the contents of `schema.sql` and run it.
3. Go to **Authentication → Users → Add user** to create your admin account.
4. Copy your **Project URL** and **anon key** from **Settings → API**.
5. Paste them into:
   - The CMS's `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Vercel's environment variables for both projects

The schema seeds default content matching the prototype, so the public site
renders correctly immediately. Edit content from the CMS to override.
