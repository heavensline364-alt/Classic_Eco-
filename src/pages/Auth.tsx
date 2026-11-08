import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { API, showToast } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';

export const Auth: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    password: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const res = await API.post(endpoint, formData);

      if (res.data.success) {
        login(res.data.token, res.data.user);
        if (res.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirect);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      showToast(err.response?.data?.message || 'Authentication failed. Please verify credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#174D37]/10 text-[#174D37] flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
            {isRegister ? 'Register Restaurant Account' : 'Customer Account Login'}
          </h1>
          <p className="text-xs text-stone-500">
            {isRegister
              ? 'Create an account to track orders and save packaging inquiries.'
              : 'Sign in to access your order history and manage your business profile.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
              !isRegister
                ? 'border-[#174D37] text-[#174D37]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 ${
              isRegister
                ? 'border-[#174D37] text-[#174D37]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Restaurant / Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Pizza Lounge Dhanmondi"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Phone Number <span className="text-red-500">*</span>
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
            </>
          )}

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. name@restaurant.bd"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] active:scale-95 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-100 text-center">
          <Link to="/admin/login" className="text-xs text-stone-400 hover:text-emerald-800 font-medium">
            Classic Eco Staff? Go to Dedicated Admin Portal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
