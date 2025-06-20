import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventoryData } from "@/hooks/useInventoryData";
import { useLeads } from "@/hooks/useLeads";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useNotifications } from "@/hooks/useNotifications";
import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Diamond, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Bell, 
  Clock, 
  Filter, 
  Search,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const [enableDataFetching, setEnableDataFetching] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  // Only use hooks if data fetching is enabled
  const inventoryHook = useInventoryData();
  const leadsHook = useLeads();
  const subscriptionsHook = useSubscriptions();
  const notificationsHook = useNotifications();

  // Fallback data for emergency mode with proper loading states
  const fallbackData = {
    allDiamonds: [],
    leads: [],
    subscriptions: [],
    notifications: [],
    loading: false,
    isLoading: false,
  };

  // Use actual data or fallback based on mode with proper destructuring
  const {
    allDiamonds = [],
    loading: inventoryLoading = false,
    handleRefresh
  } = emergencyMode ? fallbackData : inventoryHook;
  
  const {
    leads = [],
    isLoading: leadsLoading = false
  } = emergencyMode ? fallbackData : leadsHook;
  
  const {
    subscriptions = [],
    isLoading: subscriptionsLoading = false
  } = emergencyMode ? fallbackData : subscriptionsHook;
  
  const {
    notifications = []
  } = emergencyMode ? fallbackData : notificationsHook;

  // Auto-enable emergency mode if any hook fails
  useEffect(() => {
    const hasErrors = !enableDataFetching || 
      (inventoryLoading && leadsLoading && subscriptionsLoading);
    
    if (hasErrors) {
      setEmergencyMode(true);
    }
  }, [inventoryLoading, leadsLoading, subscriptionsLoading, enableDataFetching]);

  // Calculate metrics with safe fallbacks
  const totalInventory = allDiamonds?.length || 0;
  const activeLeads = leads?.filter(lead => lead.status === 'active').length || 0;
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  // Safe calculations
  const totalValue = allDiamonds?.reduce((sum, diamond) => sum + (diamond.price || 0), 0) || 0;
  const avgCaratWeight = allDiamonds?.length > 0 ? 
    allDiamonds.reduce((sum, d) => sum + (d.carat || 0), 0) / allDiamonds.length : 0;
  const avgPricePerCarat = allDiamonds?.length > 0 ? 
    allDiamonds.reduce((sum, d) => sum + (d.price || 0) / (d.carat || 1), 0) / allDiamonds.length : 0;

  // Safe shape distribution with proper number typing
  const shapeData = allDiamonds?.reduce((acc, diamond) => {
    const shape = diamond.shape || 'Unknown';
    acc[shape] = (acc[shape] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  const chartData = Object.entries(shapeData).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  // Mock price trend data
  const priceTrendData = [
    { month: 'Jan', price: 5800 },
    { month: 'Feb', price: 5900 },
    { month: 'Mar', price: 6100 },
    { month: 'Apr', price: 6000 },
    { month: 'May', price: 6200 },
    { month: 'Jun', price: 6400 },
    { month: 'Jul', price: 6300 },
  ];

  // Mock inventory by clarity
  const clarityData = [
    { name: 'VS1', value: 35 },
    { name: 'VS2', value: 25 },
    { name: 'VVS1', value: 15 },
    { name: 'VVS2', value: 10 },
    { name: 'SI1', value: 10 },
    { name: 'SI2', value: 5 },
  ];

  // Mock recent transactions
  const recentTransactions = [
    { id: 1, date: '2025-06-18', diamond: 'Round 1.2ct VS1 F', price: 12500, status: 'Completed', customer: 'John Smith' },
    { id: 2, date: '2025-06-17', diamond: 'Princess 1.5ct VVS2 D', price: 18200, status: 'Pending', customer: 'Sarah Johnson' },
    { id: 3, date: '2025-06-15', diamond: 'Oval 2.0ct VS2 G', price: 22000, status: 'Completed', customer: 'Michael Brown' },
    { id: 4, date: '2025-06-14', diamond: 'Emerald 1.8ct SI1 H', price: 15800, status: 'Completed', customer: 'Emma Davis' },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  // Mock market insights
  const marketInsights = [
    { title: 'Round diamonds demand increasing', change: '+8%', trend: 'up' },
    { title: 'VS1 clarity premium growing', change: '+5%', trend: 'up' },
    { title: 'Emerald cut prices stabilizing', change: '0%', trend: 'stable' },
    { title: 'SI2 clarity demand decreasing', change: '-3%', trend: 'down' },
  ];

  return (
    <Layout>
      <div className="p-6 bg-[#F8F9FA] min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#2D3436]">Diamond Trader Dashboard</h1>
            <p className="text-[#6C757D]">Welcome back! Here's your diamond market overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-[#E9ECEF] text-[#6C757D] hover:bg-[#F1F3F5] hover:text-[#2D3436]" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0069D9] text-white">
              <Diamond className="h-4 w-4 mr-2" />
              Add Diamond
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-white border border-[#E9ECEF] shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6C757D] text-sm font-medium mb-1">Total Inventory</p>
                  <h3 className="text-3xl font-bold text-[#2D3436]">{totalInventory}</h3>
                  <p className="text-[#6C757D] text-xs mt-1">
                    <span className="text-[#28A745] font-medium">+12% </span>
                    from last month
                  </p>
                </div>
                <div className="bg-[#E9F7FE] p-3 rounded-lg">
                  <Diamond className="h-6 w-6 text-[#007BFF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#E9ECEF] shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6C757D] text-sm font-medium mb-1">Portfolio Value</p>
                  <h3 className="text-3xl font-bold text-[#2D3436]">${totalValue.toLocaleString()}</h3>
                  <p className="text-[#6C757D] text-xs mt-1">
                    <span className="text-[#28A745] font-medium">+8% </span>
                    from last month
                  </p>
                </div>
                <div className="bg-[#E9F7FE] p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-[#007BFF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#E9ECEF] shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6C757D] text-sm font-medium mb-1">Active Leads</p>
                  <h3 className="text-3xl font-bold text-[#2D3436]">{activeLeads}</h3>
                  <p className="text-[#6C757D] text-xs mt-1">
                    <span className="text-[#28A745] font-medium">+5 </span>
                    new this week
                  </p>
                </div>
                <div className="bg-[#E9F7FE] p-3 rounded-lg">
                  <Users className="h-6 w-6 text-[#007BFF]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-[#E9ECEF] shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6C757D] text-sm font-medium mb-1">Avg Price/Ct</p>
                  <h3 className="text-3xl font-bold text-[#2D3436]">${Math.round(avgPricePerCarat).toLocaleString()}</h3>
                  <p className="text-[#6C757D] text-xs mt-1">
                    <span className="text-[#DC3545] font-medium">-2% </span>
                    from last week
                  </p>
                </div>
                <div className="bg-[#E9F7FE] p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#007BFF]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Price Trends Chart */}
          <Card className="lg:col-span-2 bg-white border border-[#E9ECEF] shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-[#2D3436] text-lg font-bold">Diamond Price Trends</CardTitle>
                  <CardDescription className="text-[#6C757D]">Average price per carat over time</CardDescription>
                </div>
                <Select defaultValue="6months">
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
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
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
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#007BFF" 
                      strokeWidth={2}
                      dot={{ stroke: '#007BFF', strokeWidth: 2, r: 4, fill: 'white' }}
                      activeDot={{ stroke: '#007BFF', strokeWidth: 2, r: 6, fill: '#007BFF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Distribution */}
          <Card className="bg-white border border-[#E9ECEF] shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-[#2D3436] text-lg font-bold">Inventory by Clarity</CardTitle>
                  <CardDescription className="text-[#6C757D]">Distribution of diamonds</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-[#6C757D] hover:text-[#2D3436]">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clarityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {clarityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            </CardContent>
          </Card>
        </div>

        {/* Transactions and Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 bg-white border border-[#E9ECEF] shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-[#2D3436] text-lg font-bold">Recent Transactions</CardTitle>
                  <CardDescription className="text-[#6C757D]">Latest diamond sales and purchases</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search transactions..." 
                    className="h-8 text-xs border-[#E9ECEF] text-[#6C757D] w-[180px]"
                  />
                  <Button variant="ghost" size="sm" className="text-[#6C757D] hover:text-[#2D3436]">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E9ECEF]">
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6C757D]">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6C757D]">Diamond</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6C757D]">Customer</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-[#6C757D]">Price</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-[#6C757D]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-[#F1F3F5] hover:bg-[#F8F9FA]">
                        <td className="py-3 px-4 text-sm text-[#2D3436]">{transaction.date}</td>
                        <td className="py-3 px-4 text-sm text-[#2D3436] font-medium">{transaction.diamond}</td>
                        <td className="py-3 px-4 text-sm text-[#2D3436]">{transaction.customer}</td>
                        <td className="py-3 px-4 text-sm text-[#2D3436] text-right font-medium">${transaction.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge 
                            className={`${
                              transaction.status === 'Completed' 
                                ? 'bg-[#E9F7EF] text-[#28A745] hover:bg-[#D4EDDA]' 
                                : 'bg-[#FFF3CD] text-[#FFC107] hover:bg-[#FFE8A1]'
                            } border-none`}
                          >
                            {transaction.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5] hover:text-[#0056b3]">
                  View All Transactions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card className="bg-white border border-[#E9ECEF] shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#2D3436] text-lg font-bold">Market Insights</CardTitle>
              <CardDescription className="text-[#6C757D]">Latest trends and analytics</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {marketInsights.map((insight, index) => (
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
        </div>

        {/* Notification Center */}
        <div className="mt-6">
          <Card className="bg-white border border-[#E9ECEF] shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-[#2D3436] text-lg font-bold flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-[#007BFF]" />
                    Notification Center
                    {unreadNotifications > 0 && (
                      <Badge className="ml-2 bg-[#DC3545] text-white">{unreadNotifications}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[#6C757D]">Price alerts and important updates</CardDescription>
                </div>
                <Tabs defaultValue="all" className="w-[400px]">
                  <TabsList className="bg-[#F1F3F5]">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
                    <TabsTrigger value="alerts" className="data-[state=active]:bg-white">Price Alerts</TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-white">System</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 4).map((notification, index) => (
                    <div key={index} className={`p-3 border ${!notification.read ? 'bg-[#F8F9FA] border-[#4A90E2]' : 'border-[#F1F3F5]'} rounded-lg flex items-start gap-3`}>
                      <div className={`p-2 rounded-full ${
                        notification.type === 'alert' 
                          ? 'bg-[#FEECF0] text-[#DC3545]' 
                          : notification.type === 'info' 
                            ? 'bg-[#E9F7FE] text-[#17A2B8]'
                            : 'bg-[#E9F7EF] text-[#28A745]'
                      }`}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-[#2D3436]">{notification.title}</h4>
                          <span className="text-xs text-[#6C757D] flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-[#6C757D] mt-1">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-[#E9ECEF] mx-auto mb-3" />
                  <p className="text-[#6C757D]">No notifications at this time</p>
                </div>
              )}
              
              {notifications.length > 4 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" className="text-[#007BFF] border-[#E9ECEF] hover:bg-[#F1F3F5]">
                    View All Notifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}