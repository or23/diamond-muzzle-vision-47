interface DashboardHeaderProps {
  emergencyMode: boolean;
}

export function DashboardHeader({ emergencyMode }: DashboardHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight premium-text-gradient">Dashboard</h1>
      <p className="text-sm text-gray-400 mt-1">
        Real-time insights and analytics
      </p>
      
      {/* Emergency mode indicator */}
      {emergencyMode && (
        <div className="mt-2 text-xs bg-yellow-900/30 text-yellow-300 px-3 py-1 rounded-md border border-yellow-800/50">
          Emergency Mode: Using fallback data
        </div>
      )}
    </div>
  );
}