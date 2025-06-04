import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketInsights() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="premium-card premium-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-200">Market Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Portfolio Growth</span>
              <span className="text-sm font-semibold text-green-400">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Market Index</span>
              <span className="text-sm font-semibold text-blue-400">+8.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Outperformance</span>
              <span className="text-sm font-semibold text-purple-400">+4.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card premium-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-200">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-300">Best Performers:</span> <span className="text-gray-400">Round, Princess</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-300">Trending:</span> <span className="text-gray-400">Fancy colors</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-300">Recommend:</span> <span className="text-gray-400">Increase 1-2ct inventory</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-card premium-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-200">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">New inquiry</span>
              <span className="text-gray-500">2h ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Price updated</span>
              <span className="text-gray-500">4h ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Inventory sync</span>
              <span className="text-gray-500">6h ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}