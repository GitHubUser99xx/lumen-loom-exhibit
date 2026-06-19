
-- 1) Artist contact_email: revoke column SELECT from anon so unauthenticated
-- visitors cannot read it. Authenticated users still see it as before.
REVOKE SELECT (contact_email) ON public.artists FROM anon;

-- 2) Profiles: restrict public read to authenticated users only.
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
CREATE POLICY "profiles authenticated read" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- 3) Storage uploads: require an artist/curator/admin role.
DROP POLICY IF EXISTS "museum auth upload" ON storage.objects;
CREATE POLICY "museum role upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = ANY (ARRAY['artwork-media','artist-media','exhibition-media'])
    AND (
      public.has_role(auth.uid(), 'artist'::app_role)
      OR public.has_role(auth.uid(), 'curator'::app_role)
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );

-- 4) Subscribers: explicit admin-only SELECT policy.
DROP POLICY IF EXISTS "subscribers admin read" ON public.subscribers;
CREATE POLICY "subscribers admin read" ON public.subscribers
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
