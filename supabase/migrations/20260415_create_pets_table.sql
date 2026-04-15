create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  partner_user_id uuid not null references public.partner_profiles (user_id) on delete cascade,
  name text not null,
  breed text not null,
  age_years numeric(4, 1) not null check (age_years > 0),
  gender text not null check (gender in ('male', 'female')),
  size text not null check (size in ('small', 'medium', 'large')),
  location text not null,
  description text not null,
  image_url text,
  vaccinated boolean not null default false,
  neutered boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists pets_partner_user_id_idx
  on public.pets (partner_user_id);

create index if not exists pets_status_idx
  on public.pets (status);

create index if not exists pets_partner_user_id_status_idx
  on public.pets (partner_user_id, status);

drop trigger if exists set_pets_updated_at on public.pets;
create trigger set_pets_updated_at
before update on public.pets
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.pets enable row level security;

drop policy if exists "Published pets are viewable by everyone" on public.pets;
create policy "Published pets are viewable by everyone"
on public.pets
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Partners can view own pets" on public.pets;
create policy "Partners can view own pets"
on public.pets
for select
to authenticated
using (auth.uid() = partner_user_id);

drop policy if exists "Partners can insert own pets" on public.pets;
create policy "Partners can insert own pets"
on public.pets
for insert
to authenticated
with check (auth.uid() = partner_user_id);

drop policy if exists "Partners can update own pets" on public.pets;
create policy "Partners can update own pets"
on public.pets
for update
to authenticated
using (auth.uid() = partner_user_id)
with check (auth.uid() = partner_user_id);

drop policy if exists "Partners can delete own pets" on public.pets;
create policy "Partners can delete own pets"
on public.pets
for delete
to authenticated
using (auth.uid() = partner_user_id);
