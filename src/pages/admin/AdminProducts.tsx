import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Upload } from 'lucide-react';
import { API, showConfirm, showToast } from '../../services/api.js';
import { Product, Category } from '../../types/index.js';
import { getImageUrl, handleImageError } from '../../utils/image.js';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Pizza Boxes',
    price: 15,
    moq: 500,
    sizes: '8 Inch, 10 Inch, 12 Inch',
    material: 'Food Grade Virgin Kraft Board (180 GSM)',
    description: '',
    stockStatus: 'In Stock',
    featured: false,
    images: ['/assets/aistudio/576123137_1135388445462123_728576114768601119_n_b3eb8401.jpg']
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        API.get('/products?limit=50'),
        API.get('/products/categories/all')
      ]);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories.length > 0 ? categories[0].name : 'Pizza Boxes',
      price: 15,
      moq: 500,
      sizes: '8 Inch, 10 Inch, 12 Inch',
      material: 'Food Grade Virgin Kraft Board (180 GSM)',
      description: '',
      stockStatus: 'In Stock',
      featured: false,
      images: ['/assets/aistudio/576123137_1135388445462123_728576114768601119_n_b3eb8401.jpg']
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      moq: p.moq,
      sizes: p.sizes ? p.sizes.join(', ') : '',
      material: p.material,
      description: p.description,
      stockStatus: p.stockStatus,
      featured: p.featured,
      images: p.images || []
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [reader.result as string, ...prev.images.slice(1)]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      };

      if (editingProduct) {
        const res = await API.put(`/products/${editingProduct.id}`, payload);
        if (res.data.success) {
          showToast('Product updated successfully!');
          setIsModalOpen(false);
          loadData();
        }
      } else {
        const res = await API.post('/products', payload);
        if (res.data.success) {
          showToast('Product created successfully!');
          setIsModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error saving product.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirm = await showConfirm(
      'Delete Product?',
      `Are you sure you want to delete "${name}" from the active catalog?`,
      'Yes, Delete'
    );

    if (confirm.isConfirmed) {
      try {
        const res = await API.delete(`/products/${id}`);
        if (res.data.success) {
          showToast('Product removed.');
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Error deleting product.', 'error');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-brand">
            Product Catalog Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Create, update pricing, MOQ rules, and manage packaging specifications.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full pl-8 pr-4 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white text-stone-900"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 font-mono">
          Total: {filteredProducts.length} items
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-medium">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price (৳)</th>
                <th className="p-3">MOQ</th>
                <th className="p-3">Material</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(p.images && p.images.length > 0 ? p.images[0] : '')}
                        alt={p.name}
                        onError={(e) => handleImageError(e)}
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
                      />
                      <div>
                        <div className="font-bold text-stone-900">{p.name}</div>
                        {p.featured && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1 rounded">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-stone-700">{p.category}</td>
                  <td className="p-3 font-mono font-bold text-stone-900">
                    ৳{p.price.toFixed(2)}
                  </td>
                  <td className="p-3 font-mono text-stone-700">{p.moq} pcs</td>
                  <td className="p-3 text-stone-600 max-w-xs truncate">{p.material}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      {p.stockStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-bold text-stone-900 font-serif-brand">
                {editingProduct ? 'Edit Packaging Product' : 'Add New Packaging Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Unit Base Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Minimum Order Quantity (MOQ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Made to Order">Made to Order (7 Days)</option>
                    <option value="Low Stock">Low Stock</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Available Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="e.g. 8 Inch, 10 Inch, 12 Inch"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Material Specification
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. 3-ply Virgin Kraft Food-Grade Corrugated Board"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-[#174D37] bg-white"
                  />
                </div>

                {/* Image Upload / URL */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-stone-700 block">
                    Product Image (Upload new or use existing URL)
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(formData.images[0])}
                      alt="Preview"
                      onError={(e) => handleImageError(e)}
                      className="w-16 h-16 object-cover rounded-lg border border-stone-200"
                    />
                    <label className="cursor-pointer px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#174D37] focus:ring-[#174D37]"
                  />
                  <label htmlFor="featuredToggle" className="text-xs font-medium text-stone-800 cursor-pointer">
                    Feature this product on homepage top showcase
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#174D37] hover:bg-[#123e2c] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
