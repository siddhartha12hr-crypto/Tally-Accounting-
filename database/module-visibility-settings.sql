-- Run this once in the Supabase SQL editor for existing installations.
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

create policy "Public can read app settings" on public.app_settings for select using (true);
create policy "Anon full access app settings" on public.app_settings for all using (true) with check (true);

insert into public.app_settings (key, value)
values ('module_visibility', '{"courses": true, "movies": true, "sports": true, "notes": true}'::jsonb)
on conflict (key) do nothing;
