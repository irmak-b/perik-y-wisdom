-- Lock down internal functions
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;
-- has_role is needed by RLS policies; keep authenticated execute, revoke from anon
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;

-- Ensure search_path is set on touch_updated_at (was missing)
create or replace function public.touch_updated_at()
returns trigger language plpgsql
security definer set search_path = public
as $$
begin new.updated_at = now(); return new; end;
$$;
revoke execute on function public.touch_updated_at() from public, anon, authenticated;