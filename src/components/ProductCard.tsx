import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, Star } from 'lucide-react';
import { Product } from '../types/index.js';
import { useCart } from '../contexts/CartContext.js';

import { getImageUrl, handleImageError } from '../utils/image.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const rawImage = product.images && product.images.length > 0 ? product.images[0] : '/assets/images/eco_paper_coffee_cups_1794165037979.jpg';
  const mainImage = getImageUrl(rawImage);

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-[#174D37]/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Slot */}
      <Link to={`/products/${product.id}`} className="relative block aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={mainImage}
          alt={product.name}
          onError={(e) => handleImageError(e)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Subtle Stock indicator in unboxed minimalist style */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-semibold text-stone-800 shadow-2xs">
          {product.category}
        </div>
        {product.isCustomizable && (
          <div className="absolute top-3 right-3 bg-[#174D37]/90 text-[#E8DFC9] backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-medium tracking-wide">
            Custom Logo Available
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Metadata line with subtle dot separator - Zero Pill */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <span>MOQ: {product.moq.toLocaleString()} pcs</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {product.rating.toFixed(1)} ({product.reviewsCount})
            </span>
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-[#174D37] transition-colors">
            <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">Unit Price</div>
            <div className="text-lg font-bold text-[#174D37] tabular-nums font-sans-brand">
              ৳{product.price.toFixed(2)}
              <span className="text-xs text-stone-500 font-normal ml-1">/ pc</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToCart(product)}
              className="p-2.5 text-stone-700 bg-stone-100 hover:bg-[#174D37] hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Add to Cart with Minimum Order Quantity"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link
              to={`/products/${product.id}`}
              className="px-3 py-2 text-xs font-semibold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors flex items-center gap-1"
            >
              Details
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
