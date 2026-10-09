create extension if not exists pgcrypto;

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_type text not null check (applicant_type in ('shelter', 'rescuer')),
  organization_name text not null,
  contact_person_name text not null,
  email text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  province_or_region text not null,
  notes text,
  review_notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  approved_auth_user_id uuid references auth.users (id) on delete set null,
  approval_email_sent_at timestamptz,
  approval_email_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists partner_applications_email_active_idx
  on public.partner_applications (lower(email))
  where status in ('pending', 'approved');

create table if not exists public.partner_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  application_id uuid not null unique references public.partner_applications (id) on delete cascade,
  applicant_type text not null check (applicant_type in ('shelter', 'rescuer')),
  organization_name text not null,
  contact_person_name text not null,
  email text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  province_or_region text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_partner_applications_updated_at on public.partner_applications;
create trigger set_partner_applications_updated_at
before update on public.partner_applications
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists set_partner_profiles_updated_at on public.partner_profiles;
create trigger set_partner_profiles_updated_at
before update on public.partner_profiles
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.partner_applications enable row level security;
alter table public.partner_profiles enable row level security;

create policy "Partner can view own profile"
on public.partner_profiles
for select
to authenticated
using (auth.uid() = user_id);
