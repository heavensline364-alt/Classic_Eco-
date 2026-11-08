import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';
import { useAuth } from '../contexts/AuthContext.js';

import { getImageUrl, handleImageError } from '../utils/image.js';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItemsCount, setIsCartDrawerOpen } = useCart();
  const { user, isAdmin } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Custom Packaging', path: '/custom-packaging' },
    { label: 'Track Order', path: '/track' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single Brand Wordmark / Logo */}
          <Link to="/" className="flex items-center gap-3 whitespace-nowrap shrink-0 group">
            <img
              src={getImageUrl('/assets/aistudio/577808670_1136679895332978_3351486785696396189_n_b821f9ce.jpg')}
              alt="Classic Eco Logo"
              onError={(e) => handleImageError(e)}
              className="w-10 h-10 object-contain rounded-full shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#174D37] font-serif-brand">
                Classic Eco
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                Product & Packaging
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive(link.path)
                    ? 'text-[#174D37] font-semibold border-b-2 border-[#174D37]'
                    : 'hover:text-[#174D37]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Icons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label="View shopping cart"
              className="relative p-2.5 text-stone-700 hover:text-[#174D37] hover:bg-stone-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#174D37] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </button>

            {/* User / Profile Link */}
            {user ? (
              <Link
                to={isAdmin ? '/admin' : '/profile'}
                className="flex items-center gap-1.5 p-2 text-xs font-semibold text-[#174D37] hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap"
              >
                {isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                {isAdmin && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">ADMIN</span>}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:flex items-center gap-1.5 p-2 text-xs font-medium text-stone-600 hover:text-[#174D37] rounded-lg transition-colors whitespace-nowrap"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/custom-packaging"
              className="hidden sm:inline-flex items-center px-4 py-2.5 text-xs font-semibold text-white bg-[#174D37] rounded-lg hover:bg-[#123e2c] active:scale-95 transition-all shadow-xs whitespace-nowrap"
            >
              Request Quote
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#174D37]/10 text-[#174D37] font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <Link
                to={isAdmin ? '/admin' : '/profile'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-stone-800 bg-stone-50 rounded-lg"
              >
                <span>{user.name} ({user.role})</span>
                <span className="text-xs text-[#174D37] font-bold">Go to Dashboard &rarr;</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-center text-xs font-medium text-stone-700 border border-stone-200 rounded-lg"
                >
                  Customer Login
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-center text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg"
                >
                  Admin Portal
                </Link>
              </div>
            )}
            <Link
              to="/custom-packaging"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#174D37] rounded-lg shadow-xs"
            >
              Request Custom Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
