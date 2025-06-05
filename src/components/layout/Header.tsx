import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTelegramAuth } from "@/context/TelegramAuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user } = useTelegramAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  
  const userInitials = user ? `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ''}`.toUpperCase() : 'DM';
  const displayName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : 'Diamond Muzzle';
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Check if we're in Telegram environment
  const isTelegramEnv = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white shadow-md">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">mazal-bot</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/notifications')} 
          className="relative text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110"
        >
          <Bell size={20} />
          {unreadNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse bg-blue-600"
            >
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </Badge>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full hover:scale-110 transition-all duration-200"
            >
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/50">
                {user?.photo_url && <AvatarImage src={user.photo_url} alt={displayName} />}
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 text-gray-800">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-800">{displayName}</p>
                {user?.username && (
                  <p className="text-xs leading-none text-gray-500">
                    @{user.username}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gray-100">
              <User className="mr-2 h-4 w-4 text-gray-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-gray-100">
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem 
              onClick={() => {
                if (window.Telegram?.WebApp) {
                  window.Telegram.WebApp.close();
                }
              }} 
              className="cursor-pointer text-red-600 hover:bg-red-50"
            >
              Close App
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}