import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTelegramAuth } from '@/context/TelegramAuthContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Upload, MessageSquare, TrendingUp, FileText, Settings, Bell, Users, BarChart3, Gem } from 'lucide-react';

const ADMIN_TELEGRAM_ID = 2138564172;

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user } = useTelegramAuth();
  const isAdmin = user?.id === ADMIN_TELEGRAM_ID;
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Insights', href: '/insights', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Diamond Swipe', href: '/swipe', icon: Gem },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Notifications', href: '/notifications', icon: Bell }
  ];
  
  const adminNavigation = [
    { name: 'Admin Analytics', href: '/admin', icon: BarChart3 }
  ];

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    onClose?.();
  };

  return (
    <aside className="w-64 bg-[#1A1A1A] border-r border-gray-800 flex flex-col h-full text-gray-300">
      {/* Header with close button for mobile */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">mazal-bot</h1>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigation.map(item => (
          <NavLink 
            key={item.name} 
            to={item.href} 
            onClick={handleNavClick} 
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
              isActive 
                ? 'bg-[#7B2CBF]/30 text-[#9D4EDD] premium-shadow' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            )}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
        
        {isAdmin && (
          <div className="pt-3 border-t border-gray-800 mt-3">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Admin Panel
            </div>
            {adminNavigation.map(item => (
              <NavLink 
                key={item.name} 
                to={item.href} 
                onClick={handleNavClick} 
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full',
                  isActive 
                    ? 'bg-gradient-to-r from-[#7B2CBF]/30 to-[#9D4EDD]/30 text-[#9D4EDD] border border-[#7B2CBF]/50 premium-shadow' 
                    : 'text-gray-400 hover:bg-gradient-to-r hover:from-[#7B2CBF]/20 hover:to-[#9D4EDD]/20 hover:text-[#9D4EDD]'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;