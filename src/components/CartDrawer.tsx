import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext.js';
import { getImageUrl, handleImageError } from '../utils/image.js';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal, isCartDrawerOpen, setIsCartDrawerOpen } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#174D37]" />
              <h2 className="text-base font-bold text-stone-900">Your Quotation Cart</h2>
              <span className="text-xs text-stone-500 font-mono">({items.length} items)</span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-700 text-sm">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 mt-1">Browse our restaurant packaging products and add items with MOQ.</p>
                </div>
                <Link
                  to="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg hover:bg-[#123e2c] transition-colors"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex gap-4 p-3 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    onError={(e) => handleImageError(e)}
                    className="w-16 h-16 object-cover rounded-md border border-stone-200 shrink-0 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-stone-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">Size: {item.selectedSize}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 50)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 50)}
                          className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#174D37] tabular-nums font-mono">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-bold text-stone-900 tabular-nums font-mono">৳{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Delivery fee calculated at checkout (Dhaka: ৳80, Outside Dhaka: ৳150).
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-2.5 px-3 text-xs font-semibold text-stone-800 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-2.5 px-3 text-xs font-semibold text-white bg-[#174D37] rounded-lg hover:bg-[#123e2c] transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
