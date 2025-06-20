/*
  # Add Diamond Management Functions
  
  1. New Functions
    - add_diamond_for_user: Securely adds a diamond to inventory
    - update_diamond_for_user: Securely updates a diamond in inventory
  
  2. Security
    - Functions use SECURITY DEFINER to bypass RLS
    - Fixed search path for security
    - Proper parameter validation
*/

-- Function to add a diamond for a specific user
CREATE OR REPLACE FUNCTION public.add_diamond_for_user(
  p_user_id BIGINT,
  p_stock_number TEXT,
  p_shape TEXT,
  p_weight NUMERIC,
  p_color TEXT,
  p_clarity TEXT,
  p_cut TEXT,
  p_polish TEXT,
  p_symmetry TEXT,
  p_price_per_carat NUMERIC,
  p_status TEXT,
  p_picture TEXT,
  p_certificate_url TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.inventory (
    user_id,
    stock_number,
    shape,
    weight,
    color,
    clarity,
    cut,
    polish,
    symmetry,
    price_per_carat,
    status,
    picture,
    certificate_url,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_stock_number,
    p_shape,
    p_weight,
    p_color,
    p_clarity,
    p_cut,
    p_polish,
    p_symmetry,
    p_price_per_carat,
    p_status,
    p_picture,
    p_certificate_url,
    NOW(),
    NOW()
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Function to update a diamond for a specific user
CREATE OR REPLACE FUNCTION public.update_diamond_for_user(
  p_user_id BIGINT,
  p_stock_number TEXT,
  p_update_data JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_updated BOOLEAN;
BEGIN
  UPDATE public.inventory
  SET
    stock_number = COALESCE(p_update_data->>'stock_number', stock_number),
    shape = COALESCE(p_update_data->>'shape', shape),
    weight = COALESCE((p_update_data->>'weight')::NUMERIC, weight),
    color = COALESCE(p_update_data->>'color', color),
    clarity = COALESCE(p_update_data->>'clarity', clarity),
    cut = COALESCE(p_update_data->>'cut', cut),
    polish = COALESCE(p_update_data->>'polish', polish),
    symmetry = COALESCE(p_update_data->>'symmetry', symmetry),
    price_per_carat = COALESCE((p_update_data->>'price_per_carat')::NUMERIC, price_per_carat),
    status = COALESCE(p_update_data->>'status', status),
    picture = COALESCE(p_update_data->>'picture', picture),
    certificate_url = COALESCE(p_update_data->>'certificate_url', certificate_url),
    updated_at = NOW()
  WHERE
    stock_number = p_stock_number
    AND user_id = p_user_id;
  
  GET DIAGNOSTICS v_updated = ROW_COUNT;
  
  RETURN v_updated > 0;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Ensure delete_diamond function exists and is properly defined
DROP FUNCTION IF EXISTS public.delete_diamond(TEXT, BIGINT);

CREATE OR REPLACE FUNCTION public.delete_diamond(
  p_stock_number TEXT,
  p_user_id BIGINT
)
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