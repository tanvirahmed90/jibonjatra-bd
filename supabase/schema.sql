-- =====================================================================
-- JibonJatra BD — Supabase database schema
-- Run this once in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Profiles (one per login). Role can NEVER be set to admin from the app.
-- Make someone admin manually:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  role text not null default 'donor' check (role in ('donor', 'ambulance', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Create a profile automatically when someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'role', 'donor');
begin
  insert into public.profiles (id, name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.email, ''),
    case when requested_role in ('donor', 'ambulance') then requested_role else 'donor' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Users may only change their name/phone — not their role
revoke update on public.profiles from authenticated, anon;
grant update (name, phone) on public.profiles to authenticated;

-- ---------------------------------------------------------------------
-- Blood donors (registered by the donors themselves → consent to be listed)
-- ---------------------------------------------------------------------
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  age int check (age is null or age between 18 and 65),
  division text,
  district text,
  area text,
  lat double precision,
  lng double precision,
  available boolean not null default true,
  last_donation_date date,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.donors enable row level security;
drop policy if exists "donors: public read" on public.donors;
create policy "donors: public read" on public.donors for select using (true);
drop policy if exists "donors: insert own" on public.donors;
create policy "donors: insert own" on public.donors for insert with check (user_id = auth.uid());
drop policy if exists "donors: update own or admin" on public.donors;
create policy "donors: update own or admin" on public.donors
  for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "donors: delete own or admin" on public.donors;
create policy "donors: delete own or admin" on public.donors
  for delete using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- Ambulances registered by drivers/providers (public sees VERIFIED only)
-- ---------------------------------------------------------------------
create table if not exists public.ambulances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique default auth.uid() references auth.users(id) on delete cascade,
  provider_name text not null default '',
  driver_name text not null default '',
  phone text not null,
  vehicle_type text not null default 'AC Ambulance',
  reg_number text not null default '',
  location_name text,
  lat double precision,
  lng double precision,
  status text not null default 'available' check (status in ('available', 'busy', 'offline')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ambulances enable row level security;
drop policy if exists "ambulances: read verified, own or admin" on public.ambulances;
create policy "ambulances: read verified, own or admin" on public.ambulances
  for select using (verified or user_id = auth.uid() or public.is_admin());
drop policy if exists "ambulances: insert own" on public.ambulances;
create policy "ambulances: insert own" on public.ambulances for insert with check (user_id = auth.uid());
drop policy if exists "ambulances: update own or admin" on public.ambulances;
create policy "ambulances: update own or admin" on public.ambulances
  for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "ambulances: delete own or admin" on public.ambulances;
create policy "ambulances: delete own or admin" on public.ambulances
  for delete using (user_id = auth.uid() or public.is_admin());

-- Only admins can set "verified"; everyone else's writes keep the old value
create or replace function public.protect_verified()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then
      new.verified := false;
    else
      new.verified := old.verified;
      new.user_id := old.user_id;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists donors_protect_verified on public.donors;
create trigger donors_protect_verified before insert or update on public.donors
  for each row execute function public.protect_verified();
drop trigger if exists ambulances_protect_verified on public.ambulances;
create trigger ambulances_protect_verified before insert or update on public.ambulances
  for each row execute function public.protect_verified();

-- ---------------------------------------------------------------------
-- Emergency requests (anyone can create; only admins can read/update)
-- ---------------------------------------------------------------------
create table if not exists public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  type text not null check (type in ('ambulance', 'blood', 'hospital', 'icu')),
  patient_name text,
  phone text,
  blood_group text,
  units_needed int,
  location_name text,
  lat double precision,
  lng double precision,
  status text not null default 'open' check (status in ('open', 'contacted', 'resolved', 'spam')),
  created_at timestamptz not null default now()
);

alter table public.emergency_requests enable row level security;
drop policy if exists "emergency: anyone can create" on public.emergency_requests;
create policy "emergency: anyone can create" on public.emergency_requests
  for insert with check (created_by is null or created_by = auth.uid());
drop policy if exists "emergency: read own or admin" on public.emergency_requests;
create policy "emergency: read own or admin" on public.emergency_requests
  for select using (created_by = auth.uid() or public.is_admin());
drop policy if exists "emergency: admin update" on public.emergency_requests;
create policy "emergency: admin update" on public.emergency_requests
  for update using (public.is_admin());

-- ---------------------------------------------------------------------
-- Hospital live status — ICU/NICU/emergency availability and verified phone,
-- entered by admins after confirming with the hospital. Public read.
-- hospital_id matches the "id" in public/data/hospitals.json
-- ---------------------------------------------------------------------
create table if not exists public.hospital_status (
  hospital_id text primary key,
  facilities jsonb not null default '{}'::jsonb,
  bed_stock jsonb,
  phone text,
  updated_by uuid default auth.uid() references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.hospital_status enable row level security;
drop policy if exists "hospital_status: public read" on public.hospital_status;
create policy "hospital_status: public read" on public.hospital_status for select using (true);
drop policy if exists "hospital_status: admin insert" on public.hospital_status;
create policy "hospital_status: admin insert" on public.hospital_status for insert with check (public.is_admin());
drop policy if exists "hospital_status: admin update" on public.hospital_status;
create policy "hospital_status: admin update" on public.hospital_status for update using (public.is_admin());
drop policy if exists "hospital_status: admin delete" on public.hospital_status;
create policy "hospital_status: admin delete" on public.hospital_status for delete using (public.is_admin());
