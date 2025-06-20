import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Clock } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  title: string;
  description?: string;
  notifications: Notification[];
  unreadCount: number;
  loading?: boolean;
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCenter({ 
  title, 
  description, 
  notifications, 
  unreadCount,
  loading = false,
  onMarkAsRead
}: NotificationCenterProps) {
  return (
    <Card className="bg-white border border-[#E9ECEF] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#2D3436] text-lg font-bold flex items-center">
              <Bell className="h-5 w-5 mr-2 text-[#007BFF]" />
              {title}
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-[#DC3545] text-white">{unreadCount}</Badge>
              )}
            </CardTitle>
            {description && <CardDescription className="text-[#6C757D]">{description}</CardDescription>}
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
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-[#F8F9FA] animate-pulse rounded-lg" />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 border ${!notification.read ? 'bg-[#F8F9FA] border-[#4A90E2]' : 'border-[#F1F3F5]'} rounded-lg flex items-start gap-3`}
              >
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
  );
}