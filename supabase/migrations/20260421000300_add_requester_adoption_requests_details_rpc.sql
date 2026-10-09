create or replace function public.get_requester_adoption_requests_details()
returns table (
  id uuid,
  status text,
  created_at timestamptz,
  partner_user_id uuid,
  pet_name text,
  pet_image_url text
)
language sql
security definer
set search_path = public
as $$
  select
    adoption_requests.id,
    adoption_requests.status,
    adoption_requests.created_at,
    adoption_requests.partner_user_id,
    pets.name as pet_name,
    coalesce(pets.image_urls[1], pets.image_url) as pet_image_url
  from public.adoption_requests
  left join public.pets on pets.id = adoption_requests.pet_id
  where adoption_requests.requester_user_id = auth.uid()
  order by adoption_requests.created_at desc;
$$;

revoke all on function public.get_requester_adoption_requests_details() from public;
grant execute on function public.get_requester_adoption_requests_details() to authenticated;
