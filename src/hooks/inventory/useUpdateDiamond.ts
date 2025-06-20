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
        cut: data.shape === 'Round' ? (data.cut || 'Excellent') : null,
        polish: data.polish || 'Excellent',
        symmetry: data.symmetry || 'Excellent',
        price_per_carat: data.carat > 0 ? Math.round(Number(data.price) / Number(data.carat)) : Math.round(Number(data.price)),
        status: data.status || 'Available',
        picture: data.imageUrl || null,
        certificate_url: data.certificateUrl || null,
        updated_at: new Date().toISOString(),
      };

      console.log('Supabase update data:', updateData);

      // Try to use RPC function first
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        'update_diamond_for_user',
        {
          p_user_id: user.id,
          p_stock_number: stockNumber,
          p_update_data: updateData
        }
      );

      // If RPC function doesn't exist, fall back to direct update
      if (rpcError && rpcError.message.includes('function "update_diamond_for_user" does not exist')) {
        console.log('Falling back to direct update');
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
      } else if (rpcError) {
        throw rpcError;
      }

      console.log('Diamond updated successfully');
      
      toast({
        title: "Success",
        description: "Diamond updated successfully",
      });
      
      if (onSuccess) {
        // Add a small delay to allow the user to see the success message
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
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