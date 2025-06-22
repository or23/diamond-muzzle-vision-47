import { useToast } from '@/components/ui/use-toast';
import { useTelegramAuth } from '@/context/TelegramAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { api, apiEndpoints } from '@/lib/api';

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
      
      // Show deletion in progress toast
      const pendingToast = toast({
        title: "Deleting...",
        description: `Removing diamond ${stockNumber} from inventory`,
      });
      
      // First try to delete from FastAPI backend
      let fastApiSuccess = false;
      try {
        // FIXED: Use the correct endpoint for deleting diamonds
        const response = await fetch(`https://api.mazalbot.com/api/v1/delete_diamond?diamond_id=${stockNumber}&user_id=${user.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ifj9ov1rh20fslfp',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          console.log('Successfully deleted from FastAPI backend');
          fastApiSuccess = true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn('FastAPI delete warning:', response.status, response.statusText, errorData);
          // Continue with Supabase delete even if FastAPI fails
        }
      } catch (apiError) {
        console.warn('FastAPI delete error:', apiError);
        // Continue with Supabase delete even if FastAPI fails
      }
      
      // Then try to use the RPC function
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        'delete_diamond',
        {
          p_stock_number: stockNumber,
          p_user_id: user.id
        }
      );

      // If RPC function doesn't exist or fails, fall back to direct delete
      if (rpcError && rpcError.message.includes('function "delete_diamond" does not exist')) {
        console.log('Falling back to direct delete');
        const { error } = await supabase
          .from('inventory')
          .delete()
          .eq('stock_number', stockNumber)
          .eq('user_id', user.id);

        if (error) {
          console.error('Supabase delete error:', error);
          throw new Error(error.message);
        }
      } else if (rpcError) {
        throw rpcError;
      }
      
      // Dismiss the pending toast
      pendingToast.dismiss();
      
      // Show success toast
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