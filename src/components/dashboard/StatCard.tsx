import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DivideIcon as LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  description?: string;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  description,
  trend,
  trendLabel,
  loading = false,
  className,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (loading) return;
    
    const duration = 1000;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      const nextValue = Math.floor(startValue + (value - startValue) * easedProgress);
      setDisplayValue(nextValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };
    
    requestAnimationFrame(updateValue);
  }, [value, loading]);
  
  const trendClassName = trend 
    ? trend > 0 
      ? "text-[#28A745]" 
      : "text-[#DC3545]" 
    : "";
    
  const trendSign = trend 
    ? trend > 0 
      ? "+" 
      : "" 
    : "";
  
  return (
    <Card className={cn("bg-white border border-[#E9ECEF] shadow-sm hover:shadow transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#6C757D] text-sm font-medium mb-1">{title}</p>
            {loading ? (
              <div className="h-9 w-24 bg-[#F1F3F5] animate-pulse rounded" />
            ) : (
              <h3 className="text-3xl font-bold text-[#2D3436]">
                {prefix}{displayValue.toLocaleString()}{suffix}
              </h3>
            )}
            
            {(description || trend !== undefined) && (
              <p className="text-[#6C757D] text-xs mt-1">
                {trend !== undefined && (
                  <span className={cn("font-medium", trendClassName)}>
                    {trendSign}{trend}% 
                  </span>
                )}
                {' '}{description || trendLabel}
              </p>
            )}
          </div>
          <div className="bg-[#E9F7FE] p-3 rounded-lg">
            <Icon className="h-6 w-6 text-[#007BFF]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}