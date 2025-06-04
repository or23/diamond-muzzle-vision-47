import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardLoadingProps {
  onEmergencyMode: () => void;
}

export function DashboardLoading({ onEmergencyMode }: DashboardLoadingProps) {
  return (
    <Layout>
      <div className="space-y-6 p-2 sm:p-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight premium-text-gradient">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Loading your data safely...</p>
          
          {/* Emergency mode toggle */}
          <Button 
            onClick={onEmergencyMode}
            className="mt-4 bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm premium-shadow"
          >
            Skip to Emergency Mode
          </Button>
        </div>
        
        <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
              <CardContent className="p-3">
                <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="animate-pulse bg-gray-800 border-gray-700">
            <CardContent className="p-6 h-[300px]"></CardContent>
          </Card>
          <Card className="animate-pulse bg-gray-800 border-gray-700">
            <CardContent className="p-6 h-[300px]"></CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}