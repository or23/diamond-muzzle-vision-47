import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api, apiEndpoints } from "@/lib/api";
import { convertDiamondsToInventoryFormat } from "@/services/diamondAnalytics";
import { Diamond } from "@/components/inventory/InventoryTable";
import { useTelegramAuth } from "@/context/TelegramAuthContext";

export function useInventoryData() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useTelegramAuth();
  const [loading, setLoading] = useState(true); // Changed to true to show loading state
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
        
        // Try to parse the response as JSON with more lenient error handling
        try {
          if (textResponse.trim().startsWith('[') && textResponse.trim().endsWith(']')) {
            responseData = JSON.parse(textResponse);
            console.log('Successfully parsed JSON after initial failure');
          } else {
            throw new Error('Invalid JSON format');
          }
        } catch (e) {
          throw new Error('Invalid JSON response from API');
        }
      }
      
      if (directResponse.ok && responseData) {
        console.log('Received diamonds from direct fetch:', responseData.length, 'total diamonds');
        
        // FIXED: Ensure we're handling the response data correctly
        const diamondArray = Array.isArray(responseData) ? responseData : 
                            (responseData.data && Array.isArray(responseData.data)) ? responseData.data : 
                            [];
        
        // Convert backend data to frontend format with authenticated user filtering
        const convertedDiamonds = convertDiamondsToInventoryFormat(diamondArray, user.id);
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
      
      // FIXED: Try to load mock data instead of showing empty state
      try {
        const mockDiamonds = generateMockDiamonds(700); // Generate 700 mock diamonds
        console.log('Generated mock diamonds:', mockDiamonds.length);
        
        setAllDiamonds(mockDiamonds);
        setDiamonds(mockDiamonds);
        
        toast({
          title: "Using demo data",
          description: `Loaded ${mockDiamonds.length} sample diamonds`,
        });
      } catch (mockError) {
        console.error("Failed to generate mock data:", mockError);
        setAllDiamonds([]);
        setDiamonds([]);
      }
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

  // Generate mock diamonds for testing
  const generateMockDiamonds = (count: number): Diamond[] => {
    const shapes = ['Round', 'Princess', 'Cushion', 'Emerald', 'Oval', 'Radiant', 'Asscher', 'Marquise', 'Heart', 'Pear'];
    const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
    const cuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
    
    return Array.from({ length: count }, (_, i) => {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const carat = (0.5 + Math.random() * 4.5).toFixed(2);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const clarity = clarities[Math.floor(Math.random() * clarities.length)];
      const cut = cuts[Math.floor(Math.random() * cuts.length)];
      const price = Math.round((parseFloat(carat) * (5000 + Math.random() * 10000)));
      
      return {
        id: `mock-${i}`,
        stockNumber: `D${10000 + i}`,
        shape,
        carat: parseFloat(carat),
        color,
        clarity,
        cut,
        polish: 'Excellent',
        symmetry: 'Excellent',
        price,
        status: 'Available',
        imageUrl: '',
        certificateUrl: '',
      };
    });
  };

  // Only fetch data when authentication is complete and user is authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.id) {
      fetchData();
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