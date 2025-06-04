/*
  # Fix search path security issue in get_user_statistics function
  
  1. Changes
    - Set fixed search path for get_user_statistics function
    - Add explicit schema references
    - Improve security by preventing search path manipulation
  
  2. Security
    - Removes mutable search path vulnerability
    - Ensures consistent schema resolution
    - Prevents potential privilege escalation
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.get_user_statistics();

-- Recreate function with fixed search path
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE (
  total_users bigint,
  active_users bigint,
  premium_users bigint,
  blocked_users bigint,
  users_with_phone bigint,
  recent_signups bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- Empty search path for security
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.user_profiles)::bigint as total_users,
    (SELECT COUNT(*) FROM public.user_profiles WHERE last_active > NOW() - INTERVAL '7 days')::bigint as active_users,
    (SELECT COUNT(*) FROM public.user_profiles WHERE is_premium = true)::bigint as premium_users,
    (SELECT COUNT(*) FROM public.blocked_users)::bigint as blocked_users,
    (SELECT COUNT(*) FROM public.user_profiles WHERE phone_number IS NOT NULL)::bigint as users_with_phone,
    (SELECT COUNT(*) FROM public.user_profiles WHERE created_at > NOW() - INTERVAL '30 days')::bigint as recent_signups;
END;
$$;