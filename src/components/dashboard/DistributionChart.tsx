import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
}

interface DistributionChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  loading?: boolean;
  colors?: string[];
}

export function DistributionChart({ 
  title, 
  description, 
  data, 
  loading = false,
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']
}: DistributionChartProps) {
  return (
    <Card className="bg-white border border-[#E9ECEF] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#2D3436] text-lg font-bold">{title}</CardTitle>
            {description && <CardDescription className="text-[#6C757D]">{description}</CardDescription>}
          </div>
          <Button variant="ghost" size="sm" className="text-[#6C757D] hover:text-[#2D3436]">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="h-[300px] w-full bg-[#F8F9FA] animate-pulse rounded-lg" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} diamonds`, name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E9ECEF',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}