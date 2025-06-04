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
    <Card className="premium-card premium-shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-gray-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] bg-gray-800 animate-pulse rounded" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%\" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#aaa' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#aaa' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#212121",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    color: "#eee"
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  fill="#9D4EDD"
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