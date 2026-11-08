import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Truck,
  Leaf,
  Layers,
  Star
} from 'lucide-react';
import { API, showToast } from '../services/api.js';
import { Product } from '../types/index.js';
import { useCart } from '../contexts/CartContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { getImageUrl, handleImageError } from '../utils/image.js';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(500);
  const [withCustomLogo, setWithCustomLogo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          const p = res.data.product;
          setProduct(p);
          setRelated(res.data.related || []);
          setSelectedImage(p.images && p.images.length > 0 ? p.images[0] : '');
          setSelectedSize(p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'Standard');
          setQuantity(p.moq || 500);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-4/3 bg-stone-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-200 rounded w-1/4" />
            <div className="h-20 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500">The packaging item you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg">
          Back to Products
        </Link>
      </div>
    );
  }

  // Dynamic tier discount
  const getBulkMultiplier = (qty: number) => {
    if (qty >= 10000) return 0.88; // 12% off
    if (qty >= 5000) return 0.92;  // 8% off
    if (qty >= 2000) return 0.96;  // 4% off
    return 1.0;
  };

  const unitPrice = product.price * getBulkMultiplier(quantity);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
  };

  const handleOrderNow = () => {
    addToCart(product, quantity, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb - Clean unboxed text with / separator */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-stone-900">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.categorySlug}`} className="hover:text-stone-900">{product.category}</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src={getImageUrl(selectedImage)}
              alt={product.name}
              onError={(e) => handleImageError(e)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-[#174D37] shadow-xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${product.name} thumb ${idx}`}
                    onError={(e) => handleImageError(e)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Module (7 Cols) */}
        <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="font-semibold text-[#174D37] uppercase tracking-wider">{product.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {product.rating} ({product.reviewsCount} customer reviews)
              </span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">{product.stockStatus}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-[#F8FAF5] border border-stone-200 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="text-xs text-stone-500 uppercase tracking-wider block">Estimated Unit Price</span>
              <div className="text-3xl font-bold text-[#174D37] tabular-nums font-mono">
                ৳{unitPrice.toFixed(2)}
                <span className="text-xs font-normal text-stone-500 ml-1">/ piece</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 uppercase tracking-wider block">Total Estimated</span>
              <div className="text-xl font-bold text-stone-900 tabular-nums font-mono">
                ৳{totalPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Available Packaging Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                      selectedSize === s
                        ? 'border-[#174D37] bg-[#174D37] text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material & Specs */}
          <div className="space-y-2 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-lg border border-stone-200">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#174D37] shrink-0" />
              <span><strong>Material Spec:</strong> {product.material}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#174D37] shrink-0" />
              <span><strong>Compliance:</strong> 100% Certified Food Grade & Greaseproof</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#174D37] shrink-0" />
              <span><strong>Sustainability:</strong> Biodegradable virgin unbleached pulp</span>
            </div>
          </div>

          {/* Custom Logo Checkbox */}
          {product.isCustomizable && (
            <label className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={withCustomLogo}
                onChange={(e) => setWithCustomLogo(e.target.checked)}
                className="mt-0.5 rounded text-[#174D37] focus:ring-[#174D37]"
              />
              <div className="text-xs">
                <span className="font-bold text-emerald-900 block">
                  Add Custom Restaurant Logo Printing
                </span>
                <span className="text-emerald-700 text-[11px]">
                  Our designers will reach out for your vector file or PNG after placing this order.
                </span>
              </div>
            </label>
          )}

          {/* Quantity Stepper & MOQ */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800 uppercase tracking-wider">
                Order Quantity (Pcs)
              </span>
              <span className="text-stone-500 font-medium">
                Minimum Order Quantity: <strong className="text-stone-800">{product.moq} pcs</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(product.moq, q - (product.moq >= 500 ? 250 : 50)))}
                  className="px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min={product.moq}
                  step={50}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value) || product.moq))}
                  className="w-24 text-center text-sm font-bold text-stone-900 focus:outline-none tabular-nums font-mono"
                />
                <button
                  onClick={() => setQuantity((q) => q + (product.moq >= 500 ? 250 : 50))}
                  className="px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
                >
                  +
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1 text-xs">
                {[product.moq, product.moq * 2, product.moq * 5, 10000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setQuantity(preset)}
                    className={`px-2.5 py-1.5 rounded text-[11px] font-mono transition-colors ${
                      quantity === preset ? 'bg-stone-900 text-white font-bold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 text-xs font-semibold text-stone-800 bg-white border-2 border-[#174D37] rounded-lg hover:bg-[#174D37]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#174D37]" />
              Add to Cart ({quantity} pcs)
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              Order Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Custom Quote Link */}
          <div className="pt-2 text-center">
            <Link
              to={`/custom-packaging?product=${encodeURIComponent(product.name)}`}
              className="text-xs text-[#174D37] hover:underline font-semibold"
            >
              Need a custom dimension or 20,000+ pcs contract? Request Custom B2B Quotation &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-stone-200">
          <h3 className="text-xl font-bold text-stone-900 font-serif-brand">
            Related {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
