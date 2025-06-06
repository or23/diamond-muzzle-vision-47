import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Diamond {
  carat: number;
  shape: string;
  color: string;
  clarity: string;
  stockNumber: string;
  price: number;
}

interface PremiumCollectionProps {
  premiumDiamonds: Diamond[];
}

export function PremiumCollection({ premiumDiamonds }: PremiumCollectionProps) {
  return (
    <Card className="premium-card premium-shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-200">Premium Collection</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Highest value diamonds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {premiumDiamonds.slice(0, 8).map((diamond, index) => (
            <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 premium-shadow hover:border-purple-800/50 transition-all duration-200">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {diamond.carat}ct {diamond.shape} {diamond.color} {diamond.clarity}
                </p>
                <p className="text-xs text-gray-400">
                  Stock: {diamond.stockNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-purple-300">
                  ${(diamond.price || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  ${Math.round((diamond.price || 0) / (diamond.carat || 1)).toLocaleString()}/ct
                </p>
              </div>
            </div>
          ))}
          {premiumDiamonds.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No premium diamonds in inventory
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}