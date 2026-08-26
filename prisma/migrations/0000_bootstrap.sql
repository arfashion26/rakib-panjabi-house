-- ============================================
-- BOOTSTRAP: Run this ONCE in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/diraphksavgifippktuh/sql/new
-- ============================================
--
-- This creates a helper RPC function that lets the Next.js app
-- execute SQL migrations remotely via the REST API.
-- After running this, the app can self-manage its database schema.
--
-- SECURITY: This function is marked SECURITY DEFINER and only allows
-- execution with the service_role key (not anon). This means only
-- the backend (server) can call it, never the public.
-- ============================================

CREATE OR REPLACE FUNCTION public.exec_sql(sql_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Only allow service_role to call this function
  -- (RLS / auth.role() check)
  IF auth.role() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: service role required';
  END IF;

  -- Execute the SQL and capture the result
  BEGIN
    EXECUTE sql_text;
    result := jsonb_build_object('success', true, 'message', 'SQL executed');
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_build_object('success', false, 'error', SQLERRM, 'detail', SQLSTATE);
  END;

  RETURN result;
END;
$$;

-- Restrict execution to service_role only
REVOKE EXECUTE ON FUNCTION public.exec_sql(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO service_role;

-- ============================================
-- DONE. After running this, you can run:
--   bun run scripts/run-migration.ts
-- to apply the full database schema automatically.
-- ============================================
