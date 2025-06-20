import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface PriceChartProps {
  title: string;
  description?: string;
  data: any[];
  loading?: boolean;
}

export function PriceChart({ 
  title, 
  description, 
  data, 
  loading = false 
}: PriceChartProps) {
  const [timeRange, setTimeRange] = useState('6months');
  
  return (
    <Card className="bg-white border border-[#E9ECEF] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#2D3436] text-lg font-bold">{title}</CardTitle>
            {description && <CardDescription className="text-[#6C757D]">{description}</CardDescription>}
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-8 text-xs border-[#E9ECEF] text-[#6C757D]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-[300px] w-full bg-[#F8F9FA] animate-pulse rounded-lg" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
                <XAxis dataKey="month" tick={{ fill: '#6C757D' }} axisLine={{ stroke: '#E9ECEF' }} />
                <YAxis tick={{ fill: '#6C757D' }} axisLine={{ stroke: '#E9ECEF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E9ECEF',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  formatter={(value) => [`$${value}`, 'Price per carat']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#007BFF" 
                  strokeWidth={2}
                  dot={{ stroke: '#007BFF', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#007BFF', strokeWidth: 2, r: 6, fill: '#007BFF' }}
                  name="Price per carat"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}