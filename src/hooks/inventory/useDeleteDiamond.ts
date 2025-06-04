import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTelegramAuth } from '@/context/TelegramAuthContext';

export function useDeleteDiamond(onSuccess?: () => void) {
  const { toast } = useToast();
  const { user } = useTelegramAuth();

  const deleteDiamond = async (stockNumber: string) => {
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
      console.error('Invalid stock number for deletion:', stockNumber);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid stock number format",
      });
      return false;
    }

    try {
      console.log('Deleting diamond with stock number:', stockNumber, 'for user:', user.id);
      
      // Delete directly from Supabase
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('stock_number', stockNumber)
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(error.message);
      }
      
      toast({
        title: "Success",
        description: "Diamond deleted successfully",
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Failed to delete diamond:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete diamond. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return false;
    }
  };

  return { deleteDiamond };
}