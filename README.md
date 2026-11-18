# Scoop & Smile

Next.js 16 ice-cream landing page with Supabase email/password authentication and a per-user saved favourite.

## Setup

1. Create a Supabase project. In **Authentication → Providers → Email**, enable Email. If **Confirm email** remains enabled, users must click the confirmation email before signing in.
2. Open **SQL Editor**, paste and run [`supabase/schema.sql`](./supabase/schema.sql). Its RLS policies allow each signed-in user to read and change only their own favourite.
3. Copy `.env.example` to `.env.local`. In **Project Settings → API**, add the Project URL and **publishable key**. Do not add a service-role key anywhere in this app.
4. Restart `npm run dev` after changing `.env.local`, then visit `http://localhost:3000`.

## Behaviour

- Register and login use Supabase Auth email/password.
- Browser sessions persist using Supabase client storage.
- Selecting a flavour while signed in upserts one private row in `favorite_ice_creams`.
- Guests can browse, but choosing a favourite takes them to login.

## Deployment

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your host's environment settings before building. If email confirmation is enabled, add the deployed site URL under Supabase **Authentication → URL Configuration → Redirect URLs**. Never set a service-role key in a browser-facing variable.
