-- Run in Supabase Dashboard → SQL Editor.
create table if not exists public.favorite_ice_creams (
  user_id uuid primary key references auth.users(id) on delete cascade,
  flavour text not null check (char_length(flavour) between 1 and 100),
  updated_at timestamptz not null default now()
);

alter table public.favorite_ice_creams enable row level security;

create policy "Users can read their own favourite" on public.favorite_ice_creams for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can create their own favourite" on public.favorite_ice_creams for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can update their own favourite" on public.favorite_ice_creams for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
