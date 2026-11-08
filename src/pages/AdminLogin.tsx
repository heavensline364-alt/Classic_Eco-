import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight, KeyRound } from 'lucide-react';
import { API, showToast } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext.js';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFillDemo = () => {
    setEmail('admin@classiceco.com');
    setPassword('AdminPassword123!');
    showToast('Loaded Admin credentials. Click Sign In.', 'info');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        if (res.data.user.role !== 'admin') {
          showToast('Access denied: This account does not possess administrator privileges.', 'error');
          return;
        }
        login(res.data.token, res.data.user);
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      showToast(err.response?.data?.message || 'Invalid administrator credentials.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-[#174D37]/20 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#174D37] text-[#E8DFC9] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
            Classic Eco Admin Portal
          </h1>
          <p className="text-xs text-stone-500">
            Internal management console for orders, custom quotations, product catalogs, and website settings.
          </p>
        </div>

        {/* Convenient Demo Autofill Pill */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="text-emerald-900">
            <span className="font-bold block">Evaluation Demo Account</span>
            <span className="text-[11px] text-emerald-700">admin@classiceco.com</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1.5 bg-[#174D37] text-white text-[11px] font-bold rounded hover:bg-[#123e2c] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
          >
            <KeyRound className="w-3 h-3" />
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@classiceco.com"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Secure Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] active:scale-95 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Verifying Credentials...' : 'Sign In to Admin Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <Link to="/" className="text-xs text-stone-500 hover:text-stone-900">
            &larr; Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
