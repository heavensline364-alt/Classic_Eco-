import { Router } from 'express';
import { getDB, saveDB } from '../db.js';
import { verifyAdmin } from './auth.js';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  const { category, search, sort, page = '1', limit = '12', featured } = req.query;
  const db = getDB();
  let list = [...db.products];

  // Category filter
  if (category && category !== 'all') {
    list = list.filter(
      (p: any) =>
        (p.category && p.category.toLowerCase() === (category as string).toLowerCase()) ||
        (p.categorySlug && p.categorySlug.toLowerCase() === (category as string).toLowerCase())
    );
  }

  // Featured filter
  if (featured === 'true') {
    list = list.filter((p: any) => p.featured);
  }

  // Search filter
  if (search) {
    const s = (search as string).toLowerCase().trim();
    list = list.filter(
      (p: any) =>
        p.name.toLowerCase().includes(s) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.category && p.category.toLowerCase().includes(s)) ||
        (p.material && p.material.toLowerCase().includes(s))
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'moq_asc') {
    list.sort((a, b) => a.moq - b.moq);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // default newest
    list.sort((a, b) => (b.id > a.id ? 1 : -1));
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 12;
  const total = list.length;
  const totalPages = Math.ceil(total / limitNum);
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    success: true,
    products: paginated,
    pagination: {
      total,
      page: pageNum,
      totalPages,
      limit: limitNum
    }
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const db = getDB();
  const product = db.products.find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  // Get related products from same category
  const related = db.products
    .filter((p: any) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return res.json({ success: true, product, related });
});

// POST /api/products (Admin only)
router.post('/', verifyAdmin, (req, res) => {
  const { name, category, description, price, moq, sizes, material, isCustomizable, stockStatus, featured, images } = req.body;

  if (!name || price === undefined || !category) {
    return res.status(400).json({ success: false, message: 'Product name, category, and price are required.' });
  }

  const db = getDB();
  const newProduct = {
    id: `prod_${Date.now()}`,
    name,
    category,
    categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    price: Number(price),
    moq: Number(moq) || 500,
    sizes: Array.isArray(sizes) ? sizes : typeof sizes === 'string' ? sizes.split(',').map((s: string) => s.trim()) : ['Standard'],
    material: material || 'Food Grade Certified Paperboard',
    isCustomizable: isCustomizable !== undefined ? Boolean(isCustomizable) : true,
    stockStatus: stockStatus || 'In Stock',
    featured: Boolean(featured),
    images: Array.isArray(images) && images.length > 0 ? images : ['/assets/images/eco_paper_coffee_cups_1794165037979.jpg'],
    rating: 5.0,
    reviewsCount: 1,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  saveDB();

  return res.status(201).json({ success: true, message: 'Product added successfully.', product: newProduct });
});

// PUT /api/products/:id (Admin only)
router.put('/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const existing = db.products[index];
  const { name, category, description, price, moq, sizes, material, isCustomizable, stockStatus, featured, images } = req.body;

  db.products[index] = {
    ...existing,
    name: name !== undefined ? name : existing.name,
    category: category !== undefined ? category : existing.category,
    categorySlug: category ? category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : existing.categorySlug,
    description: description !== undefined ? description : existing.description,
    price: price !== undefined ? Number(price) : existing.price,
    moq: moq !== undefined ? Number(moq) : existing.moq,
    sizes: Array.isArray(sizes) ? sizes : typeof sizes === 'string' ? sizes.split(',').map((s: string) => s.trim()) : existing.sizes,
    material: material !== undefined ? material : existing.material,
    isCustomizable: isCustomizable !== undefined ? Boolean(isCustomizable) : existing.isCustomizable,
    stockStatus: stockStatus !== undefined ? stockStatus : existing.stockStatus,
    featured: featured !== undefined ? Boolean(featured) : existing.featured,
    images: Array.isArray(images) && images.length > 0 ? images : existing.images,
    updatedAt: new Date().toISOString()
  };

  saveDB();
  return res.json({ success: true, message: 'Product updated successfully.', product: db.products[index] });
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.products.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  db.products.splice(index, 1);
  saveDB();
  return res.json({ success: true, message: 'Product deleted successfully.' });
});

// GET /api/categories
router.get('/categories/all', (req, res) => {
  const db = getDB();
  return res.json({ success: true, categories: db.categories });
});

// POST /api/categories (Admin only)
router.post('/categories', verifyAdmin, (req, res) => {
  const { name, description, image } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required.' });
  }

  const db = getDB();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat = {
    id: `cat_${Date.now()}`,
    name,
    slug,
    description: description || '',
    image: image || '/assets/aistudio/721224390_1307701234897509_5494655543120045704_n_d91e11f9.jpg',
    itemCount: 0
  };

  db.categories.push(newCat);
  saveDB();
  return res.status(201).json({ success: true, message: 'Category created.', category: newCat });
});

// PUT /api/categories/:id (Admin only)
router.put('/categories/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.categories.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  const { name, description, image } = req.body;
  if (name) {
    db.categories[index].name = name;
    db.categories[index].slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  if (description !== undefined) db.categories[index].description = description;
  if (image !== undefined) db.categories[index].image = image;

  saveDB();
  return res.json({ success: true, message: 'Category updated.', category: db.categories[index] });
});

// DELETE /api/categories/:id (Admin only)
router.delete('/categories/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.categories.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Category not found.' });
  }

  db.categories.splice(index, 1);
  saveDB();
  return res.json({ success: true, message: 'Category removed.' });
});

export default router;
