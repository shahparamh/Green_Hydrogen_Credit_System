import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  ShoppingCart, 
  Shield, 
  Users, 
  Settings, 
  LogOut,
  Leaf,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  const navigationItems = {
    producer: [
      { name: 'Dashboard', href: '/dashboard/producer', icon: Home },
      { name: 'Request Credits', href: '/dashboard/producer/request', icon: Leaf },
      { name: 'My Credits', href: '/dashboard/producer/credits', icon: BarChart3 },
      { name: 'Analytics', href: '/dashboard/producer/analytics', icon: TrendingUp },
    ],
    certifier: [
      { name: 'Dashboard', href: '/dashboard/certifier', icon: Home },
      { name: 'Pending Requests', href: '/dashboard/certifier/requests', icon: AlertTriangle },
      { name: 'Approved Credits', href: '/dashboard/certifier/approved', icon: CheckCircle },
      { name: 'Analytics', href: '/dashboard/certifier/analytics', icon: BarChart3 },
    ],
    buyer: [
      { name: 'Dashboard', href: '/dashboard/buyer', icon: Home },
      { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
      { name: 'My Credits', href: '/dashboard/buyer/credits', icon: Leaf },
      { name: 'Retire Credits', href: '/dashboard/buyer/retire', icon: CheckCircle },
      { name: 'Analytics', href: '/dashboard/buyer/analytics', icon: TrendingUp },
    ],
    auditor: [
      { name: 'Dashboard', href: '/dashboard/auditor', icon: Home },
      { name: 'All Transactions', href: '/dashboard/auditor/transactions', icon: FileText },
      { name: 'Fraud Detection', href: '/dashboard/auditor/fraud', icon: Shield },
      { name: 'System Analytics', href: '/dashboard/auditor/analytics', icon: BarChart3 },
    ],
  };

  const currentItems = navigationItems[user?.role] || [];

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={`h-full w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-colors duration-200`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">GreenH2</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {currentItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-item ${
                isActive(item.href) ? 'sidebar-item-active' : 'sidebar-item-inactive'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full sidebar-item text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
