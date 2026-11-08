import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { API, showConfirm, showToast } from '../../services/api.js';
import { Category } from '../../types/index.js';
import { getImageUrl, handleImageError } from '../../utils/image.js';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products/categories/all');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('/assets/aistudio/721224390_1307701234897509_5494655543120045704_n_d91e11f9.jpg');
    setIsModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description);
    setImage(c.image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCategory) {
        const res = await API.put(`/products/categories/${editingCategory.id}`, { name, description, image });
        if (res.data.success) {
          showToast('Category updated.');
          setIsModalOpen(false);
          loadCategories();
        }
      } else {
        const res = await API.post('/products/categories', { name, description, image });
        if (res.data.success) {
          showToast('Category created.');
          setIsModalOpen(false);
          loadCategories();
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error saving category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    const confirm = await showConfirm('Delete Category?', `Are you sure you want to delete category "${catName}"?`);
    if (confirm.isConfirmed) {
      try {
        const res = await API.delete(`/products/categories/${id}`);
        if (res.data.success) {
          showToast('Category deleted.');
          setCategories((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err: any) {
        showToast('Error deleting category.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
            Packaging Category Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize product groups for homepage filters and navigation.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden p-5 flex gap-4 items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl(c.image)}
                alt={c.name}
                onError={(e) => handleImageError(e)}
                className="w-14 h-14 object-cover rounded-lg border border-stone-200 bg-stone-100"
              />
              <div>
                <h3 className="font-bold text-stone-900 text-sm">{c.name}</h3>
                <span className="text-[11px] text-stone-400 font-mono">slug: {c.slug}</span>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{c.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openEdit(c)}
                className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h2 className="text-base font-bold text-stone-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#174D37] rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
