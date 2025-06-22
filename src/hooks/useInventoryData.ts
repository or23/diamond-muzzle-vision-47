import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api, apiEndpoints } from "@/lib/api";
import { convertDiamondsToInventoryFormat } from "@/services/diamondAnalytics";
import { Diamond } from "@/components/inventory/InventoryTable";
import { useTelegramAuth } from "@/context/TelegramAuthContext";

export function useInventoryData() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useTelegramAuth();
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [allDiamonds, setAllDiamonds] = useState<Diamond[]>([]);
  
  const fetchData = async () => {
    if (!isAuthenticated || !user?.id) {
      console.log('User not authenticated, skipping data fetch');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching inventory data from FastAPI for user:', user.id);
      
      // Add detailed logging for debugging
      console.log('API endpoint:', apiEndpoints.getAllStones(user.id));
      console.log('Full URL:', `https://api.mazalbot.com/api/v1${apiEndpoints.getAllStones(user.id)}`);
      
      // Make a direct fetch call with detailed logging
      const directResponse = await fetch(`https://api.mazalbot.com/api/v1/get_all_stones?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ifj9ov1rh20fslfp',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Direct fetch response status:', directResponse.status);
      console.log('Direct fetch response headers:', Object.fromEntries(directResponse.headers.entries()));
      
      let responseData;
      try {
        responseData = await directResponse.json();
        console.log('Direct fetch response data type:', typeof responseData);
        console.log('Direct fetch response data length:', Array.isArray(responseData) ? responseData.length : 'not an array');
        console.log('Direct fetch response data sample:', JSON.stringify(responseData).substring(0, 200) + '...');
      } catch (jsonError) {
        const textResponse = await directResponse.text();
        console.error('Failed to parse JSON response:', jsonError);
        console.log('Raw response text:', textResponse.substring(0, 500) + '...');
        throw new Error('Invalid JSON response from API');
      }
      
      if (directResponse.ok && responseData) {
        console.log('Received diamonds from direct fetch:', responseData.length, 'total diamonds');
        
        // Convert backend data to frontend format with authenticated user filtering
        const convertedDiamonds = convertDiamondsToInventoryFormat(responseData, user.id);
        console.log('Converted diamonds for display:', convertedDiamonds.length, 'diamonds for user', user.id);
        
        setAllDiamonds(convertedDiamonds);
        setDiamonds(convertedDiamonds);
        
        // Show smaller, auto-dismissing toast
        if (convertedDiamonds.length > 0) {
          const toastInstance = toast({
            title: `${convertedDiamonds.length} diamonds`,
            description: "Inventory loaded",
          });
          
          setTimeout(() => {
            toastInstance.dismiss();
          }, 3000);
        }
      } else {
        console.warn('Direct fetch failed or returned no data:', directResponse.status);
        throw new Error(`API returned status ${directResponse.status}`);
      }
    } catch (error) {
      console.warn("Inventory fetch failed, using fallback:", error);
      
      // Use fallback data instead of showing error
      setAllDiamonds([]);
      setDiamonds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (isAuthenticated && user?.id) {
      console.log('Manually refreshing inventory data for user:', user.id);
      fetchData();
    }
  };

  // Only fetch data when authentication is complete and user is authenticated
  // Add delay to prevent simultaneous API calls
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      const timer = setTimeout(() => {
        fetchData();
      }, 2500); // Stagger after other hooks
      
      return () => clearTimeout(timer);
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, user?.id]);

  return {
    loading: loading || authLoading,
    diamonds,
    setDiamonds,
    allDiamonds,
    fetchData,
    handleRefresh,
  };
}