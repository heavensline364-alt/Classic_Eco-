import { Router } from 'express';
import { getDB, saveDB } from '../db.js';
import { verifyToken, verifyAdmin } from './auth.js';

const router = Router();

function generateQuoteId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CEQ-${num}`;
}

// POST /api/quotes (Submit custom quotation request)
router.post('/', (req: any, res) => {
  try {
    const {
      name,
      businessName,
      phone,
      email,
      productType,
      requiredQuantity,
      packagingSize,
      materialPreference,
      logoFile,
      designFile,
      instructions,
      userId
    } = req.body;

    if (!name || !businessName || !phone || !productType || !requiredQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Name, Business Name, Phone, Product Type, and Required Quantity are required.'
      });
    }

    const db = getDB();
    const quoteId = generateQuoteId();

    const newQuote = {
      id: quoteId,
      userId: userId || null,
      name,
      businessName,
      phone,
      email: email || '',
      productType,
      requiredQuantity,
      packagingSize: packagingSize || 'Standard Dimensions',
      materialPreference: materialPreference || 'Food Grade Virgin Kraft Paperboard',
      logoFile: logoFile || null,
      designFile: designFile || null,
      instructions: instructions || '',
      status: 'Pending',
      quotedPrice: null,
      adminNotes: '',
      createdAt: new Date().toISOString()
    };

    db.quotes.unshift(newQuote);
    saveDB();

    return res.status(201).json({
      success: true,
      message: 'Custom quotation request submitted successfully!',
      inquiryId: newQuote.id,
      quote: newQuote
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Error creating quote request.' });
  }
});

// GET /api/quotes/my-quotes (Customer's quotes)
router.get('/my-quotes', verifyToken, (req: any, res) => {
  const db = getDB();
  const list = db.quotes.filter(
    (q: any) => q.userId === req.user.id || (q.email && q.email.toLowerCase() === req.user.email.toLowerCase())
  );
  return res.json({ success: true, quotes: list });
});

// GET /api/quotes (Admin view all quotes)
router.get('/', verifyAdmin, (req, res) => {
  const { status, search, page = '1', limit = '15' } = req.query;
  const db = getDB();
  let list = [...db.quotes];

  if (status && status !== 'all') {
    list = list.filter((q: any) => q.status.toLowerCase() === (status as string).toLowerCase());
  }

  if (search) {
    const s = (search as string).toLowerCase().trim();
    list = list.filter(
      (q: any) =>
        q.id.toLowerCase().includes(s) ||
        q.name.toLowerCase().includes(s) ||
        q.businessName.toLowerCase().includes(s) ||
        q.phone.includes(s) ||
        q.productType.toLowerCase().includes(s)
    );
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 15;
  const total = list.length;
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    success: true,
    quotes: paginated,
    pagination: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum
    }
  });
});

// PUT /api/quotes/:id (Admin update quotation status, price & notes)
router.put('/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.quotes.findIndex((q: any) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Quote request not found.' });
  }

  const { status, quotedPrice, adminNotes } = req.body;
  const quote = db.quotes[index];

  if (status) quote.status = status;
  if (quotedPrice !== undefined) quote.quotedPrice = quotedPrice === '' || quotedPrice === null ? null : Number(quotedPrice);
  if (adminNotes !== undefined) quote.adminNotes = adminNotes;
  quote.updatedAt = new Date().toISOString();

  saveDB();
  return res.json({ success: true, message: 'Quote updated successfully.', quote });
});

// DELETE /api/quotes/:id (Admin delete quote)
router.delete('/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.quotes.findIndex((q: any) => q.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Quote request not found.' });
  }

  db.quotes.splice(index, 1);
  saveDB();
  return res.json({ success: true, message: 'Quote request deleted.' });
});

export default router;
