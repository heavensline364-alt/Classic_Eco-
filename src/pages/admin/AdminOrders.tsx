import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle2, Clock, Truck, X } from 'lucide-react';
import { API, showToast } from '../../services/api.js';
import { Order } from '../../types/index.js';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders', {
        params: {
          status: statusFilter,
          search
        }
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, newPaymentStatus?: string) => {
    setUpdatingStatus(true);
    try {
      const res = await API.put(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus
      });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}.`);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(res.data.order);
        }
        loadOrders();
      }
    } catch (err: any) {
      showToast('Error updating order status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
          Restaurant Order Management
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Process nationwide orders, update dispatch statuses, and verify bKash/Nagad transactions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID (CEO-...), customer name, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-stone-300 bg-white text-stone-800 cursor-pointer focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Production">In Production</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer & Contact</th>
                <th className="p-3">District</th>
                <th className="p-3">Total (৳)</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Order Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-900">{o.id}</td>
                    <td className="p-3 text-stone-500 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-stone-800">{o.customerName}</div>
                      <div className="text-[11px] text-stone-500">{o.phone}</div>
                    </td>
                    <td className="p-3 text-stone-700">{o.district}</td>
                    <td className="p-3 font-mono font-bold text-[#174D37]">
                      ৳{o.total?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-stone-800">{o.paymentMethod}</div>
                      <span className={`text-[10px] font-bold ${o.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : o.orderStatus === 'Production'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Production">Production</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-stone-400">Order Management</span>
                <h2 className="text-xl font-bold text-stone-900 font-mono">#{selectedOrder.id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Update Order Fulfillment Status</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                  className="w-full px-3 py-1.5 font-bold rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Production">In Production</option>
                  <option value="Shipped">Shipped with Courier</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Update Payment Status</label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, selectedOrder.orderStatus, e.target.value)}
                  className="w-full px-3 py-1.5 font-bold rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verifying">Verifying bKash/Nagad</option>
                  <option value="Paid">Mark as Paid</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-2 gap-4 text-xs text-stone-600 bg-white border border-stone-200 p-4 rounded-xl">
              <div>
                <span className="font-bold text-stone-800 block">Customer Information:</span>
                <p className="mt-1 font-semibold text-stone-900">{selectedOrder.customerName}</p>
                <p>{selectedOrder.phone}</p>
                <p>{selectedOrder.email || 'No email provided'}</p>
              </div>
              <div>
                <span className="font-bold text-stone-800 block">Shipping Address:</span>
                <p className="mt-1">{selectedOrder.address}</p>
                <p>{selectedOrder.area}, {selectedOrder.district}</p>
                {selectedOrder.orderNotes && (
                  <p className="text-amber-800 font-medium mt-1">Note: {selectedOrder.orderNotes}</p>
                )}
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Ordered Products</h3>
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto text-xs">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-stone-900">{it.name}</div>
                      <div className="text-[11px] text-stone-500">Size: {it.size} · {it.quantity} pcs @ ৳{it.price}</div>
                    </div>
                    <div className="font-bold font-mono text-stone-900">
                      ৳{it.subtotal?.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm">
              <div className="text-xs text-stone-500">
                Payment: <strong>{selectedOrder.paymentMethod}</strong>
                {selectedOrder.trxId && <span className="ml-2 font-mono font-bold text-stone-800">TrxID: {selectedOrder.trxId}</span>}
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">Grand Total</span>
                <span className="text-xl font-bold text-[#174D37] font-mono">
                  ৳{selectedOrder.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
