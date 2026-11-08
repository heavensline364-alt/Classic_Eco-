import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { API } from '../services/api.js';
import { Order } from '../types/index.js';

export const TrackOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrack = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/orders/track/${encodeURIComponent(searchVal.trim())}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'No matching order found for this Order ID or Phone number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchTrack(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(query);
  };

  const steps = ['Pending', 'Confirmed', 'Production', 'Shipped', 'Delivered'];

  const getStepIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    if (status === 'Processing') return 1;
    return steps.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
          Live Status Tracker
        </span>
        <h1 className="text-3xl font-bold text-stone-900 font-serif-brand">
          Track Your Packaging Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your unique Order Reference (e.g. <strong>CEO-98214</strong>) or registered phone number.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID (CEO-XXXXX) or Phone"
            className="w-full pl-9 pr-4 py-3 text-xs font-mono font-medium rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900 shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto space-y-2 text-xs text-red-800">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
          <p className="font-semibold">{error}</p>
          <p className="text-stone-500">
            Please verify your Order ID or call our Kakrail customer helpline at <strong>0163 777 888 9</strong>.
          </p>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Order Tracking
              </span>
              <h2 className="text-xl font-bold text-stone-900 font-mono">
                Order #{order.id}
              </h2>
              <span className="text-xs text-stone-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">Status:</span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded font-mono ${
                  order.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.orderStatus === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {order.orderStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          {order.orderStatus !== 'Cancelled' ? (
            <div className="py-4">
              <div className="grid grid-cols-5 gap-2 text-center relative">
                {steps.map((st, i) => {
                  const isDone = i <= currentStepIdx;
                  const isCurrent = i === currentStepIdx;
                  return (
                    <div key={st} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#174D37] text-white'
                            : 'bg-stone-200 text-stone-500'
                        } ${isCurrent ? 'ring-4 ring-[#174D37]/20 scale-110' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-[11px] font-semibold ${isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 text-center font-medium">
              This order was marked as Cancelled. Please contact us at 0163 777 888 9 if you have any questions.
            </div>
          )}

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs">
            {/* Delivery address */}
            <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Delivery Details
              </h3>
              <p className="text-stone-700">
                <strong>Recipient:</strong> {order.customerName}
              </p>
              <p className="text-stone-700">
                <strong>Phone:</strong> {order.phone}
              </p>
              <p className="text-stone-700">
                <strong>Address:</strong> {order.address}, {order.area}, {order.district}
              </p>
              <p className="text-stone-700">
                <strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})
              </p>
              {order.trxId && (
                <p className="text-stone-700 font-mono">
                  <strong>TrxID:</strong> {order.trxId}
                </p>
              )}
            </div>

            {/* Line items summary */}
            <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Ordered Items
              </h3>
              <div className="divide-y divide-stone-200 max-h-40 overflow-y-auto space-y-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="pt-1 flex justify-between">
                    <div>
                      <span className="font-semibold text-stone-800">{it.name}</span>
                      <span className="text-[11px] text-stone-500 block">
                        {it.quantity} pcs · {it.size}
                      </span>
                    </div>
                    <span className="font-bold text-stone-900 font-mono">
                      ৳{it.subtotal?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="font-mono text-[#174D37]">৳{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
