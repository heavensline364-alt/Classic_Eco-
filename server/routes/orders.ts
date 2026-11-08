import { Router } from 'express';
import { getDB, saveDB } from '../db.js';
import { verifyToken, verifyAdmin } from './auth.js';

const router = Router();

// Helper to generate unique Order ID
function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CEO-${num}`;
}

// POST /api/orders (Create order)
router.post('/', (req: any, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      district,
      area,
      orderNotes,
      paymentMethod,
      trxId,
      items,
      subtotal,
      deliveryFee,
      total,
      userId
    } = req.body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, address, and cart items are required.' });
    }

    const db = getDB();
    const orderId = generateOrderId();

    const newOrder = {
      id: orderId,
      userId: userId || null,
      customerName,
      phone,
      email: email || '',
      address,
      district: district || 'Dhaka',
      area: area || '',
      orderNotes: orderNotes || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'bKash' || paymentMethod === 'Nagad' ? (trxId ? 'Verifying' : 'Pending') : 'Pending',
      trxId: trxId || '',
      orderStatus: 'Pending',
      items,
      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || (district && district.toLowerCase().includes('dhaka') ? 80 : 150),
      total: Number(total) || (Number(subtotal) + (district && district.toLowerCase().includes('dhaka') ? 80 : 150)),
      statusHistory: [
        { status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed by customer.' }
      ],
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    saveDB();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId: newOrder.id,
      order: newOrder
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Error creating order.' });
  }
});

// GET /api/orders/track/:query (Track by Order ID or phone)
router.get('/track/:query', (req, res) => {
  const query = req.params.query.trim().toUpperCase();
  const db = getDB();

  const order = db.orders.find(
    (o: any) => o.id.toUpperCase() === query || o.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'No matching order found for this Order ID or Phone number.' });
  }

  return res.json({ success: true, order });
});

// GET /api/orders/my-orders (Protected for logged in customer)
router.get('/my-orders', verifyToken, (req: any, res) => {
  const db = getDB();
  const userOrders = db.orders.filter(
    (o: any) => o.userId === req.user.id || (o.email && o.email.toLowerCase() === req.user.email.toLowerCase())
  );
  return res.json({ success: true, orders: userOrders });
});

// GET /api/orders (Admin: view all orders with filters)
router.get('/', verifyAdmin, (req, res) => {
  const { status, paymentStatus, search, page = '1', limit = '15' } = req.query;
  const db = getDB();
  let list = [...db.orders];

  if (status && status !== 'all') {
    list = list.filter((o: any) => o.orderStatus.toLowerCase() === (status as string).toLowerCase());
  }

  if (paymentStatus && paymentStatus !== 'all') {
    list = list.filter((o: any) => o.paymentStatus.toLowerCase() === (paymentStatus as string).toLowerCase());
  }

  if (search) {
    const s = (search as string).toLowerCase().trim();
    list = list.filter(
      (o: any) =>
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.phone.includes(s) ||
        (o.email && o.email.toLowerCase().includes(s))
    );
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 15;
  const total = list.length;
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.json({
    success: true,
    orders: paginated,
    pagination: {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum
    }
  });
});

// GET /api/orders/:id (Admin get order detail)
router.get('/:id', verifyAdmin, (req, res) => {
  const db = getDB();
  const order = db.orders.find((o: any) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }
  return res.json({ success: true, order });
});

// PUT /api/orders/:id/status (Admin update order status)
router.put('/:id/status', verifyAdmin, (req, res) => {
  const { orderStatus, paymentStatus, note } = req.body;
  const db = getDB();
  const index = db.orders.findIndex((o: any) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const order = db.orders[index];
  if (orderStatus && orderStatus !== order.orderStatus) {
    order.orderStatus = orderStatus;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: orderStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${orderStatus} by Admin`
    });
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  order.updatedAt = new Date().toISOString();
  saveDB();

  return res.json({ success: true, message: 'Order status updated successfully.', order });
});

// PUT /api/orders/:id/cancel (Customer or Admin cancel)
router.put('/:id/cancel', verifyToken, (req: any, res) => {
  const db = getDB();
  const index = db.orders.findIndex((o: any) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  const order = db.orders[index];
  // Verify ownership if not admin
  if (req.user.role !== 'admin' && order.userId !== req.user.id && order.email !== req.user.email) {
    return res.status(403).json({ success: false, message: 'Not authorized to cancel this order.' });
  }

  if (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') {
    return res.status(400).json({ success: false, message: 'Cannot cancel an order that is already shipped or delivered.' });
  }

  order.orderStatus = 'Cancelled';
  if (!order.statusHistory) order.statusHistory = [];
  order.statusHistory.push({
    status: 'Cancelled',
    timestamp: new Date().toISOString(),
    note: req.body.reason || 'Order cancelled by user.'
  });

  saveDB();
  return res.json({ success: true, message: 'Order cancelled.', order });
});

export default router;
