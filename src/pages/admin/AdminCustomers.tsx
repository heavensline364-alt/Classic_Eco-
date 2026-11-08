import React, { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle2, User, Phone, MapPin } from 'lucide-react';
import { API, showConfirm, showToast } from '../../services/api.js';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/customers');
      if (res.data.success) {
        setCustomers(res.data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleBlock = async (id: string, currentBlocked: boolean, name: string) => {
    const action = currentBlocked ? 'unblock' : 'block';
    const confirm = await showConfirm(
      `${action === 'block' ? 'Deactivate' : 'Reactivate'} Customer?`,
      `Are you sure you want to ${action} account "${name}"?`
    );

    if (confirm.isConfirmed) {
      try {
        const res = await API.put(`/admin/customers/${id}/toggle-block`);
        if (res.data.success) {
          showToast(res.data.message);
          setCustomers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isBlocked: res.data.isBlocked } : c))
          );
        }
      } catch (err: any) {
        showToast('Error updating account status.', 'error');
      }
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.businessName && c.businessName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
          Restaurant Client Directory
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          View registered food business accounts, lifetime wholesale spend, and order history.
        </p>
      </div>

      <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by restaurant name, owner, or phone..."
            className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 font-mono">
          Total: {filtered.length} customers
        </span>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Business Name</th>
                <th className="p-3">Phone & Email</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Quotes</th>
                <th className="p-3">Total Spent (৳)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">Loading customers...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">No customers found.</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{c.name}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{c.id}</div>
                    </td>
                    <td className="p-3 font-semibold text-stone-800">
                      {c.businessName || <span className="text-stone-400 font-normal">Independent</span>}
                    </td>
                    <td className="p-3">
                      <div className="text-stone-800 font-medium">{c.phone}</div>
                      <div className="text-[11px] text-stone-500">{c.email}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-stone-800">{c.orderCount}</td>
                    <td className="p-3 font-mono text-stone-600">{c.quoteCount}</td>
                    <td className="p-3 font-mono font-bold text-[#174D37]">
                      ৳{c.totalSpent?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.isBlocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {c.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleBlock(c.id, Boolean(c.isBlocked), c.name)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 ml-auto cursor-pointer ${
                          c.isBlocked
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-red-700 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {c.isBlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                        {c.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
