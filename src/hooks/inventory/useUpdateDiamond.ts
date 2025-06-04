import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/context/TelegramAuthContext';
import { DiamondFormData } from '@/components/inventory/form/types';

export function useUpdateDiamond(onSuccess?: () => void) {
  const { toast } = useToast();
  const { user } = useTelegramAuth();

  const updateDiamond = async (stockNumber: string, data: DiamondFormData) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User not authenticated",
      });
      return false;
    }

    // Validate stock number format
    if (!stockNumber || stockNumber.trim() === '') {
      console.error('Invalid stock number format:', stockNumber);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid stock number format. Please refresh and try again.",
      });
      return false;
    }

    try {
      console.log('Updating diamond with stock number:', stockNumber, 'with data:', data);
      
      // Prepare update data with proper validation and type conversion
      const updateData = {
        stock_number: data.stockNumber?.toString() || stockNumber,
        shape: data.shape || 'Round',
        weight: Number(data.carat) || 1,
        color: data.color || 'G',
        clarity: data.clarity || 'VS1',
        cut: data.cut || 'Excellent',
        price_per_carat: data.carat > 0 ? Math.round(Number(data.price) / Number(data.carat)) : Math.round(Number(data.price)),
        status: data.status || 'Available',
        picture: data.imageUrl || null,
        updated_at: new Date().toISOString(),
      };

      console.log('Supabase update data:', updateData);

      const { data: updatedData, error } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('stock_number', stockNumber)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Update failed: ${error.message}`);
      }

      if (!updatedData) {
        throw new Error('Diamond not found or no changes were made');
      }

      console.log('Diamond updated successfully:', updatedData);
      
      toast({
        title: "Success",
        description: "Diamond updated successfully",
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Failed to update diamond:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update diamond. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return false;
    }
  };

  return { updateDiamond };
}