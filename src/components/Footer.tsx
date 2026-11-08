import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Facebook, CheckCircle2, Shield, Leaf } from 'lucide-react';
import { getImageUrl, handleImageError } from '../utils/image.js';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#123828] text-stone-300 pt-16 pb-12 border-t border-[#1b4b37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1b4b37]">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl('/assets/aistudio/577808670_1136679895332978_3351486785696396189_n_b821f9ce.jpg')}
                alt="Classic Eco"
                onError={(e) => handleImageError(e)}
                className="w-10 h-10 object-contain rounded-full bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold tracking-tight text-white font-serif-brand">
                Classic Eco
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Premium & Customized Restaurant Packaging Solution in Bangladesh. We manufacture food-grade pizza boxes, burger boxes, cake boxes, paper cups, and takeaway bags with precision logo printing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/ClassicEcoProducts/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1b4b37] hover:bg-[#5A9B69] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="tel:01637778889"
                className="w-9 h-9 rounded-full bg-[#1b4b37] hover:bg-[#5A9B69] text-white flex items-center justify-center transition-colors"
                aria-label="Call Direct"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans-brand">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Product Catalog</Link>
              </li>
              <li>
                <Link to="/custom-packaging" className="hover:text-white transition-colors">Request Custom Quote</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">Track Your Order</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Classic Eco</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Showroom & Contact</Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-[#5A9B69] transition-colors text-stone-400">
                  Staff Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Packaging Solutions */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans-brand">
              Packaging Lines
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link to="/products?category=pizza-boxes" className="hover:text-white transition-colors">
                  Corrugated Pizza Boxes
                </Link>
              </li>
              <li>
                <Link to="/products?category=burger-boxes" className="hover:text-white transition-colors">
                  Burger & Meal Takeaway Boxes
                </Link>
              </li>
              <li>
                <Link to="/products?category=cake-boxes" className="hover:text-white transition-colors">
                  Luxury Window Cake Boxes
                </Link>
              </li>
              <li>
                <Link to="/products?category=paper-cups" className="hover:text-white transition-colors">
                  Ripple Coffee Cups & Organizers
                </Link>
              </li>
              <li>
                <Link to="/products?category=paper-bags" className="hover:text-white transition-colors">
                  Twisted Handle Kraft Bags
                </Link>
              </li>
              <li>
                <Link to="/products?category=custom-packaging" className="hover:text-white transition-colors">
                  Doner & Shawarma Packaging
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Showroom & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase font-sans-brand">
              Kakrail Showroom
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#5A9B69] shrink-0 mt-0.5" />
                <span>
                  Karnophuli Garden City Shopping Complex, Shop: 3/11, 109 Kakrail, Dhaka, Bangladesh.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#5A9B69] shrink-0" />
                <a href="tel:01637778889" className="hover:text-white font-medium">
                  0163 777 888 9
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#5A9B69] shrink-0" />
                <a href="mailto:info@classiceco.com" className="hover:text-white">
                  info@classiceco.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-1.5 text-[11px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5A9B69]" />
                <span>100% Food Grade Certified Paper</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#5A9B69]" />
                <span>Biodegradable & Recyclable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#5A9B69]" />
                <span>Trusted by 250+ Restaurants in BD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Classic Eco Product & Packaging. All rights reserved.</p>
          <p className="text-[11px]">
            Smart Packaging, Better Business · Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};
