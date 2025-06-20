import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface MarketInsight {
  title: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface MarketInsightsCardProps {
  title: string;
  description?: string;
  insights: MarketInsight[];
  loading?: boolean;
}

export function MarketInsightsCard({ 
  title, 
  description, 
  insights, 
  loading = false 
}: MarketInsightsCardProps) {
  return (
    <Card className="bg-white border border-[#E9ECEF] shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-[#2D3436] text-lg font-bold">{title}</CardTitle>
        {description && <CardDescription className="text-[#6C757D]">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-[#F8F9FA] animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-[#F1F3F5] rounded-lg hover:bg-[#F8F9FA]">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    insight.trend === 'up' 
                      ? 'bg-[#E9F7EF] text-[#28A745]' 
                      : insight.trend === 'down' 
                        ? 'bg-[#FEECF0] text-[#DC3545]' 
                        : 'bg-[#E9F7FE] text-[#17A2B8]'
                  }`}>
                    {insight.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : insight.trend === 'down' ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm text-[#2D3436]">{insight.title}</span>
                </div>
                <span className={`text-sm font-medium ${
                  insight.trend === 'up' 
                    ? 'text-[#28A745]' 
                    : insight.trend === 'down' 
                      ? 'text-[#DC3545]' 
                      : 'text-[#17A2B8]'
                }`}>
                  {insight.change}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <Separator className="my-4 bg-[#F1F3F5]" />
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-[#2D3436]">Quick Tools</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5] text-xs h-auto py-2">
              Diamond Calculator
            </Button>
            <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5] text-xs h-auto py-2">
              Price Alerts
            </Button>
            <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5] text-xs h-auto py-2">
              Market Report
            </Button>
            <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5] text-xs h-auto py-2">
              Diamond Grading
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}