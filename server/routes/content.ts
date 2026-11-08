import { Router } from 'express';
import { getDB, saveDB } from '../db.js';
import { verifyAdmin, verifyToken } from './auth.js';

const router = Router();

// ================= TESTIMONIALS =================
router.get('/testimonials', (req, res) => {
  const db = getDB();
  return res.json({ success: true, testimonials: db.testimonials });
});

router.post('/testimonials', verifyAdmin, (req, res) => {
  const { name, role, company, comment, rating, avatar } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ success: false, message: 'Name and testimonial comment are required.' });
  }
  const db = getDB();
  const newTestimonial = {
    id: `test_${Date.now()}`,
    name,
    role: role || 'Restaurant Partner',
    company: company || '',
    comment,
    rating: Number(rating) || 5,
    avatar: avatar || name.substring(0, 2).toUpperCase(),
    createdAt: new Date().toISOString()
  };
  db.testimonials.push(newTestimonial);
  saveDB();
  return res.status(201).json({ success: true, testimonial: newTestimonial });
});

router.put('/testimonials/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.testimonials.findIndex((t: any) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Not found.' });

  const { name, role, company, comment, rating } = req.body;
  if (name) db.testimonials[index].name = name;
  if (role) db.testimonials[index].role = role;
  if (company) db.testimonials[index].company = company;
  if (comment) db.testimonials[index].comment = comment;
  if (rating) db.testimonials[index].rating = Number(rating);

  saveDB();
  return res.json({ success: true, testimonial: db.testimonials[index] });
});

router.delete('/testimonials/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.testimonials.findIndex((t: any) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Not found.' });
  db.testimonials.splice(index, 1);
  saveDB();
  return res.json({ success: true, message: 'Testimonial removed.' });
});

// ================= FAQS =================
router.get('/faqs', (req, res) => {
  const db = getDB();
  return res.json({ success: true, faqs: db.faqs });
});

router.post('/faqs', verifyAdmin, (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, message: 'Question and answer are required.' });
  }
  const db = getDB();
  const newFaq = {
    id: `faq_${Date.now()}`,
    question,
    answer,
    category: category || 'General',
    createdAt: new Date().toISOString()
  };
  db.faqs.push(newFaq);
  saveDB();
  return res.status(201).json({ success: true, faq: newFaq });
});

router.put('/faqs/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.faqs.findIndex((f: any) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'FAQ not found.' });

  const { question, answer, category } = req.body;
  if (question) db.faqs[index].question = question;
  if (answer) db.faqs[index].answer = answer;
  if (category) db.faqs[index].category = category;

  saveDB();
  return res.json({ success: true, faq: db.faqs[index] });
});

router.delete('/faqs/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const index = db.faqs.findIndex((f: any) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'FAQ not found.' });
  db.faqs.splice(index, 1);
  saveDB();
  return res.json({ success: true, message: 'FAQ deleted.' });
});

// ================= CONTACT MESSAGES =================
router.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone, and message are required.' });
  }
  const db = getDB();
  const newContact = {
    id: `msg_${Date.now()}`,
    name,
    email: email || '',
    phone,
    subject: subject || 'General Inquiry',
    message,
    status: 'Unread',
    createdAt: new Date().toISOString()
  };
  db.contacts.unshift(newContact);
  saveDB();
  return res.status(201).json({ success: true, message: 'Your message has been sent. We will call you shortly!' });
});

router.get('/contact', verifyAdmin, (req, res) => {
  const db = getDB();
  return res.json({ success: true, contacts: db.contacts });
});

router.put('/contact/:id/read', verifyAdmin, (req, res) => {
  const db = getDB();
  const msg = db.contacts.find((c: any) => c.id === req.params.id);
  if (msg) {
    msg.status = 'Read';
    saveDB();
  }
  return res.json({ success: true, message: 'Marked as read.' });
});

// ================= SETTINGS =================
router.get('/settings', (req, res) => {
  const db = getDB();
  return res.json({ success: true, settings: db.settings });
});

router.put('/settings', verifyAdmin, (req, res) => {
  const db = getDB();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDB();
  return res.json({ success: true, message: 'Settings saved successfully.', settings: db.settings });
});

// ================= REVIEWS =================
router.get('/reviews/:productId', (req, res) => {
  const db = getDB();
  const reviews = db.reviews.filter((r: any) => r.productId === req.params.productId);
  return res.json({ success: true, reviews });
});

router.post('/reviews', (req, res) => {
  const { productId, name, rating, comment } = req.body;
  if (!productId || !name || !comment) {
    return res.status(400).json({ success: false, message: 'Product ID, name, and comment are required.' });
  }
  const db = getDB();
  const newReview = {
    id: `rev_${Date.now()}`,
    productId,
    name,
    rating: Number(rating) || 5,
    comment,
    createdAt: new Date().toISOString()
  };
  db.reviews.unshift(newReview);

  // Update product average rating
  const p = db.products.find((prod: any) => prod.id === productId);
  if (p) {
    const allProdReviews = db.reviews.filter((r: any) => r.productId === productId);
    const avg = allProdReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allProdReviews.length;
    p.rating = Math.round(avg * 10) / 10;
    p.reviewsCount = allProdReviews.length;
  }

  saveDB();
  return res.status(201).json({ success: true, review: newReview });
});

export default router;
