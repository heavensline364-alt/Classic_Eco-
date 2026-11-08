import { Router } from 'express';
import { getDB, saveDB } from '../db.js';
import { verifyAdmin } from './auth.js';

const router = Router();

// GET /api/admin/dashboard (Comprehensive business analytics)
router.get('/dashboard', verifyAdmin, (req, res) => {
  const db = getDB();

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o: any) => o.orderStatus === 'Pending').length;
  const inProductionOrders = db.orders.filter((o: any) => o.orderStatus === 'Production').length;
  const deliveredOrders = db.orders.filter((o: any) => o.orderStatus === 'Delivered').length;

  const totalRevenue = db.orders
    .filter((o: any) => o.orderStatus !== 'Cancelled')
    .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);

  const totalProducts = db.products.length;
  const totalCustomers = db.users.filter((u: any) => u.role === 'customer').length;
  const pendingQuotes = db.quotes.filter((q: any) => q.status === 'Pending').length;
  const totalQuotes = db.quotes.length;

  // Monthly revenue breakdown for Recharts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyRevenueMap: { [key: string]: { month: string; revenue: number; orders: number } } = {};

  // Initialize current month + last 5 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]}`;
    monthlyRevenueMap[key] = { month: key, revenue: 0, orders: 0 };
  }

  // Populate from real orders
  db.orders.forEach((o: any) => {
    if (o.orderStatus !== 'Cancelled') {
      const orderDate = new Date(o.createdAt);
      const mName = monthNames[orderDate.getMonth()];
      if (monthlyRevenueMap[mName]) {
        monthlyRevenueMap[mName].revenue += Number(o.total) || 0;
        monthlyRevenueMap[mName].orders += 1;
      }
    }
  });

  const salesAnalytics = Object.values(monthlyRevenueMap);

  // Status breakdown
  const statusCounts = [
    { name: 'Pending', count: db.orders.filter((o: any) => o.orderStatus === 'Pending').length, color: '#F59E0B' },
    { name: 'Confirmed', count: db.orders.filter((o: any) => o.orderStatus === 'Confirmed').length, color: '#3B82F6' },
    { name: 'Production', count: db.orders.filter((o: any) => o.orderStatus === 'Production').length, color: '#8B5CF6' },
    { name: 'Shipped', count: db.orders.filter((o: any) => o.orderStatus === 'Shipped').length, color: '#06B6D4' },
    { name: 'Delivered', count: db.orders.filter((o: any) => o.orderStatus === 'Delivered').length, color: '#10B981' },
    { name: 'Cancelled', count: db.orders.filter((o: any) => o.orderStatus === 'Cancelled').length, color: '#EF4444' }
  ];

  // Category distribution
  const categoryDistribution = db.categories.map((c: any) => {
    const count = db.products.filter((p: any) => p.category === c.name || p.categorySlug === c.slug).length;
    return { name: c.name, count };
  });

  // Recent 6 orders
  const recentOrders = [...db.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Recent 5 quotes
  const recentQuotes = [...db.quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      pendingOrders,
      inProductionOrders,
      deliveredOrders,
      totalProducts,
      totalCustomers,
      pendingQuotes,
      totalQuotes
    },
    salesAnalytics,
    statusCounts,
    categoryDistribution,
    recentOrders,
    recentQuotes
  });
});

// GET /api/admin/customers
router.get('/customers', verifyAdmin, (req, res) => {
  const db = getDB();
  const customers = db.users
    .filter((u: any) => u.role === 'customer')
    .map((u: any) => {
      const orders = db.orders.filter((o: any) => o.userId === u.id || o.email === u.email);
      const quotes = db.quotes.filter((q: any) => q.userId === u.id || q.email === u.email);
      const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.orderStatus !== 'Cancelled' ? Number(o.total) : 0), 0);
      const { password: _, ...cleanUser } = u;
      return {
        ...cleanUser,
        orderCount: orders.length,
        quoteCount: quotes.length,
        totalSpent
      };
    });

  return res.json({ success: true, customers });
});

// PUT /api/admin/customers/:id/toggle-block
router.put('/customers/:id/toggle-block', verifyAdmin, (req, res) => {
  const db = getDB();
  const user = db.users.find((u: any) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }

  user.isBlocked = !user.isBlocked;
  saveDB();

  return res.json({
    success: true,
    message: `Customer ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
    isBlocked: user.isBlocked
  });
});

export default router;
