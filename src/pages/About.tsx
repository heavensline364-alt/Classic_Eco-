import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Leaf, Factory, Users, Award, ArrowRight } from 'lucide-react';
import { getImageUrl, handleImageError } from '../utils/image.js';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-[#174D37] text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E8DFC9]">
            Our Story & Craftsmanship
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-brand">
            Empowering Bangladesh's Food Industry with World-Class Packaging
          </h1>
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-2xl mx-auto">
            Founded with a passion for restaurant branding and sustainable materials, Classic Eco Product & Packaging is the premier partner for restaurants, cafes, juice bars, and cloud kitchens nationwide.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
              Who We Are
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand leading-snug">
              From Kakrail, Dhaka to Every Dining Table in Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Based out of our flagship showroom in Karnophuli Garden City, Kakrail, Dhaka, Classic Eco provides an integrated manufacturing and design service. We noticed that Bangladeshi food brands often struggled with soggy burger boxes, flimsy pizza cartons that collapsed during motorcycle courier transit, and low-resolution printing.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We changed that standard by introducing heavy-duty corrugated board, precision laser die-cutting, high-definition flexo and offset multi-color printing, and certified food-grade interior barrier coatings.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="font-bold text-stone-900 text-sm">Our Mission</div>
                <p className="text-stone-500 mt-1">To deliver hygienic, rigid, and eco-friendly packaging that boosts brand prestige.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <div className="font-bold text-stone-900 text-sm">Our Vision</div>
                <p className="text-stone-500 mt-1">To make sustainable, biodegradable restaurant packaging accessible and affordable across all 64 districts.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-900">
              <img
                src={getImageUrl('/assets/aistudio/721224390_1307701234897509_5494655543120045704_n_d91e11f9.jpg')}
                alt="Classic Eco Product range"
                onError={(e) => handleImageError(e)}
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitments */}
      <section className="bg-white py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
              Uncompromising Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif-brand">
              Our 4 Pillars of Product Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#174D37]" />
              <h3 className="font-bold text-stone-900 text-sm">Food-Grade Safety</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every board and coating is free from harmful chemical dyes, chlorine bleaching, and heavy metals.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 space-y-3">
              <Leaf className="w-8 h-8 text-[#174D37]" />
              <h3 className="font-bold text-stone-900 text-sm">Eco & Biodegradable</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We favor unbleached brown kraft and water-based inks that decompose naturally without polluting waterways.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 space-y-3">
              <Factory className="w-8 h-8 text-[#174D37]" />
              <h3 className="font-bold text-stone-900 text-sm">Precision Engineering</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tear-resistant creases, secure tuck-tops, steam release vents, and stackable structures built for delivery bikes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8FAF5] border border-stone-200 space-y-3">
              <Award className="w-8 h-8 text-[#174D37]" />
              <h3 className="font-bold text-stone-900 text-sm">Brand Customization</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                From subtle minimalist typography to multi-color vibrant artwork and metallic gold foil embossing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif-brand">
          Ready to Upgrade Your Food Packaging?
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
          Contact our team for free sample boxes, custom die-lines, and wholesale pricing.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/custom-packaging"
            className="px-6 py-3 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors shadow-xs"
          >
            Request Custom Quotation
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 text-xs font-bold text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors"
          >
            Visit Kakrail Showroom
          </Link>
        </div>
      </section>
    </div>
  );
};
