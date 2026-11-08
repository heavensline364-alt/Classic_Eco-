import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Box,
  Users,
  Clock,
  FileText,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { API } from '../../services/api.js';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-1/4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-stone-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingQuotes: 0
  };

  const salesAnalytics = data?.salesAnalytics || [];
  const statusCounts = data?.statusCounts || [];
  const recentOrders = data?.recentOrders || [];
  const recentQuotes = data?.recentQuotes || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
          Executive Dashboard Overview
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Live business operations metrics, real-time revenue analytics, and pipeline requests.
        </p>
      </div>

      {/* KPI Cards (6 items) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">৳</span>
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">
            ৳{stats.totalRevenue?.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Delivered & Confirmed</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">
            {stats.totalOrders}
          </div>
          <span className="text-[10px] text-stone-400">All-time lifetime</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 font-mono tabular-nums">
            {stats.pendingOrders}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Needs Confirmation</span>
        </div>

        {/* Pending Custom Quotes */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Quotes</span>
            <FileText className="w-4 h-4 text-[#174D37]" />
          </div>
          <div className="text-xl font-bold text-[#174D37] font-mono tabular-nums">
            {stats.pendingQuotes}
          </div>
          <span className="text-[10px] text-[#174D37] font-medium">Awaiting Price Quote</span>
        </div>

        {/* Total Products */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Products</span>
            <Box className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">
            {stats.totalProducts}
          </div>
          <span className="text-[10px] text-stone-400">Active catalog items</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-xl font-bold text-stone-900 font-mono tabular-nums">
            {stats.totalCustomers}
          </div>
          <span className="text-[10px] text-stone-400">Registered accounts</span>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">Revenue & Order Analytics</h2>
              <span className="text-[11px] text-stone-400">Monthly gross sales volume (BDT ৳)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real MongoDB Data</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesAnalytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#174D37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#174D37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `৳${val >= 1000 ? `${val / 1000}k` : val}`} />
                <Tooltip
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#174D37" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900">Order Status Overview</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCounts} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={75} />
                <Tooltip
                  formatter={(value: any) => [`${value} Orders`, 'Count']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {statusCounts.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Recent Customer Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-[#174D37] hover:underline flex items-center gap-1">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total (৳)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-900">{o.id}</td>
                    <td className="p-3">
                      <div className="font-medium text-stone-800">{o.customerName}</div>
                      <div className="text-[11px] text-stone-400">{o.phone}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-stone-900">
                      ৳{o.total?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-stone-100 text-stone-800">
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[11px] font-semibold ${o.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {o.paymentMethod}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Quotes (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Recent Quote Requests</h2>
            <Link to="/admin/quotes" className="text-xs font-semibold text-[#174D37] hover:underline flex items-center gap-1">
              Review All &rarr;
            </Link>
          </div>

          <div className="divide-y divide-stone-100 p-2">
            {recentQuotes.map((q: any) => (
              <div key={q.id} className="p-3 hover:bg-stone-50 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{q.id}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {q.status}
                    </span>
                  </div>
                  <div className="font-semibold text-stone-800 mt-1">{q.businessName}</div>
                  <div className="text-[11px] text-stone-500">{q.productType} · {q.requiredQuantity}</div>
                </div>

                <Link
                  to="/admin/quotes"
                  className="p-1.5 rounded-lg text-stone-500 hover:text-[#174D37] hover:bg-stone-100"
                  title="Review Quote"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
