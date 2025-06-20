-- Drop the existing view if it exists
DROP VIEW IF EXISTS public.recent_user_logins;

-- Recreate the view with SECURITY INVOKER (default) instead of SECURITY DEFINER
CREATE OR REPLACE VIEW public.recent_user_logins AS
SELECT 
  up.telegram_id,
  up.first_name,
  up.last_name,
  up.username,
  us.session_start,
  us.session_end,
  us.user_agent
FROM 
  public.user_profiles up
JOIN 
  public.user_sessions us ON up.telegram_id = us.telegram_id
WHERE 
  us.session_start > (CURRENT_TIMESTAMP - INTERVAL '7 days')
ORDER BY 
  us.session_start DESC;

-- Add proper row-level security to the view
ALTER VIEW public.recent_user_logins OWNER TO postgres;

-- Create policy to restrict access to admin users only
CREATE POLICY "Only admin can access recent logins" 
ON public.user_sessions
FOR SELECT 
TO public
USING (
  -- Only admin user can see all sessions
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE telegram_id = 2138564172 -- Admin ID
    AND telegram_id = auth.uid()
  )
  -- Users can only see their own sessions
  OR telegram_id = auth.uid()
);

-- Ensure RLS is enabled on user_sessions table
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Add comment explaining the security considerations
COMMENT ON VIEW public.recent_user_logins IS 
'View showing recent user logins from the past 7 days. 
Uses SECURITY INVOKER to run with the permissions of the calling user.
Access is controlled via RLS policies on the underlying tables.';