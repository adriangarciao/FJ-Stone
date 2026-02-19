-- =====================================================
-- Security Hardening Migration
-- Fixes three Supabase security linter warnings:
--
-- 1. function_search_path_mutable: touch_updated_at
--    Adds SET search_path = '' to prevent search_path injection.
--
-- 2. rls_policy_always_true: quote_requests INSERT policies
--    Replaces WITH CHECK (true) with a meaningful constraint.
--    Note: actual submissions use the service role (bypasses RLS),
--    so these policies are a defense-in-depth layer only.
--
-- 3. auth_leaked_password_protection: MANUAL STEP REQUIRED
--    Enable in Supabase Dashboard → Authentication → Password Settings
--    → "Enable HaveIBeenPwned protection". Cannot be set via SQL.
-- =====================================================


-- =====================================================
-- 1. Fix touch_updated_at: set fixed search_path
-- =====================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- =====================================================
-- 2. Fix quote_requests INSERT policies
--    Replace WITH CHECK (true) with a real constraint:
--    - status must be 'NEW' (the default; blocks status manipulation)
--    - notes must be NULL (admin-only field)
-- =====================================================
DROP POLICY IF EXISTS "Public can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Public can insert quote requests" ON public.quote_requests;

CREATE POLICY "Public can submit quote requests" ON public.quote_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'NEW'
    AND notes IS NULL
  );
