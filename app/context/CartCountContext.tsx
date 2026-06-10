'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartItemsCount } from '@/actions/cart'; // استيراد الدالة التي كتبناها

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>; // دالة جديدة لتحديث العدد من السيرفر
}

const CartCountContext = createContext<CartContextType | undefined>(undefined);

export const CartCountProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  // دالة تجلب العدد الفعلي من قاعدة بيانات Neon وتحدث العداد
  const refreshCartCount = async () => {
    const count = await getCartItemsCount();
    setCartCount(count);
  };

  // جلب العدد أول مرة يفتح فيها المستخدم الموقع
  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartCountContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartCountContext.Provider>
  );
};

export const useCartCount = () => {
  const context = useContext(CartCountContext);
  if (!context) {
    throw new Error('useCartCount must be used within a CartCountProvider');
  }
  return context;
};