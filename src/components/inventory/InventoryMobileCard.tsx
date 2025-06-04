import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Diamond } from "./InventoryTable";
import { Edit, Trash, ImageIcon } from "lucide-react";

interface InventoryMobileCardProps {
  diamond: Diamond;
  onEdit?: (diamond: Diamond) => void;
  onDelete?: (stockNumber: string) => void;
}

export function InventoryMobileCard({ diamond, onEdit, onDelete }: InventoryMobileCardProps) {
  return (
    <Card className="w-full bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardContent className="p-4 w-full">
        {/* Image section */}
        {diamond.imageUrl && (
          <div className="mb-4 w-full">
            <img 
              src={diamond.imageUrl} 
              alt={`Diamond ${diamond.stockNumber}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-600"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {!diamond.imageUrl && (
          <div className="mb-4 w-full h-32 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}

        <div className="flex justify-between items-start mb-4 w-full">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono text-sm font-semibold text-gray-100 truncate mb-1">
              {diamond.stockNumber}
            </h3>
            <p className="text-lg font-bold text-gray-200 capitalize">{diamond.shape}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-xl font-bold text-gray-100 mb-1">
              ${diamond.price.toLocaleString()}
            </p>
            <Badge 
              className={`${
                diamond.status === "Available" 
                  ? "bg-emerald-900 text-emerald-200 border-emerald-700" 
                  : diamond.status === "Reserved" 
                  ? "bg-blue-900 text-blue-200 border-blue-700" 
                  : "bg-gray-700 text-gray-200 border-gray-600"
              }`}
              variant="outline"
            >
              {diamond.status}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3 mb-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">CARAT</span>
              <span className="text-sm font-semibold text-gray-100">{diamond.carat.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">CLARITY</span>
              <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 text-xs">
                {diamond.clarity}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">COLOR</span>
              <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 text-xs">
                {diamond.color}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">CUT</span>
              <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 text-xs">
                {diamond.cut}
              </Badge>
            </div>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-3 border-t border-gray-700 w-full">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(diamond)}
                className="flex-1 h-9 border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(diamond.stockNumber)}
                className="flex-1 h-9 text-red-400 border-red-800 hover:bg-red-950"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}