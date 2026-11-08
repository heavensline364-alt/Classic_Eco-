import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, CheckCircle2, XCircle, FileText, X } from 'lucide-react';
import { API, showToast } from '../../services/api.js';
import { QuoteRequest } from '../../types/index.js';

export const AdminQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected Quote for Review / Price Quoting Modal
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [status, setStatus] = useState('Pending');
  const [quotedPrice, setQuotedPrice] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/quotes', {
        params: { status: statusFilter, search }
      });
      if (res.data.success) {
        setQuotes(res.data.quotes);
      }
    } catch (err) {
      console.error('Failed to load quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [statusFilter, search]);

  const openReviewModal = (q: QuoteRequest) => {
    setSelectedQuote(q);
    setStatus(q.status);
    setQuotedPrice(q.quotedPrice !== null && q.quotedPrice !== undefined ? String(q.quotedPrice) : '');
    setAdminNotes(q.adminNotes || '');
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setSaving(true);
    try {
      const res = await API.put(`/quotes/${selectedQuote.id}`, {
        status,
        quotedPrice: quotedPrice === '' ? null : Number(quotedPrice),
        adminNotes
      });

      if (res.data.success) {
        showToast('Quote updated and pricing saved.');
        setSelectedQuote(null);
        loadQuotes();
      }
    } catch (err: any) {
      showToast('Error updating quote request.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
          Custom Packaging Quotation Requests
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review restaurant logos, inspect custom dimensions, set wholesale price quotes, and manage inquiries.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Inquiry ID (CEQ-...), business, or phone..."
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
            <option value="all">All Inquiries</option>
            <option value="Pending">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Quoted">Price Quoted</option>
            <option value="Approved">Customer Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
              <tr>
                <th className="p-3">Inquiry ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Restaurant & Contact</th>
                <th className="p-3">Packaging Type</th>
                <th className="p-3">Volume</th>
                <th className="p-3">Quoted Price (৳)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">Loading quotes...</td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">No quote requests found.</td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-mono font-bold text-stone-900">{q.id}</td>
                    <td className="p-3 text-stone-500 whitespace-nowrap">
                      {new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{q.businessName}</div>
                      <div className="text-[11px] text-stone-500">{q.name} · {q.phone}</div>
                    </td>
                    <td className="p-3 font-medium text-stone-800">{q.productType}</td>
                    <td className="p-3 font-semibold text-stone-700">{q.requiredQuantity}</td>
                    <td className="p-3 font-mono font-bold text-[#174D37]">
                      {q.quotedPrice ? `৳${q.quotedPrice.toLocaleString()}` : <span className="text-stone-400 font-normal">Pending</span>}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          q.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : q.status === 'Quoted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openReviewModal(q)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review & Quote
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Price Quoting Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-stone-400">Custom Packaging Inquiry</span>
                <h2 className="text-xl font-bold text-stone-900 font-mono">#{selectedQuote.id}</h2>
              </div>
              <button onClick={() => setSelectedQuote(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block text-[11px]">Restaurant / Business</span>
                <span className="font-bold text-stone-900 text-sm">{selectedQuote.businessName}</span>
                <p className="text-stone-600 mt-1">{selectedQuote.name} · {selectedQuote.phone}</p>
                <p className="text-stone-600">{selectedQuote.email || 'No email provided'}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[11px]">Requested Product</span>
                <span className="font-bold text-stone-900">{selectedQuote.productType}</span>
                <p className="text-stone-600 mt-1">Quantity: <strong>{selectedQuote.requiredQuantity}</strong></p>
                <p className="text-stone-600">Size: <strong>{selectedQuote.packagingSize}</strong></p>
                <p className="text-stone-600">Material: <strong>{selectedQuote.materialPreference}</strong></p>
              </div>
            </div>

            {/* Uploaded Customer Logo / Artwork Preview */}
            <div className="space-y-2">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Uploaded Logo / Packaging Artwork
              </h3>
              {selectedQuote.logoFile ? (
                <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center">
                  <img
                    src={selectedQuote.logoFile}
                    alt="Customer Artwork"
                    className="max-h-40 max-w-full object-contain rounded"
                  />
                </div>
              ) : (
                <p className="text-xs text-stone-400 italic bg-stone-50 p-3 rounded-lg border border-stone-200">
                  No digital artwork was uploaded in this inquiry. Customer requested direct contact on phone/WhatsApp.
                </p>
              )}
            </div>

            {/* Customer Special Notes */}
            {selectedQuote.instructions && (
              <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900">
                <strong>Customer Instructions:</strong> {selectedQuote.instructions}
              </div>
            )}

            {/* Pricing & Status Form */}
            <form onSubmit={handleSaveQuote} className="space-y-4 pt-2 border-t border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Set Quoted Total Price (৳ BDT)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="e.g. 32500"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Quotation Workflow Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  >
                    <option value="Pending">Pending Review</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Quoted">Quoted to Customer</option>
                    <option value="Approved">Approved by Customer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed / In Production</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Admin Internal Notes / Breakdown
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Quoted at 6.50 BDT/pc. Plate cost included. Free delivery inside Dhaka."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Quotation Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
