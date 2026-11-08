import React from 'react';
import { Phone, MapPin, Truck } from 'lucide-react';

export const TopBanner: React.FC = () => {
  return (
    <div className="bg-[#174D37] text-[#E8DFC9] text-xs py-2 px-4 border-b border-[#25684d]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 font-medium">
            <Truck className="w-3.5 h-3.5 text-[#5A9B69]" />
            Nationwide Delivery Available Across Bangladesh
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-[#5A9B69]" />
            Shop 3/11, Karnophuli Garden City, Kakrail, Dhaka
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:01637778889"
            className="flex items-center gap-1.5 font-semibold text-white hover:text-[#5A9B69] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#5A9B69]" />
            0163 777 888 9
          </a>
          <span className="hidden sm:inline text-stone-400">·</span>
          <a
            href="https://www.facebook.com/ClassicEcoProducts/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline hover:underline text-stone-200"
          >
            fb.com/ClassicEcoProducts
          </a>
        </div>
      </div>
    </div>
  );
};
