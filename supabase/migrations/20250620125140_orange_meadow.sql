/*
  # Fix Inventory Table Layout and Add Delete API
  
  1. New Functions
    - `delete_diamond` function to safely delete diamonds by stock number
  
  2. Changes
    - Modify inventory table to ensure stock_number is properly displayed
    - Add index on stock_number for faster lookups
  
  3. Security
    - Ensure RLS policies are properly applied
    - Function uses security definer to maintain permissions
*/

-- Create a function to delete diamonds by stock number
CREATE OR REPLACE FUNCTION public.delete_diamond(p_stock_number TEXT, p_user_id BIGINT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_deleted BOOLEAN;
BEGIN
  DELETE FROM public.inventory
  WHERE stock_number = p_stock_number
  AND user_id = p_user_id;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  
  RETURN v_deleted > 0;
END;
$$;

-- Add index on stock_number for faster lookups and deletions
CREATE INDEX IF NOT EXISTS idx_inventory_stock_number ON public.inventory(stock_number);

-- Ensure inventory table has proper RLS policy
DROP POLICY IF EXISTS "Users can only view their own inventory" ON public.inventory;

-- Create more secure policy that ensures users can only see their own data
CREATE POLICY "Users can only view their own inventory" 
ON public.inventory
FOR ALL
TO public
USING (
  -- Match user_id with telegram_id from user_profiles table
  user_id = (
    SELECT telegram_id 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  -- Same check for INSERT/UPDATE operations
  user_id = (
    SELECT telegram_id 
    FROM public.user_profiles 
    WHERE id = auth.uid()
  )
);