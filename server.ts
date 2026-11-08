import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './server/db.js';
import { seedDatabase } from './server/seed.js';

// Route imports
import authRoutes from './server/routes/auth.js';
import productRoutes from './server/routes/products.js';
import orderRoutes from './server/routes/orders.js';
import quoteRoutes from './server/routes/quotes.js';
import adminRoutes from './server/routes/admin.js';
import contentRoutes from './server/routes/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize DB & Seed data
  initDB();
  await seedDatabase();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/quotes', quoteRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', contentRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'Classic Eco Product & Packaging API',
      timestamp: new Date().toISOString()
    });
  });

  // Serve static assets from public/assets, public, and src/assets
  app.use('/assets', express.static(path.resolve(__dirname, 'public', 'assets')));
  app.use('/public/assets', express.static(path.resolve(__dirname, 'public', 'assets')));
  app.use('/public', express.static(path.resolve(__dirname, 'public')));
  app.use('/src/assets/images', express.static(path.resolve(__dirname, 'public', 'assets', 'images')));
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src', 'assets')));

  // In development, hook Vite middleware; in production serve static dist
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`🌿 Classic Eco Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
