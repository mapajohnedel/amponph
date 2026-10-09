create table if not exists public.favorite_pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  pet_name_snapshot text not null,
  pet_image_snapshot text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, pet_id)
);

create index if not exists favorite_pets_user_created_idx
  on public.favorite_pets (user_id, created_at desc);

alter table public.favorite_pets enable row level security;

drop policy if exists "Users can view own favorites" on public.favorite_pets;
create policy "Users can view own favorites"
on public.favorite_pets
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can add own favorites" on public.favorite_pets;
create policy "Users can add own favorites"
on public.favorite_pets
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.pets
    where pets.id = pet_id
      and pets.status = 'published'
  )
);

drop policy if exists "Users can remove own favorites" on public.favorite_pets;
create policy "Users can remove own favorites"
on public.favorite_pets
for delete
to authenticated
using (auth.uid() = user_id);
