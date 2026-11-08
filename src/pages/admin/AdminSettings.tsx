import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { API, showToast } from '../../services/api.js';
import { WebsiteSettings } from '../../types/index.js';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: 'Classic Eco Product & Packaging',
    phone: '0163 777 888 9',
    secondaryPhone: '01637778889',
    email: 'info@classiceco.com',
    address: 'Karnophuli Garden City Shopping Complex, Shop: 3/11, 109 Kakrail, Dhaka, Bangladesh',
    facebookUrl: 'https://www.facebook.com/ClassicEcoProducts/',
    deliveryDhaka: 80,
    deliveryOutside: 150,
    freeDeliveryThreshold: 5000,
    bkashNumber: '01637778889',
    bkashType: 'Personal / Send Money or Merchant',
    nagadNumber: '01637778889',
    nagadType: 'Personal / Send Money',
    heroTitle: 'Premium Packaging That Builds Your Brand',
    heroSubtitle: 'One-stop customized restaurant packaging solution in Bangladesh. Food-grade, eco-friendly pizza boxes, burger boxes, cups, and takeaway bags with custom logo printing.',
    seoTitle: 'Classic Eco Product & Packaging - Premium Restaurant Packaging Bangladesh',
    seoDescription: 'Wholesale restaurant packaging manufacturer in Dhaka, Bangladesh. Custom pizza boxes, burger boxes, paper cups, takeaway bags.'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/settings')
      .then((res) => {
        if (res.data.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/settings', settings);
      if (res.data.success) {
        showToast('Website configuration saved successfully!');
      }
    } catch (err: any) {
      showToast('Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-stone-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
          System & Business Settings
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure delivery fees, hotline numbers, bKash accounts, and SEO parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-2xs">
        {/* Business details */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            1. Business Identity & Showroom
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Company Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Hotline Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-stone-700 block mb-1">Showroom Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-stone-700 block mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            2. Nationwide Delivery Rates (BDT ৳)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Inside Dhaka Fee (৳)</label>
              <input
                type="number"
                value={settings.deliveryDhaka}
                onChange={(e) => setSettings({ ...settings, deliveryDhaka: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Outside Dhaka Fee (৳)</label>
              <input
                type="number"
                value={settings.deliveryOutside}
                onChange={(e) => setSettings({ ...settings, deliveryOutside: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Free Delivery Threshold (৳)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
          </div>
        </div>

        {/* bKash & Nagad Accounts */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            3. Manual Payment Receiving Accounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">bKash Account Number</label>
              <input
                type="text"
                value={settings.bkashNumber}
                onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Nagad Account Number</label>
              <input
                type="text"
                value={settings.nagadNumber}
                onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
          </div>
        </div>

        {/* Hero & SEO */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
            4. Homepage Hero & SEO
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Homepage Hero Headline</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Hero Subtitle</label>
              <textarea
                rows={2}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">SEO Title</label>
              <input
                type="text"
                value={settings.seoTitle}
                onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};
