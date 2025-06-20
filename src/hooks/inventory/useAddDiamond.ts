import { useToast } from '@/components/ui/use-toast';
import { useTelegramAuth } from '@/context/TelegramAuthContext';
import { DiamondFormData } from '@/components/inventory/form/types';
import { supabase } from '@/integrations/supabase/client';

export function useAddDiamond(onSuccess?: () => void) {
  const { toast } = useToast();
  const { user } = useTelegramAuth();

  const addDiamond = async (data: DiamondFormData) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated",
      });
      return false;
    }

    try {
      const stockNumber = data.stockNumber || `D${Date.now().toString().slice(-6)}`;
      
      // Create a service role client for this operation
      const serviceClient = supabase.auth.admin;
      
      console.log('Adding diamond with stock number:', stockNumber, 'for user:', user.id);
      
      const inventoryData = {
        user_id: user.id,
        stock_number: stockNumber,
        shape: data.shape || 'round',
        weight: data.carat,
        color: data.color,
        clarity: data.clarity,
        cut: data.shape === 'Round' ? data.cut : null,
        polish: data.polish || 'Excellent',
        symmetry: data.symmetry || 'Excellent',
        price_per_carat: data.price ? Math.round(data.price / data.carat) : null,
        status: data.status || 'Available',
        picture: data.imageUrl || null,
        certificate_url: data.certificateUrl || null
      };

      // Use RPC function to bypass RLS
      const { data: result, error } = await supabase.rpc(
        'add_diamond_for_user',
        {
          p_user_id: user.id,
          p_stock_number: stockNumber,
          p_shape: data.shape || 'round',
          p_weight: data.carat,
          p_color: data.color,
          p_clarity: data.clarity,
          p_cut: data.shape === 'Round' ? data.cut : null,
          p_polish: data.polish || 'Excellent',
          p_symmetry: data.symmetry || 'Excellent',
          p_price_per_carat: data.price ? Math.round(data.price / data.carat) : null,
          p_status: data.status || 'Available',
          p_picture: data.imageUrl || null,
          p_certificate_url: data.certificateUrl || null
        }
      );

      // If RPC function doesn't exist yet, fall back to direct insert
      if (error && error.message.includes('function "add_diamond_for_user" does not exist')) {
        console.log('Falling back to direct insert');
        const { error: insertError } = await supabase
          .from('inventory')
          .insert([inventoryData]);
          
        if (insertError) throw insertError;
      } else if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Diamond added successfully",
      });
      
      if (onSuccess) {
        // Add a small delay to allow the user to see the success message
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
      return true;
    } catch (error) {
      console.error('Failed to add diamond:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add diamond. Please try again.",
      });
      return false;
    }
  };

  return { addDiamond };
}