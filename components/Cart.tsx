"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartCount } from "@/app/context/CartCountContext";
import { getUserCart, removeCartItem, updateCartItemQuantity } from "@/actions/cart"; 
import { useLanguage } from "@/app/context/LanguageContext";
import CheckoutForm from "@/components/CheckoutForm";

const Cart = () => {
  const { refreshCartCount } = useCartCount();
  const { t } = useLanguage();
  const [cart, setCart] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchDatabaseCart = async () => {
      const dbItems = await getUserCart();
      
      if (dbItems) {
        const formattedCart = dbItems.map((item: any) => ({
          cartItemId: item.id,
          id: item.productId,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          img: item.product.imageUrl,
          size: item.size,
          quantity: item.quantity
        }));
        setCart(formattedCart);
      }
      setIsMounted(true);
    };

    fetchDatabaseCart();
  }, []);

  const handleDelete = async (index: number, cartItemId: string) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    
    if (cartItemId) {
      await removeCartItem(cartItemId);
      await refreshCartCount();
    }
  };

  const updateQuantity = async (index: number, cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map((p, i) =>
      i === index ? { ...p, quantity: newQuantity } : p
    );
    setCart(updatedCart);

    if (cartItemId) {
      await updateCartItemQuantity(cartItemId, newQuantity);
    }
  };

  if (!isMounted) return null;

  return (
  <div className="w-full min-h-screen bg-white text-black pt-24 lg:pt-32 pb-20 selection:bg-black selection:text-white">
    <div className="max-w-[90rem] mx-auto px-4 md:px-8">
      
      {/* Editorial Header */}
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tighter uppercase">
          {t('shoppingBag')}
        </h1>
        <p className="text-neutral-500 mt-2 text-sm tracking-widest uppercase">
          {cart.length} {cart.length === 1 ? t('item') : t('items')}
        </p>
      </div>

      {cart.length === 0 ? (
        /* Premium Empty State */
        <div className="flex flex-col items-center justify-center py-32 border-b border-neutral-200">
          <p className="text-2xl font-light text-neutral-400 tracking-wide mb-8 text-center">
            {t('bagEmpty')}
          </p>
          <Link 
            href="/home" 
            className="px-10 py-4 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors"
          >
            {t('exploreCollection')}
          </Link>
        </div>
      ) : (
        /* Cart & Checkout Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-7 flex flex-col">
            {cart.map((item, index) => (
              <div key={index} className="flex gap-6 py-8 border-b border-neutral-200 group">
                
                {/* Product Image */}
                <div className="relative w-24 md:w-32 aspect-[4/5] bg-neutral-100 flex-shrink-0 overflow-hidden">
                  {item.img ? (
                    <img
                      src={item.img} 
                      alt={item.description} 
                      className="object-cover"
                      sizes="(max-width: 768px) 150px, 200px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {t('noImage')}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex flex-col flex-grow justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg md:text-xl font-medium uppercase tracking-tight text-black line-clamp-2">
                        {item.description || item.name}
                      </h2>
                      <span className="text-sm font-light tracking-wider text-black shrink-0">
                        {parseFloat(item.price.toString().replace(/[^0-9.]/g, "")).toFixed(2)} DZD
                      </span>
                    </div>
                    
                    {item.size && (
                      <p className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase mt-2">
                        {t('size')}: <span className="text-black">{item.size}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-end justify-between mt-6">
                    <div className="flex items-center border border-neutral-300 bg-white">
                      <button onClick={() => updateQuantity(index, item.cartItemId, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50">-</button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(index, item.cartItemId, Number(event.target.value))}
                        className="w-12 h-10 text-center text-sm font-medium focus:outline-none appearance-none bg-transparent"
                      />
                      <button onClick={() => updateQuantity(index, item.cartItemId, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50">+</button>
                    </div>
                    <button onClick={() => handleDelete(index, item.cartItemId)} className="text-xs font-bold tracking-[0.1em] text-neutral-400 uppercase hover:text-black underline underline-offset-4">
                      {t('remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <CheckoutForm items={cart} onOrderComplete={() => setCart([])} />
            </div>
          </div>

        </div>
      )}
    </div>
  </div>
);
};

export default Cart;