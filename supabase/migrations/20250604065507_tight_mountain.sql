/*
  # Enhance User Data Security and Fix Search Path
  
  1. New Tables
    - No new tables created
  
  2. Security
    - Fix search path security issue in get_user_statistics function
    - Enhance RLS policies for inventory table to ensure proper user data isolation
    - Add explicit user_id check in all inventory-related policies
  
  3. Changes
    - Update inventory table RLS policy to use telegram_id for proper user isolation
    - Add explicit schema references to prevent search path manipulation
    - Improve security by preventing privilege escalation
*/

-- Drop existing function with security issue
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

-- Drop existing inventory policy that might be too permissive
DROP POLICY IF EXISTS "Allow inventory access for authenticated users" ON public.inventory;

-- Create more secure policy that ensures users can only see their own data
CREATE POLICY "Users can only view their own inventory" 
ON public.inventory
FOR ALL
TO public
USING (user_id = auth.uid() OR user_id = (SELECT telegram_id FROM public.user_profiles WHERE telegram_id = current_setting('request.jwt.claims', true)::json->>'sub')::bigint);

-- Ensure diamonds table has proper RLS policy
DROP POLICY IF EXISTS "Users can view their own diamonds" ON public.diamonds;

-- Create more secure policy for diamonds table
CREATE POLICY "Users can only view their own diamonds" 
ON public.diamonds
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create insert policy for diamonds
CREATE POLICY "Users can insert their own diamonds" 
ON public.diamonds
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create update policy for diamonds
CREATE POLICY "Users can update their own diamonds" 
ON public.diamonds
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create delete policy for diamonds
CREATE POLICY "Users can delete their own diamonds" 
ON public.diamonds
FOR DELETE
TO authenticated
USING (user_id = auth.uid());