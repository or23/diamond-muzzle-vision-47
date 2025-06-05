import { Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTelegramAuth } from "@/context/TelegramAuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user } = useTelegramAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  
  const userInitials = user ? `${user.first_name.charAt(0)}${user.last_name?.charAt(0) || ''}`.toUpperCase() : 'DM';
  const displayName = user ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}` : 'Diamond Muzzle';
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Check if we're in Telegram environment
  const isTelegramEnv = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
  
  return (
    <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 bg-gradient-to-r from-[#1A1A1A] to-[#212121] shadow-md">
      <div>
        <h1 className="text-xl font-semibold text-white">mazal-bot</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Only show theme toggle outside of Telegram */}
        {!isTelegramEnv && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white transition-all duration-200 hover:scale-110"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        )}

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/notifications')} 
          className="relative text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white transition-all duration-200 hover:scale-110"
        >
          <Bell size={20} />
          {unreadNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse bg-[#7B2CBF]"
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
              <Avatar className="h-8 w-8 ring-2 ring-[#7B2CBF]/50">
                {user?.photo_url && <AvatarImage src={user.photo_url} alt={displayName} />}
                <AvatarFallback className="bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-gray-200">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-200">{displayName}</p>
                {user?.username && (
                  <p className="text-xs leading-none text-gray-400">
                    @{user.username}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gray-700">
              <User className="mr-2 h-4 w-4 text-gray-400" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer hover:bg-gray-700">
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              onClick={() => {
                if (window.Telegram?.WebApp) {
                  window.Telegram.WebApp.close();
                }
              }} 
              className="cursor-pointer text-red-400 hover:bg-red-900/30"
            >
              Close App
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}