import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';
import { getImageUrl, handleImageError } from '../utils/image.js';

export const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryZone, setDeliveryZone] = useState<'dhaka' | 'outside'>('dhaka');

  const deliveryFee = subtotal >= 5000 ? 0 : deliveryZone === 'dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">Your Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
          You have not added any packaging supplies to your cart yet. Explore our restaurant collection.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#174D37] rounded-lg hover:bg-[#123e2c] transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
            Your Order Cart
          </h1>
          <span className="text-xs text-stone-500">
            Review your selected restaurant packaging units and minimum order batches.
          </span>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="divide-y divide-stone-100">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => handleImageError(e)}
                    className="w-20 h-20 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-[#174D37] uppercase">{item.category}</span>
                    <h3 className="text-sm font-bold text-stone-900">{item.name}</h3>
                    <div className="text-xs text-stone-500 mt-0.5">Size: {item.selectedSize}</div>
                    <div className="text-xs text-stone-500 font-mono mt-1">
                      Unit: ৳{item.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                  {/* Stepper */}
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 50)}
                      className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 50)}
                      className="px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-stone-900 tabular-nums font-mono">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-[11px] text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-2xs">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-stone-900 tabular-nums font-mono">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>

            {/* Delivery Zone selection */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100">
              <label className="font-bold text-stone-800 uppercase text-[11px] block">
                Destination Zone
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('dhaka')}
                  className={`py-2 px-2 text-center text-xs font-medium rounded-lg border transition-all ${
                    deliveryZone === 'dhaka'
                      ? 'border-[#174D37] bg-[#174D37]/5 text-[#174D37] font-bold'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  Inside Dhaka (৳80)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('outside')}
                  className={`py-2 px-2 text-center text-xs font-medium rounded-lg border transition-all ${
                    deliveryZone === 'outside'
                      ? 'border-[#174D37] bg-[#174D37]/5 text-[#174D37] font-bold'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  Outside Dhaka (৳150)
                </button>
              </div>
            </div>

            <div className="flex justify-between text-stone-600 pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
                Delivery Charge
              </span>
              <span className="font-bold text-stone-900 tabular-nums font-mono">
                {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `৳${deliveryFee}`}
              </span>
            </div>

            {subtotal >= 5000 && (
              <div className="p-2 rounded bg-emerald-50 text-[11px] text-emerald-800 font-medium">
                🎉 Congratulations! Your order qualifies for Free Nationwide Delivery.
              </div>
            )}

            <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t-2 border-stone-200">
              <span>Total Amount</span>
              <span className="text-[#174D37] tabular-nums font-mono">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] active:scale-95 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <Link to="/products" className="text-xs text-stone-500 hover:text-stone-900">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
