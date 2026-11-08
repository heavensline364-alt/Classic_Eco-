import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Box,
  Layers,
  FileCheck
} from 'lucide-react';
import { API } from '../services/api.js';
import { Product, Category, Testimonial, FAQ } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { getImageUrl, handleImageError } from '../utils/image.js';

const heroShowcaseItems = [
  {
    title: 'All Products',
    image: '/assets/aistudio/721224390_1307701234897509_5494655543120045704_n_d91e11f9.jpg'
  },
  {
    title: 'Pizza Boxes',
    image: '/assets/aistudio/576123137_1135388445462123_728576114768601119_n_b3eb8401.jpg'
  },
  {
    title: 'Burger Boxes',
    image: '/assets/aistudio/573545226_1131316062536028_5369013656857067366_n_7e13fa43.jpg'
  },
  {
    title: 'Kraft Bags',
    image: '/assets/aistudio/475576584_917925027208467_1462850462188352454_n_57279f78.jpg'
  },
  {
    title: 'Shawarma Boxes',
    image: '/assets/aistudio/475647917_917898843877752_1503328799674608950_n_d96fd093.jpg'
  },
  {
    title: 'Luxury Cake Box',
    image: '/assets/images/luxury_cake_box_1794165037904.jpg'
  }
];

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeHeroImage, setActiveHeroImage] = useState(heroShowcaseItems[0].image);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catRes, prodRes, testRes, faqRes] = await Promise.all([
          API.get('/products/categories/all'),
          API.get('/products?featured=true&limit=6'),
          API.get('/testimonials'),
          API.get('/faqs')
        ]);

        if (catRes.data.success) setCategories(catRes.data.categories);
        if (prodRes.data.success) setFeaturedProducts(prodRes.data.products);
        if (testRes.data.success) setTestimonials(testRes.data.testimonials);
        if (faqRes.data.success) {
          setFaqs(faqRes.data.faqs);
          if (faqRes.data.faqs.length > 0) setOpenFaq(faqRes.data.faqs[0].id);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#174D37] text-white overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#113929] via-[#174D37] to-[#1d5c43] opacity-95" />
        <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#5A9B69]/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Text Col (5 Cols on LG, balanced reading length) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-md text-xs font-semibold text-[#E8DFC9] tracking-wide border border-white/10">
                <Leaf className="w-3.5 h-3.5 text-[#5A9B69]" />
                Bangladesh's Trusted Eco Restaurant Packaging Partner
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.15] font-serif-brand">
                Premium Packaging That Builds Your Brand.
              </h1>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed">
                One-stop customized restaurant packaging solutions for Restaurants, Cafes, Juice Bars, and Cloud Kitchens across Bangladesh. High-grade corrugated pizza boxes, burger boxes, leak-proof cups, and branded takeaway bags.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 text-sm font-semibold text-[#174D37] bg-white hover:bg-[#F8FAF5] rounded-lg transition-all shadow-lg flex items-center gap-2 group active:scale-95 font-sans-brand"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/custom-packaging"
                  className="px-6 py-3.5 text-sm font-semibold text-[#E8DFC9] bg-[#5A9B69]/30 hover:bg-[#5A9B69]/40 border border-[#E8DFC9]/40 rounded-lg transition-all backdrop-blur-xs active:scale-95"
                >
                  Request Custom Quote
                </Link>
              </div>

              {/* Trust Badges Strip */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5A9B69] shrink-0" />
                  <span>100% Food-Grade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5A9B69] shrink-0" />
                  <span>Custom Logo Print</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#5A9B69] shrink-0" />
                  <span>Nationwide Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A9B69] shrink-0" />
                  <span>Wholesale Pricing</span>
                </div>
              </div>
            </div>

            {/* Visual Showcase Col (7 Cols on LG - Grand, commanding, prominent packaging showcase) */}
            <div className="lg:col-span-7 relative">
              <div className="relative mx-auto w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-stone-900 group min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] xl:min-h-[580px] aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src={getImageUrl(activeHeroImage)}
                  alt="Classic Eco Product Packaging Showcase"
                  onError={(e) => handleImageError(e)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {/* Gradient Overlay & Info Pill */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                  <div className="text-white space-y-2 max-w-xl">
                    <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-[#E8DFC9] bg-black/50 px-2.5 py-1 rounded backdrop-blur-md border border-white/10">
                      Factory Direct Showroom · Shop 3/11, Kakrail, Dhaka
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif-brand">
                      Smart Packaging, Better Business
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                      Food-grade certified, greaseproof virgin kraft boxes, cups & bags. Custom die-cut & multi-color printing tailored to Bangladesh's best restaurants.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Packaging Preview Switcher */}
              <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {heroShowcaseItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHeroImage(item.image)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all shrink-0 cursor-pointer ${
                      activeHeroImage === item.image
                        ? 'bg-white text-[#174D37] border-white font-bold shadow-lg scale-102'
                        : 'bg-white/10 text-stone-200 border-white/15 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      onError={(e) => handleImageError(e)}
                      className="w-7 h-7 object-cover rounded shadow-2xs shrink-0"
                    />
                    <span className="whitespace-nowrap text-[12px]">{item.title}</span>
                  </button>
                ))}
              </div>

              {/* Floating Quality Badge */}
              <div className="hidden sm:flex absolute -bottom-6 -left-4 bg-white text-stone-900 p-4 rounded-xl shadow-2xl border border-stone-200/80 items-center gap-3.5 z-10">
                <div className="w-10 h-10 rounded-full bg-[#174D37] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  5★
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">250+ Restaurant Brands</div>
                  <div className="text-[11px] text-stone-500">Served with pride across 64 districts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-[#174D37] uppercase tracking-wider mb-1">
              Complete Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
              Featured Product Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-[#174D37] hover:underline flex items-center gap-1"
          >
            Browse all categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-[#174D37]/40 hover:shadow-md transition-all flex flex-col items-center p-3 text-center"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-stone-100 mb-3">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  onError={(e) => handleImageError(e)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-stone-900 group-hover:text-[#174D37] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-500 mt-0.5">Explore Line</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US? */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
              The Classic Eco Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif-brand">
              Why Bangladesh's Leading Food Brands Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Food-Grade Certified</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Manufactured from 100% virgin kraft paper and food-safe barrier coatings. Non-toxic, greaseproof, and odor-free for hot culinary delivery.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Custom Branding</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Offset and flexographic multi-color printing, metallic gold foil stamping, spot UV, and embossing to make your restaurant identity memorable.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Direct Factory Price</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Transparent tiered wholesale rates without middleman markups. Scalable MOQ starting from 500 pcs to 50,000+ pcs with volume discounts.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Nationwide Delivery</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Next-day delivery inside Dhaka and reliable courier dispatch to Chittagong, Sylhet, Rajshahi, Khulna, Barishal, and Rangpur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#174D37] uppercase tracking-wider mb-1">
              Top Wholesale Picks
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
              Featured Packaging Products
            </h2>
          </div>
          <Link
            to="/products"
            className="px-4 py-2 text-xs font-semibold text-[#174D37] border border-[#174D37] rounded-lg hover:bg-[#174D37] hover:text-white transition-colors"
          >
            View Full Catalog
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 space-y-4 animate-pulse">
                <div className="w-full aspect-4/3 bg-stone-200 rounded-lg" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-8 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. CUSTOM PACKAGING SOLUTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#174D37] text-white rounded-2xl overflow-hidden shadow-xl border border-[#236a4d]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8DFC9]">
                Bespoke Printing & Manufacturing
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight font-serif-brand">
                Turn Every Food Delivery Into a Walking Billboard
              </h2>
              <p className="text-sm text-stone-200 leading-relaxed">
                Whether you need luxury black & gold pizza boxes, triangular shawarma sleeves, or greaseproof burger boxes with your custom QR menu printed on the lid, our Kakrail production team ensures crisp colors and rigid paperboard construction.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A9B69]" />
                  <span>Free Die-Cut Plate Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A9B69]" />
                  <span>Full-Color Offset Printing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A9B69]" />
                  <span>Gold & Silver Foil Stamping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A9B69]" />
                  <span>Sample Box Review Before Run</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/custom-packaging"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-[#174D37] bg-white rounded-lg hover:bg-[#F8FAF5] transition-all shadow-md active:scale-95"
                >
                  Start Custom Order Inquiry
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-full min-h-[300px] relative bg-stone-900">
              <img
                src={getImageUrl('/assets/aistudio/576123137_1135388445462123_728576114768601119_n_b3eb8401.jpg')}
                alt="Custom Pizza Box Stack"
                onError={(e) => handleImageError(e)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif-brand">
            How Custom Ordering Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 relative">
            <span className="text-3xl font-extrabold text-[#174D37]/20 font-serif-brand">01</span>
            <h3 className="text-base font-bold text-stone-900 mt-2">Choose Product</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Select your required box size, cup volume, or takeaway bag dimensions from our catalog.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 relative">
            <span className="text-3xl font-extrabold text-[#174D37]/20 font-serif-brand">02</span>
            <h3 className="text-base font-bold text-stone-900 mt-2">Share Your Design</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Upload your restaurant logo, artwork, or rough sketch along with paper preference.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 relative">
            <span className="text-3xl font-extrabold text-[#174D37]/20 font-serif-brand">03</span>
            <h3 className="text-base font-bold text-stone-900 mt-2">Get B2B Quote</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Our packaging manager reviews your dimensions and provides competitive unit & bulk rates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 relative">
            <span className="text-3xl font-extrabold text-[#174D37]/20 font-serif-brand">04</span>
            <h3 className="text-base font-bold text-stone-900 mt-2">Confirm & Deliver</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Approve your digital proof sample. Production begins and delivers nationwide within 5-7 days.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BUSINESS STATISTICS */}
      <section className="bg-white py-12 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#174D37] tabular-nums font-sans-brand">
                250+
              </div>
              <div className="text-xs text-stone-500 font-medium mt-1">Restaurants & Cloud Kitchens</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#174D37] tabular-nums font-sans-brand">
                1.2M+
              </div>
              <div className="text-xs text-stone-500 font-medium mt-1">Boxes & Bags Produced</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#174D37] tabular-nums font-sans-brand">
                64
              </div>
              <div className="text-xs text-stone-500 font-medium mt-1">Districts Nationwide Coverage</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#174D37] tabular-nums font-sans-brand">
                99.4%
              </div>
              <div className="text-xs text-stone-500 font-medium mt-1">On-Time Delivery Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
            Verified Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif-brand">
            What Restaurant Owners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-stone-100 mt-6">
                <div className="w-9 h-9 rounded-full bg-[#174D37] text-[#E8DFC9] flex items-center justify-center font-bold text-xs shrink-0">
                  {t.avatar || t.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                  <p className="text-[11px] text-stone-500">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif-brand">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-semibold text-stone-900 text-sm hover:text-[#174D37] transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    openFaq === faq.id ? 'rotate-180 text-[#174D37]' : 'text-stone-400'
                  }`}
                />
              </button>
              {openFaq === faq.id && (
                <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. CONTACT CTA STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E8DFC9] rounded-2xl p-8 sm:p-12 text-[#202820] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold font-serif-brand">
              Need physical box samples before placing a bulk order?
            </h3>
            <p className="text-xs sm:text-sm text-stone-700">
              Visit our showroom at Karnophuli Garden City, Shop 3/11, Kakrail, Dhaka or call our team.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:01637778889"
              className="px-5 py-3 text-xs font-bold text-white bg-[#174D37] rounded-lg hover:bg-[#123e2c] transition-all shadow-xs"
            >
              Call 0163 777 888 9
            </a>
            <Link
              to="/contact"
              className="px-5 py-3 text-xs font-bold text-stone-900 bg-white border border-stone-400 rounded-lg hover:bg-stone-50 transition-all"
            >
              View Location Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
