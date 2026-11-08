import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { CartProvider } from './contexts/CartContext.js';

// Common Components
import { TopBanner } from './components/TopBanner.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { CartDrawer } from './components/CartDrawer.js';
import { WhatsAppButton } from './components/WhatsAppButton.js';

// Customer Pages
import { Home } from './pages/Home.js';
import { Products } from './pages/Products.js';
import { ProductDetails } from './pages/ProductDetails.js';
import { CustomQuote } from './pages/CustomQuote.js';
import { Cart } from './pages/Cart.js';
import { Checkout } from './pages/Checkout.js';
import { TrackOrder } from './pages/TrackOrder.js';
import { About } from './pages/About.js';
import { Contact } from './pages/Contact.js';
import { Auth } from './pages/Auth.js';
import { AdminLogin } from './pages/AdminLogin.js';
import { Profile } from './pages/Profile.js';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout.js';
import { AdminOverview } from './pages/admin/AdminOverview.js';
import { AdminProducts } from './pages/admin/AdminProducts.js';
import { AdminCategories } from './pages/admin/AdminCategories.js';
import { AdminOrders } from './pages/admin/AdminOrders.js';
import { AdminQuotes } from './pages/admin/AdminQuotes.js';
import { AdminCustomers } from './pages/admin/AdminCustomers.js';
import { AdminContent } from './pages/admin/AdminContent.js';
import { AdminSettings } from './pages/admin/AdminSettings.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for customer storefront pages
function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF5] text-[#202820]">
      <TopBanner />
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Customer Facing Pages */}
            <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
            <Route path="/products" element={<StorefrontLayout><Products /></StorefrontLayout>} />
            <Route path="/products/:id" element={<StorefrontLayout><ProductDetails /></StorefrontLayout>} />
            <Route path="/custom-packaging" element={<StorefrontLayout><CustomQuote /></StorefrontLayout>} />
            <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
            <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
            <Route path="/track" element={<StorefrontLayout><TrackOrder /></StorefrontLayout>} />
            <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
            <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
            <Route path="/auth" element={<StorefrontLayout><Auth /></StorefrontLayout>} />
            <Route path="/admin/login" element={<StorefrontLayout><AdminLogin /></StorefrontLayout>} />
            <Route path="/profile" element={<StorefrontLayout><Profile /></StorefrontLayout>} />

            {/* Admin Management Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Catch-all 404 */}
            <Route
              path="*"
              element={
                <StorefrontLayout>
                  <div className="max-w-md mx-auto py-24 text-center space-y-4">
                    <h2 className="text-3xl font-bold font-serif-brand">404 - Page Not Found</h2>
                    <p className="text-xs text-stone-500">The page you requested could not be found.</p>
                    <a href="/" className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#174D37] rounded-lg">
                      Return Home
                    </a>
                  </div>
                </StorefrontLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
