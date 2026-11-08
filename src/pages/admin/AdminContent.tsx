import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, MessageSquare, HelpCircle, Mail, CheckCircle2, X } from 'lucide-react';
import { API, showConfirm, showToast } from '../../services/api.js';
import { Testimonial, FAQ } from '../../types/index.js';

export const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'testimonials' | 'faqs' | 'contacts'>('testimonials');

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FAQ Modal
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqCategory, setFaqCategory] = useState('Ordering');

  // Testimonial Modal
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tCompany, setTCompany] = useState('');
  const [tComment, setTComment] = useState('');
  const [tRating, setTRating] = useState(5);

  const loadData = async () => {
    setLoading(true);
    try {
      const [testRes, faqRes, contRes] = await Promise.all([
        API.get('/testimonials'),
        API.get('/faqs'),
        API.get('/contact')
      ]);
      if (testRes.data.success) setTestimonials(testRes.data.testimonials);
      if (faqRes.data.success) setFaqs(faqRes.data.faqs);
      if (contRes.data.success) setContacts(contRes.data.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // FAQ handlers
  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqQ('');
    setFaqA('');
    setFaqCategory('Ordering');
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FAQ) => {
    setEditingFaq(f);
    setFaqQ(f.question);
    setFaqA(f.answer);
    setFaqCategory(f.category);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        const res = await API.put(`/faqs/${editingFaq.id}`, { question: faqQ, answer: faqA, category: faqCategory });
        if (res.data.success) {
          showToast('FAQ updated.');
          setIsFaqModalOpen(false);
          loadData();
        }
      } else {
        const res = await API.post('/faqs', { question: faqQ, answer: faqA, category: faqCategory });
        if (res.data.success) {
          showToast('FAQ added.');
          setIsFaqModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      showToast('Error saving FAQ.', 'error');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    const confirm = await showConfirm('Delete FAQ?', 'Are you sure you want to delete this FAQ?');
    if (confirm.isConfirmed) {
      await API.delete(`/faqs/${id}`);
      showToast('FAQ deleted.');
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Testimonial handlers
  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTName('');
    setTRole('Owner & Head Chef');
    setTCompany('');
    setTComment('');
    setTRating(5);
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTName(t.name);
    setTRole(t.role);
    setTCompany(t.company);
    setTComment(t.comment);
    setTRating(t.rating);
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        const res = await API.put(`/testimonials/${editingTestimonial.id}`, {
          name: tName,
          role: tRole,
          company: tCompany,
          comment: tComment,
          rating: tRating
        });
        if (res.data.success) {
          showToast('Testimonial updated.');
          setIsTestimonialModalOpen(false);
          loadData();
        }
      } else {
        const res = await API.post('/testimonials', {
          name: tName,
          role: tRole,
          company: tCompany,
          comment: tComment,
          rating: tRating
        });
        if (res.data.success) {
          showToast('Testimonial added.');
          setIsTestimonialModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      showToast('Error saving testimonial.', 'error');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    const confirm = await showConfirm('Delete Testimonial?', 'Remove this customer review?');
    if (confirm.isConfirmed) {
      await API.delete(`/testimonials/${id}`);
      showToast('Testimonial deleted.');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Contact status handler
  const handleMarkRead = async (id: string) => {
    await API.put(`/contact/${id}/read`);
    showToast('Marked as read.');
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Read' } : c)));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
          Dynamic Content & Inquiries Management
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage customer social proof, frequently asked questions, and website messages.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'testimonials'
              ? 'border-[#174D37] text-[#174D37]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Testimonials ({testimonials.length})
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'faqs'
              ? 'border-[#174D37] text-[#174D37]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          FAQs ({faqs.length})
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'contacts'
              ? 'border-[#174D37] text-[#174D37]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          Contact Messages ({contacts.length})
        </button>
      </div>

      {/* TESTIMONIALS TAB */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-500">Reviews displayed on homepage social proof strip</span>
            <button
              onClick={openAddTestimonial}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#174D37] rounded-lg flex items-center gap-1.5 hover:bg-[#123e2c]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 text-xs font-bold">{'★'.repeat(t.rating)}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditTestimonial(t)} className="p-1 text-stone-400 hover:text-stone-700">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1 text-stone-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 mt-2 italic">"{t.comment}"</p>
                </div>
                <div className="border-t border-stone-100 pt-3">
                  <div className="font-bold text-xs text-stone-900">{t.name}</div>
                  <div className="text-[11px] text-stone-500">{t.role} · {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQS TAB */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-500">Questions and answers displayed on customer FAQ section</span>
            <button
              onClick={openAddFaq}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#174D37] rounded-lg flex items-center gap-1.5 hover:bg-[#123e2c]"
            >
              <Plus className="w-3.5 h-3.5" />
              Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="bg-white p-4 rounded-xl border border-stone-200 flex items-start justify-between gap-4 shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                      {f.category}
                    </span>
                    <h3 className="font-bold text-xs text-stone-900">{f.question}</h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-1">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEditFaq(f)} className="p-1.5 text-stone-400 hover:text-stone-700">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteFaq(f.id)} className="p-1.5 text-stone-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTACTS TAB */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
                <tr>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Phone & Email</th>
                  <th className="p-3">Topic</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">No contact messages received yet.</td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-bold text-stone-900">{c.name}</td>
                      <td className="p-3">
                        <div className="text-stone-800 font-medium">{c.phone}</div>
                        <div className="text-[11px] text-stone-500">{c.email}</div>
                      </td>
                      <td className="p-3 font-semibold text-stone-700">{c.subject}</td>
                      <td className="p-3 text-stone-600 max-w-sm">{c.message}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Read' ? 'bg-stone-100 text-stone-600' : 'bg-emerald-100 text-emerald-800'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {c.status !== 'Read' && (
                          <button
                            onClick={() => handleMarkRead(c.id)}
                            className="text-xs text-[#174D37] hover:underline font-bold"
                          >
                            Mark Read
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-bold text-stone-900">{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setIsFaqModalOpen(false)}><X className="w-4 h-4 text-stone-400" /></button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setIsFaqModalOpen(false)} className="px-3 py-1.5 text-xs text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-[#174D37] rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-bold text-stone-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsTestimonialModalOpen(false)}><X className="w-4 h-4 text-stone-400" /></button>
            </div>
            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Role & Title</label>
                <input
                  type="text"
                  value={tRole}
                  onChange={(e) => setTRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Restaurant / Brand Name</label>
                <input
                  type="text"
                  required
                  value={tCompany}
                  onChange={(e) => setTCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Feedback Quote</label>
                <textarea
                  rows={3}
                  required
                  value={tComment}
                  onChange={(e) => setTComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="px-3 py-1.5 text-xs text-stone-600">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-[#174D37] rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
