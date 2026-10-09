-- Atomically approve an adoption request: approve it, reject the other pending
-- requests for the same pet, and mark the pet as fostered. Runs as the caller so RLS applies.
create or replace function public.approve_adoption_request(request_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_pet_id uuid;
  target_request public.adoption_requests%rowtype;
  target_pet public.pets%rowtype;
begin
  select ar.pet_id
  into target_pet_id
  from public.adoption_requests ar
  where ar.id = request_id
    and ar.partner_user_id = auth.uid();

  if target_pet_id is null then
    raise exception 'Adoption request not found.' using errcode = 'P0002';
  end if;

  -- Lock the pet before the request so concurrent approvals for the same pet serialize
  -- on the pet row instead of deadlocking on each other's request rows.
  select *
  into target_pet
  from public.pets p
  where p.id = target_pet_id
    and p.partner_user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Pet not found for this adoption request.' using errcode = 'P0002';
  end if;

  select *
  into target_request
  from public.adoption_requests ar
  where ar.id = request_id
    and ar.partner_user_id = auth.uid()
  for update;

  if not found or target_request.pet_id <> target_pet_id then
    raise exception 'Adoption request not found.' using errcode = 'P0002';
  end if;

  if target_request.status <> 'pending' then
    raise exception 'Only pending adoption requests can be approved.' using errcode = 'AR409';
  end if;

  if target_pet.status <> 'published'
    or exists (
      select 1
      from public.adoption_requests ar
      where ar.pet_id = target_pet_id
        and ar.status = 'approved'
    ) then
    raise exception 'This pet is no longer available for adoption.' using errcode = 'AR410';
  end if;

  update public.adoption_requests
  set
    status = 'approved',
    reviewed_by = auth.uid(),
    reviewed_at = now()
  where id = request_id;

  update public.adoption_requests
  set
    status = 'rejected',
    review_note = 'Another adopter was approved for this pet.',
    reviewed_by = auth.uid(),
    reviewed_at = now()
  where pet_id = target_pet_id
    and partner_user_id = auth.uid()
    and status = 'pending'
    and id <> request_id;

  update public.pets
  set status = 'fostered'
  where id = target_pet_id
    and partner_user_id = auth.uid();
end;
$$;

revoke all on function public.approve_adoption_request(uuid) from public;
revoke all on function public.approve_adoption_request(uuid) from anon;
grant execute on function public.approve_adoption_request(uuid) to authenticated;
