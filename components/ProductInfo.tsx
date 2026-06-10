"use client";

import React, { useState, Suspense, useTransition } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import { useCartCount } from "@/app/context/CartCountContext";
import { getProductById } from "@/actions/shop";
import { addToCart } from "@/actions/cart"; // التأكد من هذا المسار

const ProductDetails = () => {
  const params = useParams();
  const id = params.id as string;

  // الربط مع الـ Context والـ Transition للتعامل مع السيرفر
  const { refreshCartCount } = useCartCount();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"description" | "details">("description");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const [product, setProduct] = useState({
    id: "",
    name: "جاري التحميل...",
    description: "جاري التحميل...",
    price: 0,
    images: [] as string[],
    imageUrl: "",
    size: [] as string[],
  });

  // Load Product Data (بقي كما هو)
  React.useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        setProduct({
          id: data.id,
          name: data.name,
          description: data.description ?? "No description available",
          price: data.price,
          imageUrl: data.imageUrl,
          images: data.images ? [data.images[0]] : [],
          size: data.size ? JSON.parse(data.size) : [],
        });
      }
    };
    loadProduct();
  }, [id]);

  // الدالة المصححة للربط مع السيرفر
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    // هنا نستخدم startTransition لإرسال البيانات للسيرفر بأمان
    startTransition(async () => {
      const result = await addToCart(id, selectedSize, 1);

      if (result?.error) {
        alert(result.error); // ستظهر هنا إذا كان المستخدم غير مسجل
      } else if (result?.success) {
        await refreshCartCount(); // تحديث العداد من قاعدة البيانات
        alert("Added to cart successfully!");
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-white text-black pt-20 lg:pt-32">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-6 relative">
            <div className="sticky top-32 w-full aspect-[4/5] bg-neutral-100 rounded-[2rem] overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">No Image</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col pt-4 lg:pt-10 pb-20">
            <motion.div className="border-b border-neutral-200 pb-8">
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase mb-4">{product.description}</h1>
              <p className="text-2xl font-light tracking-widest text-neutral-500">${product.price}</p>
            </motion.div>

            <motion.div className="py-8 border-b border-neutral-200">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-neutral-500">Select Size</h2>
              <div className="flex flex-wrap gap-3">
                {product.size.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedSize(item)}
                    className={`w-14 h-14 flex items-center justify-center border font-medium transition-all ${
                      selectedSize === item ? 'bg-black text-white border-black' : 'border-neutral-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="py-8 flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isPending}
                className="w-full py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {isPending ? "Adding to Bag..." : "Add to Cart"}
              </button>
            </motion.div>
            
            {/* بقية كود الـ Tabs الخاص بك يوضع هنا ... */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function ProductInfo() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetails />
    </Suspense>
  );
}