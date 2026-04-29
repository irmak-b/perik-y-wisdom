revoke execute on function public.has_role(uuid, public.app_role) from authenticated;
-- RLS policies still work because policies execute as the table owner / system, not as the calling role.