/*
  # Fix blocked users policy error
  
  1. Changes
    - Replace complex DO blocks with simpler DROP POLICY IF EXISTS statements
    - Ensure policies are properly recreated with correct syntax
    - Fix potential search path issues
  
  2. Security
    - Maintain all existing security policies
    - Ensure proper row-level security
*/

-- Drop existing policies using the simpler syntax
DROP POLICY IF EXISTS "Admins can create blocked user records" ON public.blocked_users;
DROP POLICY IF EXISTS "Admins can delete blocked user records" ON public.blocked_users;
DROP POLICY IF EXISTS "Admins can update blocked user records" ON public.blocked_users;
DROP POLICY IF EXISTS "Admins can view all blocked users" ON public.blocked_users;

-- Recreate policies with correct syntax
CREATE POLICY "Admins can create blocked user records" 
  ON public.blocked_users
  FOR INSERT
  TO public
  WITH CHECK (blocked_by_telegram_id = 2138564172);

CREATE POLICY "Admins can delete blocked user records" 
  ON public.blocked_users
  FOR DELETE
  TO public
  USING (blocked_by_telegram_id = 2138564172);

CREATE POLICY "Admins can update blocked user records" 
  ON public.blocked_users
  FOR UPDATE
  TO public
  USING (blocked_by_telegram_id = 2138564172);

CREATE POLICY "Admins can view all blocked users" 
  ON public.blocked_users
  FOR SELECT
  TO public
  USING (blocked_by_telegram_id = 2138564172);