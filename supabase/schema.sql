-- SiteForce India Phase 1 schema.
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.
-- This is a SEPARATE Supabase project from the UK SiteForce site — do not run
-- this against the UK project's database.

create extension if not exists "pgcrypto";

create table if not exists labourers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trade text not null,
  location text not null,
  experience_years integer not null default 0,
  day_rate integer not null default 0,
  availability text not null default 'Immediate',
  id_verified boolean not null default false,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  contact_email text not null,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists hire_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies (id) on delete cascade,
  labourer_id uuid references labourers (id) on delete cascade,
  status text not null default 'sent' check (status in ('sent', 'accepted', 'declined', 'completed')),
  created_at timestamptz not null default now()
);

-- Row Level Security -------------------------------------------------------
-- These policies are intentionally permissive for a Phase 1 demo: anyone can
-- read and insert labourer profiles, so the browse/hire flow works with no
-- login yet. BEFORE real launch, replace the insert/update policies with
-- ones scoped to an authenticated user (Supabase Auth) so a labourer can only
-- edit their own row, and a company can only see contact details after a
-- hire request is accepted. Do not ship this permissive version to production.

alter table labourers enable row level security;
alter table companies enable row level security;
alter table hire_requests enable row level security;

create policy "Anyone can read labourer profiles" on labourers
  for select using (true);

create policy "Anyone can create a labourer profile (demo only)" on labourers
  for insert with check (true);

create policy "Anyone can create a hire request (demo only)" on hire_requests
  for insert with check (true);

create policy "Anyone can read hire requests (demo only)" on hire_requests
  for select using (true);

-- companies table has no public select policy: contact details stay private
-- until real auth is added, by design.
