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

      console.log('Adding diamond with stock number:', stockNumber);
      
      const { error } = await supabase
        .from('inventory')
        .insert([inventoryData]);

      if (error) {
        throw new Error(error.message);
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
        description: "Failed to add diamond. Please try again.",
      });
      return false;
    }
  };

  return { addDiamond };
}