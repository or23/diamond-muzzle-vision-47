-- Create a function to delete diamonds by stock number
CREATE OR REPLACE FUNCTION public.delete_diamond_by_stock(p_stock_number TEXT, p_user_id BIGINT)
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

-- Create storage buckets for diamond images and certificates
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('diamond-images', 'diamond-images', true),
  ('diamond-certificates', 'diamond-certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for authenticated users
CREATE POLICY "Allow public read access to diamond images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'diamond-images');

CREATE POLICY "Allow authenticated users to upload diamond images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'diamond-images');

CREATE POLICY "Allow public read access to diamond certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'diamond-certificates');

CREATE POLICY "Allow authenticated users to upload diamond certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'diamond-certificates');

-- Add polish and symmetry columns to inventory if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'inventory' 
                AND column_name = 'certificate_url') THEN
    ALTER TABLE public.inventory ADD COLUMN certificate_url TEXT;
  END IF;
END $$;