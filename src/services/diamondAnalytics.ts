import { Diamond } from "@/components/inventory/InventoryTable";

interface DiamondData {
  id?: string;
  shape?: string;
  color?: string;
  clarity?: string;
  weight?: number;
  carat?: number;
  price?: number;
  price_per_carat?: number;
  stock?: string;
  stock_number?: string;
  owners?: number[];
  owner_id?: number;
  status?: string;
  cut?: string;
  polish?: string;
  symmetry?: string;
  picture?: string;
  certificate_url?: string;
}

interface DashboardStats {
  totalDiamonds: number;
  matchedPairs: number;
  totalLeads: number;
  activeSubscriptions: number;
}

interface InventoryData {
  name: string;
  value: number;
}

export function processDiamondDataForDashboard(diamonds: DiamondData[], currentUserId?: number): {
  stats: DashboardStats;
  inventoryByShape: InventoryData[];
  salesByCategory: InventoryData[];
} {
  // Filter diamonds for current user if user ID is provided
  const userDiamonds = currentUserId 
    ? diamonds.filter(diamond => {
        console.log('Checking diamond:', diamond.id, 'owners:', diamond.owners, 'against user:', currentUserId);
        return diamond.owners?.includes(currentUserId) || diamond.owner_id === currentUserId;
      })
    : diamonds;
  
  console.log('Processing dashboard data for user:', currentUserId, 'User diamonds:', userDiamonds.length, 'Total diamonds:', diamonds.length);
  
  // Calculate basic stats
  const totalDiamonds = userDiamonds.length;
  
  // Calculate matched pairs based on similar characteristics
  const pairMap = new Map<string, number>();
  userDiamonds.forEach(diamond => {
    if (diamond.color && diamond.clarity && diamond.shape) {
      const key = `${diamond.shape}-${diamond.color}-${diamond.clarity}`;
      pairMap.set(key, (pairMap.get(key) || 0) + 1);
    }
  });
  const matchedPairs = Array.from(pairMap.values()).reduce((acc, count) => 
    acc + Math.floor(count / 2), 0
  );
  
  // Count unique shapes as market diversity
  const uniqueShapes = new Set(userDiamonds.map(d => d.shape).filter(Boolean));
  const totalLeads = uniqueShapes.size;
  
  // Calculate inventory value tiers
  const highValueDiamonds = userDiamonds.filter(d => 
    (d.price_per_carat || 0) * (d.weight || d.carat || 0) > 10000
  ).length;
  
  const stats: DashboardStats = {
    totalDiamonds,
    matchedPairs,
    totalLeads,
    activeSubscriptions: highValueDiamonds,
  };
  
  // Group diamonds by shape for inventory chart
  const shapeMap = new Map<string, number>();
  userDiamonds.forEach(diamond => {
    if (diamond.shape) {
      const shape = diamond.shape;
      shapeMap.set(shape, (shapeMap.get(shape) || 0) + 1);
    }
  });
  
  const inventoryByShape: InventoryData[] = Array.from(shapeMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Group diamonds by color for sales chart
  const colorMap = new Map<string, number>();
  userDiamonds.forEach(diamond => {
    if (diamond.color) {
      const color = diamond.color;
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }
  });
  
  const salesByCategory: InventoryData[] = Array.from(colorMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  
  return {
    stats,
    inventoryByShape,
    salesByCategory,
  };
}

export function convertDiamondsToInventoryFormat(diamonds: DiamondData[], currentUserId?: number) {
  // FIXED: Improved diamond filtering logic to handle all possible data formats
  const userDiamonds = currentUserId 
    ? diamonds.filter(diamond => {
        // Check all possible ways a diamond could be associated with a user
        const isOwner = Array.isArray(diamond.owners) && diamond.owners.includes(currentUserId);
        const isDirectOwner = diamond.owner_id === currentUserId;
        const hasNoOwnerInfo = !diamond.owners && !diamond.owner_id;
        
        // For debugging
        if (diamond.id && (isOwner || isDirectOwner)) {
          console.log(`Diamond ${diamond.id} belongs to user ${currentUserId}`);
        }
        
        // Include diamonds that either belong to the user or have no owner info
        return isOwner || isDirectOwner || hasNoOwnerInfo;
      })
    : diamonds;
  
  console.log('Converting diamonds to inventory format for user:', currentUserId, 'Filtered diamonds:', userDiamonds.length);
  
  return userDiamonds.map(diamond => {
    // FIXED: Handle all possible property name variations
    const weight = diamond.weight || diamond.carat || 0;
    const pricePerCarat = diamond.price_per_carat || 0;
    const totalPrice = diamond.price || Math.round(pricePerCarat * weight);
    const stockNumber = diamond.stock_number || diamond.stock || `D${diamond.id || Math.floor(Math.random() * 10000)}`;
    
    return {
      id: diamond.id || '',
      stockNumber: stockNumber,
      shape: diamond.shape || 'Unknown',
      carat: weight,
      color: diamond.color || 'Unknown',
      clarity: diamond.clarity || 'Unknown',
      cut: diamond.cut || 'Excellent',
      polish: diamond.polish || 'Excellent',
      symmetry: diamond.symmetry || 'Excellent',
      price: totalPrice,
      status: diamond.status || 'Available',
      imageUrl: diamond.picture || '',
      certificateUrl: diamond.certificate_url || '',
    };
  });
}