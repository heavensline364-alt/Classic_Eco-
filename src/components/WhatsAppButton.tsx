import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
      {/* Phone Call Button */}
      <a
        href="tel:01637778889"
        className="flex items-center gap-2 bg-[#174D37] text-white px-3.5 py-2.5 rounded-full shadow-lg hover:bg-[#123e2c] active:scale-95 transition-all text-xs font-semibold"
        title="Call Hotline 0163 777 888 9"
      >
        <Phone className="w-4 h-4 text-[#5A9B69]" />
        <span className="hidden sm:inline">0163 777 888 9</span>
      </a>

      {/* WhatsApp Chat Button */}
      <a
        href="https://wa.me/8801637778889?text=Hello%20Classic%20Eco,%20I%20am%20interested%20in%20restaurant%20packaging%20supplies."
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] text-white p-3 rounded-full shadow-xl hover:bg-[#20ba59] active:scale-95 transition-all text-xs font-semibold"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-white" />
        <span className="hidden md:inline font-bold">WhatsApp Us</span>
      </a>
    </div>
  );
};
