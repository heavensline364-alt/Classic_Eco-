import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, FileText, User as UserIcon, LogOut, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { API, showToast } from '../services/api.js';
import { Order, QuoteRequest } from '../types/index.js';

export const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'quotes' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [address, setAddress] = useState(user?.address || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const [ordersRes, quotesRes] = await Promise.all([
          API.get('/orders/my-orders'),
          API.get('/quotes/my-quotes')
        ]);
        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
        if (quotesRes.data.success) setQuotes(quotesRes.data.quotes);
      } catch (err) {
        console.error('Failed to load customer profile history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await API.put('/auth/profile', { name, phone, businessName, address });
      if (res.data.success) {
        updateUser(res.data.user);
        showToast('Profile updated successfully!');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#174D37] text-white flex items-center justify-center font-bold text-xl font-serif-brand">
            {user?.name?.substring(0, 2).toUpperCase() || 'CE'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{user?.name}</h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {user?.businessName ? `${user.businessName} · ` : ''}
              {user?.email} · {user?.phone}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-[#174D37] text-[#174D37]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          My Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'quotes'
              ? 'border-[#174D37] text-[#174D37]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Custom Quotation Inquiries ({quotes.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-[#174D37] text-[#174D37]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Profile Details
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-4">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800">No orders placed yet</h3>
              <p className="text-xs text-stone-500">Explore our packaging catalog and place your wholesale order.</p>
              <Link
                to="/products"
                className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs hover:border-[#174D37]/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[11px] text-stone-400 font-mono">Order Ref:</span>
                    <h3 className="text-sm font-bold text-stone-900 font-mono">{o.id}</h3>
                    <span className="text-[11px] text-stone-500">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded font-mono ${
                        o.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                    <Link
                      to={`/track?query=${o.id}`}
                      className="text-xs font-semibold text-[#174D37] hover:underline flex items-center gap-1"
                    >
                      Live Tracking
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between">
                      <div>
                        <span className="font-semibold text-stone-800">{it.name}</span>
                        <span className="text-stone-500 block text-[11px]">{it.quantity} pcs · {it.size}</span>
                      </div>
                      <span className="font-bold text-stone-900 font-mono">
                        ৳{it.subtotal?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    Payment: <strong>{o.paymentMethod}</strong> ({o.paymentStatus})
                  </span>
                  <div className="font-bold text-stone-900 text-sm font-mono">
                    Total: <span className="text-[#174D37]">৳{o.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Custom Quotation Inquiries */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-4">
              <FileText className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-stone-800">No quotation inquiries submitted</h3>
              <p className="text-xs text-stone-500">Submit your custom logo and box specifications for an instant review.</p>
              <Link
                to="/custom-packaging"
                className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg"
              >
                Request Custom Quote
              </Link>
            </div>
          ) : (
            quotes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div>
                    <span className="text-[11px] text-stone-400 font-mono">Inquiry Ref:</span>
                    <h3 className="text-sm font-bold text-stone-900 font-mono">{q.id}</h3>
                    <span className="text-[11px] text-stone-500">{q.productType}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Status:</span>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded font-mono ${
                        q.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Volume</span>
                    <span className="font-semibold text-stone-800">{q.requiredQuantity}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Dimensions</span>
                    <span className="font-semibold text-stone-800">{q.packagingSize}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Quoted Rate</span>
                    <span className="font-bold text-[#174D37] font-mono">
                      {q.quotedPrice ? `৳${q.quotedPrice.toLocaleString()}` : 'Awaiting Review'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Submitted</span>
                    <span className="font-semibold text-stone-800">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {q.adminNotes && (
                  <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg text-xs border border-emerald-200">
                    <strong>Admin Note:</strong> {q.adminNotes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleUpdateProfile} className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-4 max-w-xl">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
            Update Business Details
          </h2>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Restaurant / Brand Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Hotline</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Kitchen / Showroom Delivery Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={updatingProfile}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors cursor-pointer"
          >
            {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      )}
    </div>
  );
};
