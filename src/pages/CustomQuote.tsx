import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Upload,
  CheckCircle2,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { API, showAlert, showToast } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';

export const CustomQuote: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillProduct = searchParams.get('product') || 'Corrugated Pizza Box';
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    productType: prefillProduct,
    requiredQuantity: '2,000 Pcs',
    packagingSize: '10 x 10 x 1.75 Inches',
    materialPreference: 'Virgin Kraft Corrugated Board (180 GSM)',
    instructions: ''
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image size exceeds 8MB limit', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.businessName || !formData.phone || !formData.productType) {
      showToast('Please fill out all mandatory contact and product fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/quotes', {
        ...formData,
        logoFile: logoPreview,
        userId: user?.id || null
      });

      if (res.data.success) {
        setSubmittedInquiry(res.data.quote);
        showAlert(
          'Inquiry Submitted Successfully!',
          `Your inquiry ID is ${res.data.inquiryId}. Our packaging team in Kakrail will review your dimensions and logo specifications within 24 hours.`,
          'success'
        );
      }
    } catch (err: any) {
      console.error('Failed to submit quote:', err);
      showToast(err.response?.data?.message || 'Failed to submit quote inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#174D37] uppercase tracking-wider">
          Direct Factory Quotation
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-serif-brand">
          Request Custom Packaging & Logo Printing
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Provide your specifications, target quantities, and restaurant logo. We will compute the exact plate setup cost, per-unit price, and estimated delivery schedule.
        </p>
      </div>

      {submittedInquiry ? (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-8 sm:p-10 shadow-lg text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Inquiry Received</span>
            <h2 className="text-2xl font-bold text-stone-900 mt-1 font-serif-brand">
              Inquiry Reference: <span className="font-mono text-[#174D37]">{submittedInquiry.id}</span>
            </h2>
            <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto">
              Thank you, <strong>{submittedInquiry.name}</strong> from <strong>{submittedInquiry.businessName}</strong>. Our senior packaging estimator will reach out to <strong>{submittedInquiry.phone}</strong> with a detailed quotation.
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 text-xs text-left space-y-2 border border-stone-200">
            <div className="flex justify-between">
              <span className="text-stone-500">Product Line:</span>
              <span className="font-semibold text-stone-800">{submittedInquiry.productType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Requested Volume:</span>
              <span className="font-semibold text-stone-800">{submittedInquiry.requiredQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Dimensions:</span>
              <span className="font-semibold text-stone-800">{submittedInquiry.packagingSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Current Status:</span>
              <span className="font-bold text-amber-600 uppercase font-mono">{submittedInquiry.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedInquiry(null);
                setLogoPreview(null);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Submit Another Inquiry
            </button>
            <Link
              to="/products"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors"
            >
              Browse Standard Products
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-8">
          {/* Section 1: Business & Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              1. Contact & Restaurant Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Restaurant / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Burger Craft Dhaka"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Phone Number (Active WhatsApp) <span className="text-red-500">*</span>
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

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. info@burgercraft.bd"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Packaging Specifications */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              2. Packaging Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Product Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white cursor-pointer"
                >
                  <option value="Corrugated Pizza Box">Corrugated Pizza Box</option>
                  <option value="Burger & Sandwich Box">Burger & Sandwich Box</option>
                  <option value="Cake & Confectionery Box">Cake & Confectionery Box</option>
                  <option value="Paper Coffee Cup (Ripple/Double Wall)">Paper Coffee Cup (Ripple/Double Wall)</option>
                  <option value="Kraft Delivery Bag with Twisted Handle">Kraft Delivery Bag with Twisted Handle</option>
                  <option value="Doner & Shawarma Sleeve Box">Doner & Shawarma Sleeve Box</option>
                  <option value="3-Compartment Bento Lunch Box">3-Compartment Bento Lunch Box</option>
                  <option value="French Fry & Snack Pouch">French Fry & Snack Pouch</option>
                  <option value="Other Custom Shape">Other Custom Shape</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Required Volume / Quantity <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.requiredQuantity}
                  onChange={(e) => setFormData({ ...formData, requiredQuantity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white cursor-pointer"
                >
                  <option value="500 Pcs (Pilot Run)">500 Pcs (Pilot Run)</option>
                  <option value="1,000 Pcs">1,000 Pcs</option>
                  <option value="2,000 Pcs">2,000 Pcs</option>
                  <option value="5,000 Pcs (Recommended for best pricing)">5,000 Pcs (Recommended for best pricing)</option>
                  <option value="10,000 Pcs">10,000 Pcs</option>
                  <option value="25,000+ Pcs (Contract Manufacturing)">25,000+ Pcs (Contract Manufacturing)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Desired Dimensions (L x W x H in inches or cm)
                </label>
                <input
                  type="text"
                  value={formData.packagingSize}
                  onChange={(e) => setFormData({ ...formData, packagingSize: e.target.value })}
                  placeholder="e.g. 10 x 10 x 1.75 Inches"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Material & Paper Preference
                </label>
                <select
                  value={formData.materialPreference}
                  onChange={(e) => setFormData({ ...formData, materialPreference: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white cursor-pointer"
                >
                  <option value="Virgin Kraft Corrugated Board (180 GSM)">Virgin Kraft Corrugated Board (180 GSM)</option>
                  <option value="Food Grade PE-Coated Duplex Board (300 GSM)">Food Grade PE-Coated Duplex Board (300 GSM)</option>
                  <option value="White Bleached Ivory Board (350 GSM)">White Bleached Ivory Board (350 GSM)</option>
                  <option value="Natural Unbleached Eco Kraft (140 GSM)">Natural Unbleached Eco Kraft (140 GSM)</option>
                  <option value="Rigid Metallic Foil Stamped Luxury Board">Rigid Metallic Foil Stamped Luxury Board</option>
                  <option value="Need Recommendation from Classic Eco Expert">Need Recommendation from Classic Eco Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Logo / Artwork Upload */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-200 pb-2">
              3. Custom Logo / Artwork File
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <label className="border-2 border-dashed border-stone-300 hover:border-[#174D37] rounded-xl p-6 text-center cursor-pointer bg-stone-50 transition-colors flex flex-col items-center justify-center space-y-2">
                <Upload className="w-8 h-8 text-stone-400" />
                <span className="text-xs font-bold text-stone-800">Upload Logo or Box Layout</span>
                <span className="text-[11px] text-stone-500">PNG, JPG, PDF up to 8MB</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Preview */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 h-full flex flex-col items-center justify-center min-h-[140px]">
                {logoPreview ? (
                  <div className="text-center space-y-2">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-24 max-w-full object-contain mx-auto rounded shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setLogoPreview(null)}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 text-center">
                    No artwork attached yet.<br />You can also send your logo later via WhatsApp.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Additional Instructions or Branding Notes
              </label>
              <textarea
                rows={3}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Mention special finishes (e.g., gold foil logo on top, ventilation holes, inner greaseproof parchment, QR code for social media)..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] active:scale-95 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Generating Quotation Request...' : 'Submit Custom Quotation Request'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-stone-400 mt-2">
              By submitting, your inquiry will be assigned a unique inquiry ID and logged in our system.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
