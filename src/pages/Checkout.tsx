import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Truck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { API, showAlert, showToast } from '../services/api.js';
import { getImageUrl, handleImageError } from '../utils/image.js';

export const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    district: 'Dhaka',
    area: '',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery',
    trxId: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = subtotal >= 5000 ? 0 : formData.district === 'Dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Your cart is empty</h2>
        <p className="text-xs text-stone-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.address) {
      showToast('Please fill in your name, delivery address, and phone number.', 'error');
      return;
    }

    if ((formData.paymentMethod === 'bKash' || formData.paymentMethod === 'Nagad') && !formData.trxId) {
      showToast('Please provide your 8-10 character bKash/Nagad Transaction ID (TrxID).', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        ...formData,
        userId: user?.id || null,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.selectedSize,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        subtotal,
        deliveryFee,
        total: grandTotal
      };

      const res = await API.post('/orders', orderPayload);
      if (res.data.success) {
        clearCart();
        const createdId = res.data.orderId;
        showAlert(
          'Order Placed Successfully!',
          `Your Order Reference is #${createdId}. You can track status at any time or call us at 0163 777 888 9 for urgent updates.`,
          'success'
        );
        navigate(`/track?query=${createdId}`);
      }
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      showToast(err.response?.data?.message || 'Error processing order.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
          Checkout & Dispatch Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Provide your restaurant address and delivery details. Cash on Delivery or manual bKash/Nagad transfers accepted.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs">
          {/* Customer Details */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              1. Customer & Restaurant Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 01711XXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address (For receipt copy)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. manager@restaurant.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              2. Delivery Destination in Bangladesh
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  District / Division <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white cursor-pointer"
                >
                  <option value="Dhaka">Dhaka (City & Suburbs)</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Comilla">Comilla</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                  <option value="Other District">Other District (All 64 covered)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Thana / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g. Dhanmondi / GEC / Mirpur"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Street Address (Shop/House/Road) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House 14, Road 7, Sector 3, Uttara, Dhaka"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Special Dispatch Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.orderNotes}
                  onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                  placeholder="e.g. Call before delivery or deliver via Sundarban Courier"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              3. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  formData.paymentMethod === 'Cash on Delivery'
                    ? 'border-[#174D37] bg-[#174D37]/5 ring-1 ring-[#174D37]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <Banknote className="w-5 h-5 text-[#174D37] mb-2" />
                <span className="text-xs font-bold text-stone-900">Cash on Delivery</span>
                <span className="text-[11px] text-stone-500 mt-1">Pay when courier arrives at your kitchen</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  formData.paymentMethod === 'bKash'
                    ? 'border-[#E2136E] bg-[#E2136E]/5 ring-1 ring-[#E2136E]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bKash"
                  checked={formData.paymentMethod === 'bKash'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-[#E2136E] mb-2" />
                <span className="text-xs font-bold text-[#E2136E]">bKash Transfer</span>
                <span className="text-[11px] text-stone-500 mt-1">Personal or Merchant number</span>
              </label>

              <label
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  formData.paymentMethod === 'Nagad'
                    ? 'border-[#F7931E] bg-[#F7931E]/5 ring-1 ring-[#F7931E]'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Nagad"
                  checked={formData.paymentMethod === 'Nagad'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-[#F7931E] mb-2" />
                <span className="text-xs font-bold text-[#F7931E]">Nagad Payment</span>
                <span className="text-[11px] text-stone-500 mt-1">Instant digital transfer</span>
              </label>
            </div>

            {/* bKash / Nagad payment instructions */}
            {(formData.paymentMethod === 'bKash' || formData.paymentMethod === 'Nagad') && (
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">
                    Send Payment to {formData.paymentMethod} Number:
                  </span>
                  <span className="font-mono font-bold text-base text-[#174D37] select-all">
                    01637778889
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  1. Open your {formData.paymentMethod} app &rarr; Send Money / Payment to <strong>01637778889</strong>.<br />
                  2. Enter exact amount: <strong>৳{grandTotal.toLocaleString()}</strong>.<br />
                  3. Enter the returned Transaction ID below for instant admin verification.
                </p>
                <div>
                  <label className="text-[11px] font-bold text-stone-800 block mb-1">
                    {formData.paymentMethod} Transaction ID (TrxID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trxId}
                    onChange={(e) => setFormData({ ...formData, trxId: e.target.value.toUpperCase() })}
                    placeholder="e.g. BKH9874A21"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-2xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Order Line Items ({items.length})
            </h2>

            <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto pr-1 space-y-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="pt-2 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) => handleImageError(e)}
                      className="w-10 h-10 object-cover rounded border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-stone-800 line-clamp-1">{item.name}</h4>
                      <span className="text-[11px] text-stone-500">
                        {item.quantity} pcs · {item.selectedSize}
                      </span>
                    </div>
                  </div>
                  <div className="font-bold text-stone-900 tabular-nums font-mono whitespace-nowrap">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900 tabular-nums font-mono">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  Delivery Charge ({formData.district})
                </span>
                <span className="font-bold text-stone-900 tabular-nums font-mono">
                  {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t-2 border-stone-200">
                <span>Total Amount Due</span>
                <span className="text-[#174D37] tabular-nums font-mono">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] active:scale-95 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Confirming Order...' : `Confirm & Place Order (৳${grandTotal.toLocaleString()})`}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-stone-500 text-center space-y-1 pt-1">
              <p>🔒 100% Genuine Food-Grade Safe Guarantee</p>
              <p>Need support? Hotline: 0163 777 888 9 (Kakrail, Dhaka)</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
