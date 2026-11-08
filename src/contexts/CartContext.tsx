import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/index.js';
import { showToast } from '../services/api.js';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeFromCart: (itemId: string, selectedSize: string) => void;
  updateQuantity: (itemId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItemsCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('classic_eco_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('classic_eco_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity?: number, selectedSize?: string) => {
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const qty = quantity && quantity >= product.moq ? quantity : product.moq || 100;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.selectedSize === size);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            moq: product.moq,
            quantity: qty,
            selectedSize: size,
            image: product.images && product.images.length > 0 ? product.images[0] : '/assets/images/eco_paper_coffee_cups_1794165037979.jpg',
            category: product.category
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${qty} pcs) to cart.`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string, selectedSize: string) => {
    setItems((prev) => prev.filter((item) => !(item.id === itemId && item.selectedSize === selectedSize)));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (itemId: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSize);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.selectedSize === selectedSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('classic_eco_cart');
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemsCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
