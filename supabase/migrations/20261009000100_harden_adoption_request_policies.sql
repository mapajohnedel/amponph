-- Harden RLS on public.adoption_requests.
--
-- 1. The original insert policy compared `pets.partner_user_id = partner_user_id`
--    inside the EXISTS subquery, where both sides resolve to pets (a tautology),
--    so a requester could attach any partner_user_id. It also left status and the
--    review columns unconstrained, allowing an already-'approved' insert via
--    PostgREST. The policy is recreated with fully qualified column references,
--    status = 'pending' and empty review columns.
-- 2. requester_email was client-supplied and could be spoofed. A BEFORE INSERT
--    trigger now overwrites it with the requester's auth.users email.
-- 3. The partner update policy allowed changing any column. A BEFORE UPDATE
--    trigger now restricts non-service roles to status, review_note, reviewed_by
--    and reviewed_at, and only allows status changes from 'pending'. Service role
--    and direct database sessions (no JWT, e.g. migrations) are not restricted.

drop policy if exists "Requesters can create adoption requests" on public.adoption_requests;
create policy "Requesters can create adoption requests"
on public.adoption_requests
for insert
to authenticated
with check (
  auth.uid() = adoption_requests.requester_user_id
  and adoption_requests.status = 'pending'
  and adoption_requests.reviewed_by is null
  and adoption_requests.reviewed_at is null
  and adoption_requests.review_note is null
  and exists (
    select 1
    from public.pets
    where pets.id = adoption_requests.pet_id
      and pets.partner_user_id = adoption_requests.partner_user_id
      and pets.status = 'published'
  )
);

create or replace function public.set_adoption_request_requester_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.requester_email = (
    select users.email
    from auth.users
    where users.id = new.requester_user_id
  );
  return new;
end;
$$;

revoke all on function public.set_adoption_request_requester_email() from public;
revoke all on function public.set_adoption_request_requester_email() from anon, authenticated;

drop trigger if exists set_adoption_request_requester_email on public.adoption_requests;
create trigger set_adoption_request_requester_email
before insert on public.adoption_requests
for each row
execute function public.set_adoption_request_requester_email();

create or replace function public.enforce_adoption_request_update_rules()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  jwt_role text;
begin
  jwt_role = coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    nullif(current_setting('request.jwt.claim.role', true), '')
  );

  if jwt_role = 'service_role' then
    return new;
  end if;

  if jwt_role is null and current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if new.id is distinct from old.id
    or new.pet_id is distinct from old.pet_id
    or new.partner_user_id is distinct from old.partner_user_id
    or new.requester_user_id is distinct from old.requester_user_id
    or new.requester_name is distinct from old.requester_name
    or new.requester_email is distinct from old.requester_email
    or new.message is distinct from old.message
    or new.created_at is distinct from old.created_at then
    raise exception 'Only status and review fields can be updated on adoption requests'
      using errcode = '42501';
  end if;

  if new.status is distinct from old.status and old.status <> 'pending' then
    raise exception 'Only pending adoption requests can change status'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_adoption_request_update_rules() from public;
revoke all on function public.enforce_adoption_request_update_rules() from anon, authenticated;

drop trigger if exists enforce_adoption_request_update_rules on public.adoption_requests;
create trigger enforce_adoption_request_update_rules
before update on public.adoption_requests
for each row
execute function public.enforce_adoption_request_update_rules();
