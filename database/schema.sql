-- =========================================================
-- ResumeIQ — Supabase Postgres Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =========================================================

-- Enable extension used for UUID generation
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- users: mirrors auth.users with app-specific profile fields
-- ---------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- reports: one row per resume analysis
-- ---------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  resume_name text not null,
  resume_url text not null,
  job_description text not null,
  ats_score int not null check (ats_score >= 0 and ats_score <= 100),
  keyword_match_pct int not null default 0,
  skill_match_pct int not null default 0,
  experience_match_pct int not null default 0,
  education_match_pct int not null default 0,
  matching_keywords jsonb not null default '[]'::jsonb,
  missing_keywords jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_id_idx on public.reports (user_id);
create index if not exists reports_created_at_idx on public.reports (created_at desc);

-- ---------------------------------------------------------
-- Row Level Security — users can only touch their own rows
-- ---------------------------------------------------------
alter table public.users enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

drop policy if exists "Users can view own reports" on public.reports;
create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own reports" on public.reports;
create policy "Users can insert own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own reports" on public.reports;
create policy "Users can delete own reports"
  on public.reports for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------
-- Storage bucket for resumes (create via SQL or dashboard)
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own resumes" on storage.objects;
create policy "Users can upload own resumes"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can read own resumes" on storage.objects;
create policy "Users can read own resumes"
  on storage.objects for select
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can delete own resumes" on storage.objects;
create policy "Users can delete own resumes"
  on storage.objects for delete
  using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
