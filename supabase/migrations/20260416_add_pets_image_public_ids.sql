alter table public.pets
add column if not exists image_public_ids text[] not null default '{}'::text[];

alter table public.pets
drop constraint if exists pets_image_public_ids_limit;

alter table public.pets
add constraint pets_image_public_ids_limit
check (coalesce(array_length(image_public_ids, 1), 0) <= 3);
