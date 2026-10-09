create table if not exists public.adoption_requests (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  partner_user_id uuid not null references public.partner_profiles (user_id) on delete cascade,
  requester_user_id uuid not null references auth.users (id) on delete cascade,
  requester_name text,
  requester_email text,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists adoption_requests_partner_status_idx
  on public.adoption_requests (partner_user_id, status, created_at desc);

create index if not exists adoption_requests_requester_idx
  on public.adoption_requests (requester_user_id, created_at desc);

create unique index if not exists adoption_requests_pending_unique_idx
  on public.adoption_requests (pet_id, requester_user_id)
  where status = 'pending';

drop trigger if exists set_adoption_requests_updated_at on public.adoption_requests;
create trigger set_adoption_requests_updated_at
before update on public.adoption_requests
for each row
execute function public.set_current_timestamp_updated_at();

alter table public.adoption_requests enable row level security;

drop policy if exists "Requesters can create adoption requests" on public.adoption_requests;
create policy "Requesters can create adoption requests"
on public.adoption_requests
for insert
to authenticated
with check (
  auth.uid() = requester_user_id
  and exists (
    select 1
    from public.pets
    where pets.id = pet_id
      and pets.partner_user_id = partner_user_id
      and pets.status = 'published'
  )
);

drop policy if exists "Requesters can view own adoption requests" on public.adoption_requests;
create policy "Requesters can view own adoption requests"
on public.adoption_requests
for select
to authenticated
using (auth.uid() = requester_user_id);

drop policy if exists "Partners can view incoming adoption requests" on public.adoption_requests;
create policy "Partners can view incoming adoption requests"
on public.adoption_requests
for select
to authenticated
using (auth.uid() = partner_user_id);

drop policy if exists "Partners can review incoming adoption requests" on public.adoption_requests;
create policy "Partners can review incoming adoption requests"
on public.adoption_requests
for update
to authenticated
using (auth.uid() = partner_user_id)
with check (auth.uid() = partner_user_id);
