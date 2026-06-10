"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartCount } from "@/app/context/CartCountContext";
import { wilayasData } from "@/lib/wilayasData";
import { placeOrder, saveDraftOrder, deletDraft } from "@/actions/shop";
// استيراد دوال قاعدة البيانات الخاصة بالسلة
import { getUserCart, removeCartItem, updateCartItemQuantity } from "@/actions/cart"; 
import { Truck, Package, ShieldCheck } from "lucide-react";

const Cart = () => {
  const router = useRouter();
  const { refreshCartCount } = useCartCount();
  const [cart, setCart] = useState<any[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // --- Form & Checkout States ---
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedWilayaID, setSelectedWilayaID] = useState<number | "">("");
  const [deliveryType, setDeliveryType] = useState<"Domicile" | "Stopdesk">("Domicile");
  const [draftId, setDraftId] = useState<string | null>(null);

  const [shippingTotal, setShippingTotal] = useState(0);
  const [extraCost, setExtraCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // 1. جلب بيانات السلة من قاعدة بيانات Neon بدلاً من LocalStorage
  useEffect(() => {
    const fetchDatabaseCart = async () => {
      const dbItems = await getUserCart();
      
      if (dbItems) {
        // إعادة تهيئة البيانات لتتطابق تماماً مع ما يتوقعه نموذج الدفع الخاص بك
        const formattedCart = dbItems.map((item: any) => ({
          cartItemId: item.id, // ID الخاص بالعنصر في قاعدة البيانات (مهم للحذف)
          id: item.productId,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          img: item.product.imageUrl, // تأكد من اسم الحقل في جدول المنتج
          size: item.size,
          quantity: item.quantity
        }));
        setCart(formattedCart);
      }
      setIsMounted(true);
    };

    fetchDatabaseCart();
  }, []);

  // --- Recalculate Subtotal, Shipping, and Extra Costs ---
  useEffect(() => {
    const newSubtotal = cart.reduce((acc, item) => {
      const numericPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
      const quantity = item.quantity ? Number(item.quantity) : 1;
      return acc + numericPrice * quantity;
    }, 0);
    setSubtotal(newSubtotal);

    const totalItemsCount = cart.reduce((acc, item) => acc + (item.quantity ? Number(item.quantity) : 1), 0);
    const poids = 0.75; 
    let kg = poids * totalItemsCount;
    let currentExtraCost = 0;

    if (kg > 5) {
      const integerkg = Math.floor(kg);
      const extraKg = integerkg - 5;
      if (extraKg > 0) {
        currentExtraCost = extraKg * 50;
      }
    }
    setExtraCost(currentExtraCost);

    let cost = 0;
    if (selectedWilayaID) {
      const wilayaInfo = wilayasData.find(w => w.IDWilaya === Number(selectedWilayaID));
      if (wilayaInfo) {
        cost = parseInt(wilayaInfo[deliveryType], 10) || 0;
      }
    }
    setShippingTotal(cost);
  }, [cart, selectedWilayaID, deliveryType]);

  const finalTotal = subtotal + shippingTotal + extraCost;

  // --- Auto-Save Draft ---
  useEffect(() => {
    if (!customerPhone || customerPhone.length !== 10 || cart.length === 0) return;
    const timer = setTimeout(async () => {
      const draftData = {
        draftId: draftId,
        cartItems: cart, 
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        wilaya: selectedWilayaID ? wilayasData.find(w => w.IDWilaya === Number(selectedWilayaID))?.Wilaya : "",
        deliveryType: deliveryType,
        total: finalTotal
      };
      try {
        const result = await saveDraftOrder(draftData);
        if (result?.draftId) setDraftId(result.draftId);
      } catch (error) {
        console.error("Draft save failed", error);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [customerName, customerPhone, customerAddress, selectedWilayaID, deliveryType, cart, finalTotal, draftId]);

  // 2. تحديث دالة الحذف لتعمل مع قاعدة البيانات
  const handleDelete = async (index: number, cartItemId: string) => {
    // التحديث في الواجهة فوراً لكي لا ينتظر العميل (Optimistic UI)
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    
    // إرسال أمر الحذف لقاعدة البيانات وتحديث العداد في الأعلى
    if (cartItemId) {
      await removeCartItem(cartItemId);
      await refreshCartCount();
    }
  };

  // 3. تحديث دالة تغيير الكمية لتعمل مع قاعدة البيانات
  const updateQuantity = async (index: number, cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // تحديث الواجهة فوراً
    const updatedCart = cart.map((p, i) =>
      i === index ? { ...p, quantity: newQuantity } : p
    );
    setCart(updatedCart);

    // إرسال الكمية الجديدة لقاعدة البيانات
    if (cartItemId) {
      await updateCartItemQuantity(cartItemId, newQuantity);
    }
  };

  // --- Checkout Handler ---
  const handleCheckout = async () => {
    if (!customerAddress || !selectedWilayaID) {
      setMessage("الرجاء اختيار الولاية وإدخال العنوان.");
      return;
    }
    if (customerPhone.length !== 10) {
      setMessage("الرجاء إدخال رقم هاتف صحيح مكون من 10 أرقام.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const selectedWilayaData = wilayasData.find(w => w.IDWilaya === Number(selectedWilayaID));
    const cityName = selectedWilayaData ? selectedWilayaData.Wilaya : "غير محدد";

    const orderData = {
      draftId: draftId,
      cartItems: cart, 
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      wilaya: cityName,
      deliveryType: deliveryType,
      total: finalTotal
    };

    try {
      // إرسال الطلب النهائي إلى مسار Shop / Dashboard الخاص بك
      const result = await placeOrder(orderData);
      
      if (result?.success) {
        if (draftId) {
          const formData = new FormData();
          formData.append('draftId', draftId);
          await deletDraft(formData);
        }
        
        // تفريغ السلة من الواجهة وتحديث العداد
        setCart([]);
        await refreshCartCount(); 
        // ملاحظة: يمكنك هنا إضافة دالة خلفية تحذف عناصر السلة للمستخدم من Neon إذا رغبت بذلك
        
        alert("Order submitted successfully!");
        //router.push('/thank-you');
      }
    } catch (error) {
      setMessage("❌ حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    }
    setIsLoading(false);
  };

  if (!isMounted) return null;

  return (
  <div className="w-full min-h-screen bg-white text-black pt-24 lg:pt-32 pb-20 selection:bg-black selection:text-white">
    <div className="max-w-[90rem] mx-auto px-4 md:px-8">
      
      {/* Editorial Header */}
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tighter uppercase">
          Shopping Bag
        </h1>
        <p className="text-neutral-500 mt-2 text-sm tracking-widest uppercase">
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      {cart.length === 0 ? (
        /* Premium Empty State */
        <div className="flex flex-col items-center justify-center py-32 border-b border-neutral-200">
          <p className="text-2xl font-light text-neutral-400 tracking-wide mb-8 text-center">
            Your shopping bag is currently empty.
          </p>
          <Link 
            href="/home" 
            className="px-10 py-4 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors"
          >
            Explore Collection
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
                      No Image
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
                        Size: <span className="text-black">{item.size}</span>
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-end justify-between mt-6">
                    
                    {/* Minimalist Quantity Selector */}
                    <div className="flex items-center border border-neutral-300 bg-white">
                      <button 
                        onClick={() => updateQuantity(index, item.cartItemId, (item.quantity || 1) - 1)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity || 1}
                        onChange={(e) => updateQuantity(index, item.cartItemId, Number(e.target.value))}
                        className="w-12 h-10 text-center text-sm font-medium focus:outline-none appearance-none bg-transparent"
                      />
                      <button 
                        onClick={() => updateQuantity(index, item.cartItemId, (item.quantity || 1) + 1)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => handleDelete(index, item.cartItemId)}
                      className="text-xs font-bold tracking-[0.1em] text-neutral-400 uppercase hover:text-black transition-colors underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Checkout Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white p-6 md:p-8 border border-neutral-200 flex flex-col gap-8">
              
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] border-b border-neutral-200 pb-4 text-black">
                Delivery Information
              </h2>
              
              {/* --- Form Inputs --- */}
              <div className="space-y-6">
                
                {/* Full Name */}
                <div className="relative group">
                  <label className="absolute top-3 text-neutral-600 text-xl font-light transition-all duration-300 transform -translate-y-6 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-black">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder=" " 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-sm font-light"
                  />
                </div>
                
                {/* Phone Number */}
                <div className="relative group">
                   <label className="absolute top-3 text-neutral-600 
                   text-xl font-light transition-all duration-300 transform -translate-y-6 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-black">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder=" " 
                    value={customerPhone} 
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-sm font-light"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Wilaya Select */}
                  <div className="relative">
                    <select 
                      value={selectedWilayaID} 
                      onChange={(e) => setSelectedWilayaID(Number(e.target.value))}
                      className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors text-sm font-light appearance-none"
                    >
                      <option value="" disabled>State / Province</option>
                      {wilayasData.map((w) => (
                        <option key={w.IDWilaya} value={w.IDWilaya}>
                          {w.IDWilaya} - {w.Wilaya}
                        </option>
                      ))}
                    </select>
                    {/* Minimalist Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                
                  {/* Commune / Address */}
                  <div className="relative group"> 
                    <label className="absolute top-3 text-neutral-600 text-xl font-light transition-all duration-300 transform -translate-y-6 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-black">
                      City / Address
                    </label>
                    <input 
                      type="text" 
                      placeholder=" " 
                      value={customerAddress} 
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-sm font-light"
                    />
                  </div>
                </div>

                {/* Delivery Type Toggle */}
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType("Domicile")} 
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.1em] border transition-colors duration-300
                      ${deliveryType === "Domicile" 
                        ? 'border-black bg-black text-white' 
                        : 'border-neutral-300 text-neutral-500 hover:border-black hover:text-black' 
                      }`}
                  >
                    Home Delivery
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType("Stopdesk")} 
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.1em] border transition-colors duration-300
                      ${deliveryType === "Stopdesk" 
                        ? 'border-black bg-black text-white' 
                        : 'border-neutral-300 text-neutral-500 hover:border-black hover:text-black' 
                      }`}
                  >
                    Pick-up Point
                  </button>
                </div>
              </div>

              {/* --- Order Summary Details --- */}
              <div className="pt-6 border-t border-neutral-200 space-y-4">
                <div className="flex justify-between items-center text-sm font-light text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">{subtotal.toFixed(2)} DZD</span>
                </div>
                
                <div className="flex justify-between items-center text-sm font-light text-neutral-600">
                  <span>Shipping ({deliveryType === 'Domicile' ? 'Home' : 'Pick-up'})</span>
                  <span className="font-medium text-black">{!selectedWilayaID ? `0.00 DZD` : `${shippingTotal.toFixed(2)} DZD`}</span>
                </div>

                {extraCost > 0 && (
                  <div className="flex justify-between items-center text-sm font-light text-neutral-600">
                    <span>Extra Weight Surcharge</span>
                    <span className="font-medium text-black">+{extraCost.toFixed(2)} DZD</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-base font-medium uppercase tracking-widest text-black pt-4 border-t border-neutral-200">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} DZD</span>
                </div>
              </div>

              {/* Error Message */}
              {message && (
                <p className="text-center text-red-500 text-xs font-bold uppercase tracking-wide">
                  {message}
                </p>
              )}

              {/* Checkout Action */}
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleCheckout} 
                  disabled={isLoading} 
                  className="w-full py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    "Complete Checkout"
                  )}
                </button>
                
                <p className="text-[10px] font-bold text-neutral-400 text-center tracking-[0.2em] uppercase">
                  Payment collected upon delivery
                </p>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  </div>
);
};

export default Cart;