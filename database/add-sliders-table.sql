-- ============================================================
-- Tally Accounting Hub Pro — Home Sliders Table
-- Run this in Supabase SQL Editor to create the sliders table.
-- ============================================================

-- ── Sliders (home page hero carousel) ───────────────────────
create table if not exists public.sliders (
  id          uuid primary key default uuid_generate_v4(),
  image       text not null,
  title       text,
  subtitle    text,
  button_text text,
  button_link text,
  has_button  boolean not null default false,
  is_active   boolean not null default true,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Updated_at trigger
create trigger sliders_updated_at before update on public.sliders
  for each row execute procedure public.set_updated_at();

-- Row Level Security
alter table public.sliders enable row level security;

-- Public read for active slides only
create policy "Public can read sliders" on public.sliders
  for select using (is_active = true);

-- Admin (anon) full access
create policy "Anon full access sliders" on public.sliders
  for all using (true) with check (true);
