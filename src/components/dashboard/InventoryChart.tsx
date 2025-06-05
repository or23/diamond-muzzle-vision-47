import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface InventoryChartProps {
  data: {
    name: string;
    value: number;
    color?: string;
  }[];
  title: string;
  loading?: boolean;
}

export function InventoryChart({ data, title, loading = false }: InventoryChartProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] bg-gray-100 animate-pulse rounded" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%\" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    color: "#111827"
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill="#3b82f6"
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}