
import { ReactNode } from 'react';
import { useTelegramAuth } from '@/context/TelegramAuthContext';
import { Shield, AlertTriangle, Settings, Crown } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

const ADMIN_TELEGRAM_ID = 2138564172;

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, isTelegramEnvironment } = useTelegramAuth();

  console.log('🔍 AdminGuard - Current user:', user);
  console.log('🔍 AdminGuard - User ID:', user?.id);
  console.log('🔍 AdminGuard - Expected Admin ID:', ADMIN_TELEGRAM_ID);
  console.log('🔍 AdminGuard - Is Loading:', isLoading);

  // Fast loading state
  if (isLoading) {
    console.log('⏳ AdminGuard - Still loading...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4 border">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <Settings className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifying Admin Access</h3>
          <p className="text-gray-600 text-sm">Checking administrator permissions...</p>
        </div>
      </div>
    );
  }

  // Always allow access for the admin user ID
  const isAdmin = user && user.id === ADMIN_TELEGRAM_ID;
  
  console.log('🔍 AdminGuard - Is Admin?', isAdmin);
  
  if (!isAdmin) {
    console.log('❌ AdminGuard - Access denied for user:', user?.id);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4 border">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            This area is restricted to administrators only.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Current User ID: {user?.id || 'Unknown'}<br/>
            Required Admin ID: {ADMIN_TELEGRAM_ID}
          </p>
          
          <button
            onClick={() => {
              console.log('🔄 Redirecting to dashboard');
              window.location.hash = '#/dashboard';
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Admin user confirmed - render admin interface
  console.log('✅ AdminGuard - Access granted to admin user');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-center gap-3 p-4">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span className="font-semibold text-gray-900">
            Admin Dashboard - Welcome, {user.first_name}
          </span>
          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            ID: {user.id}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
