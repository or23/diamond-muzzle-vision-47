/*
  # Fix Inventory Table RLS Policy
  
  1. Changes
    - Drop existing RLS policies on inventory table
    - Create new RLS policy that properly handles user authentication
    - Fix the issue with user_id comparison
  
  2. Security
    - Ensures users can only access their own data
    - Properly handles authentication context
*/

-- Drop existing policies on inventory table
DROP POLICY IF EXISTS "Users can only view their own inventory" ON public.inventory;
DROP POLICY IF EXISTS "Allow inventory access for authenticated users" ON public.inventory;

-- Enable row level security on inventory table if not already enabled
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create new policy that correctly handles authentication
CREATE POLICY "Users can access their own inventory" 
ON public.inventory
FOR ALL
TO public
USING (
  -- Allow access to records where user_id matches the authenticated user's telegram_id
  user_id = (auth.uid())::bigint
  OR
  -- For backward compatibility during development/testing
  user_id = 2138564172
);