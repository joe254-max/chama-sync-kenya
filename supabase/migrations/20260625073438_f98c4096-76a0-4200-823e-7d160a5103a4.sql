
-- 1) Restrict members SELECT: officers/admins see all; regular users only see their own row
DROP POLICY IF EXISTS "View members of accessible chamas" ON public.members;
CREATE POLICY "View members of accessible chamas"
ON public.members
FOR SELECT
TO authenticated
USING (
  public.is_super_admin(auth.uid())
  OR public.is_chama_officer(auth.uid(), chama_id)
  OR user_id = auth.uid()
);

-- 2) Notifications insert must target self
DROP POLICY IF EXISTS "Insert notifications" ON public.notifications;
CREATE POLICY "Insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3) Revoke direct EXECUTE on SECURITY DEFINER helpers from anon/authenticated/public.
--    These are invoked from RLS policies and triggers which run with definer rights regardless.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access_session(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_chama_officer(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.session_is_locked(uuid) FROM PUBLIC, anon, authenticated;
