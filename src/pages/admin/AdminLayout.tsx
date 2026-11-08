import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Layers,
  ShoppingBag,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { getImageUrl, handleImageError } from '../../utils/image.js';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route check
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-stone-900">Administrator Access Required</h2>
        <p className="text-xs text-stone-500 max-w-sm">
          You must be logged in as an administrator to access the Classic Eco management console.
        </p>
        <div className="flex gap-3">
          <Link
            to="/admin/login"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg"
          >
            Admin Sign In
          </Link>
          <Link
            to="/"
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 rounded-lg"
          >
            Go to Storefront
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Box },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Custom Quotes', path: '/admin/quotes', icon: FileText },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Content & FAQs', path: '/admin/content', icon: MessageSquare },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Top bar */}
      <div className="md:hidden bg-[#123828] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-wide">Classic Eco Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded hover:bg-white/10"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-30 inset-y-0 left-0 w-64 bg-[#123828] text-stone-300 flex flex-col justify-between transition-transform duration-200 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <img
              src={getImageUrl('/assets/aistudio/577808670_1136679895332978_3351486785696396189_n_b821f9ce.jpg')}
              alt="Classic Eco"
              onError={(e) => handleImageError(e)}
              className="w-9 h-9 object-contain rounded-full bg-white p-0.5"
            />
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight font-serif-brand">
                Classic Eco Admin
              </h2>
              <span className="text-[10px] text-stone-400 font-mono">B2B Management</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#174D37] text-white font-bold shadow-xs'
                      : 'hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#5A9B69]' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Storefront
            </span>
            <span className="text-[10px] font-mono">&rarr;</span>
          </Link>

          <div className="px-3 py-2 text-xs bg-white/5 rounded-lg flex items-center justify-between">
            <div className="truncate">
              <div className="text-white font-semibold truncate">{user?.name}</div>
              <div className="text-[10px] text-stone-400 truncate">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-400 p-1 rounded"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
