create or replace function public.get_public_partner_profiles(partner_ids uuid[])
returns table (
  user_id uuid,
  organization_name text,
  email text,
  phone text
)
language sql
security definer
set search_path = public
as $$
  select
    partner_profiles.user_id,
    partner_profiles.organization_name,
    partner_profiles.email,
    partner_profiles.phone
  from public.partner_profiles
  where partner_profiles.user_id = any(partner_ids);
$$;

revoke all on function public.get_public_partner_profiles(uuid[]) from public;
grant execute on function public.get_public_partner_profiles(uuid[]) to anon;
grant execute on function public.get_public_partner_profiles(uuid[]) to authenticated;
