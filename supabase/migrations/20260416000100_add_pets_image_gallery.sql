alter table public.pets
add column if not exists image_urls text[] not null default '{}'::text[];

update public.pets
set image_urls = case
  when coalesce(array_length(image_urls, 1), 0) > 0 then image_urls
  when image_url is not null then array[image_url]
  else '{}'::text[]
end;

alter table public.pets
drop constraint if exists pets_image_urls_limit;

alter table public.pets
add constraint pets_image_urls_limit
check (coalesce(array_length(image_urls, 1), 0) <= 3);
