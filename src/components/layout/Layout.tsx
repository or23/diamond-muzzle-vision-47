import Sidebar from "./Sidebar";
import { Header } from "./Header";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);

  useEffect(() => {
    // Check if we're in Telegram environment
    const isTelegram = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
    setIsTelegramEnv(isTelegram);
    
    // Set viewport height for mobile browsers
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--tg-viewport-height', `${window.innerHeight}px`);
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex bg-white text-gray-800">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile, slide in when open */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 w-full min-w-0 flex flex-col bg-white lg:ml-0">
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">Diamond Muzzle</h1>
          <div className="w-9" /> {/* Spacer for center alignment */}
        </div>
        
        {/* Desktop header */}
        <div className="hidden lg:block">
          <Header />
        </div>
        
        <main className="flex-1 w-full min-w-0 p-2 sm:p-4 md:p-6 overflow-x-hidden bg-white">
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}