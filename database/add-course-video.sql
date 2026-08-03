-- Run this once in the Supabase SQL editor for existing installations.
alter table public.courses
  add column if not exists video_url text;
