import React, { useState } from 'react';
import { Phone, MapPin, Mail, Facebook, Send, Clock, CheckCircle2 } from 'lucide-react';
import { API, showToast } from '../services/api.js';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Wholesale Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      showToast('Please provide your name, phone number, and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
        showToast('Your message has been sent successfully!');
        setFormData({ name: '', phone: '', email: '', subject: 'General Wholesale Inquiry', message: '' });
      }
    } catch (err: any) {
      console.error('Failed to submit message:', err);
      showToast('Failed to submit message. Please call our hotline.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-3xl font-bold text-stone-900 font-serif-brand">
          Contact Classic Eco Product & Packaging
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Have an inquiry about wholesale rates, custom box dimensions, or visiting our Kakrail showroom? We'd love to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Showroom & Helpline
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Showroom Address</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    Karnophuli Garden City Shopping Complex,<br />
                    Shop: 3/11, 109 Kakrail, Dhaka, Bangladesh.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Direct Helpline / WhatsApp</h4>
                  <a
                    href="tel:01637778889"
                    className="text-stone-800 hover:text-[#174D37] font-semibold text-sm mt-0.5 block"
                  >
                    0163 777 888 9
                  </a>
                  <span className="text-[11px] text-stone-400">Available 9:00 AM – 9:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center shrink-0">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Official Facebook Page</h4>
                  <a
                    href="https://www.facebook.com/ClassicEcoProducts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#174D37] hover:underline font-medium mt-0.5 block"
                  >
                    facebook.com/ClassicEcoProducts
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#174D37]/10 text-[#174D37] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Showroom Hours</h4>
                  <p className="text-stone-600 mt-0.5">
                    Saturday to Thursday: 10:00 AM – 8:30 PM<br />
                    Friday: Closed (Orders dispatched via courier)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Visual Embed Frame */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-2xs bg-stone-100">
            <div className="bg-[#174D37] text-white p-3 text-xs flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5A9B69]" />
                Karnophuli Garden City, Kakrail
              </span>
              <a
                href="https://maps.google.com/?q=Karnaphuli+Garden+City+Shopping+Complex+Kakrail+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#E8DFC9] hover:underline font-semibold"
              >
                Open in Maps &rarr;
              </a>
            </div>
            <div className="relative aspect-16/9 bg-stone-200">
              <iframe
                title="Classic Eco Showroom Kakrail Location"
                src="https://maps.google.com/maps?q=Karnaphuli%20Garden%20City%20Shopping%20Complex,%20Kakrail,%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif-brand">
              Send an Inquiry Message
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Leave your contact and inquiry specifications. Our representative will respond within a few hours.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Thank you! Your message has been received. Our sales executive will call you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mahfuzur Rahman"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. contact@restaurant.bd"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white cursor-pointer"
                >
                  <option value="General Wholesale Inquiry">General Wholesale Inquiry</option>
                  <option value="Custom Logo Printing on Pizza Boxes">Custom Logo Printing on Pizza Boxes</option>
                  <option value="Burger & Shawarma Packaging">Burger & Shawarma Packaging</option>
                  <option value="Bulk Order Quotation">Bulk Order Quotation</option>
                  <option value="Showroom Visit Appointment">Showroom Visit Appointment</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Your Message / Product Inquiries <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your packaging requirements, sizes needed, estimated quantities, or questions..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] active:scale-95 rounded-lg transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
