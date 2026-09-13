'use client'
import React, { useState, Suspense,useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import { useCartCount } from "@/app/context/CartCountContext";
import { getProductById, getRelatedProducts } from "@/actions/shop";
import { addToCart } from "@/actions/cart";
import { useLanguage } from "@/app/context/LanguageContext";
import CheckoutForm from "@/components/CheckoutForm";
import Category from "@/components/Category";

const ProductDetails = () => {
  const params = useParams();
  const id = params.id as string;

  const { refreshCartCount } = useCartCount();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"description" | "details">("description");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  }[]>([]);
  const [checkOut,setCheckout] = useState(false);

  const [product, setProduct] = useState({
    id: "",
    name: "Loading...",
    description: "Loading...",
    price: 0,
    images: [] as string[],
    imageUrl: "",
    size: [] as string[],
  });

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      const data = await getProductById(id);
      if (data) {
        let galleryImages: string[] = [];
          
        try {
          const parsedImages = JSON.parse(data.images || "[]");
          if (Array.isArray(parsedImages)) {
            galleryImages = parsedImages.filter(
              (images): images is string => typeof images === "string" && images.length > 0
            );
          }
        } catch {
          galleryImages = [];
        }

        const allImages =[
          data.imageUrl,
          ...galleryImages,
        ].filter(Boolean);

        setProduct({
          id: data.id,
          name: data.name,
          description: data.description ?? "No description available",
          price: data.price,
          imageUrl: data.imageUrl,
          images: allImages,
          size: data.size ? JSON.parse(data.size) : [],
          
        });
        setSelectedImage(allImages[0] || "");
        const related = await getRelatedProducts(data.category, data.id);
        setRelatedProducts(related);
        
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert(t('sizesUnavailable'));
      return;
    }

    startTransition(async () => {
      const result = await addToCart(id, selectedSize, 1);
      if (result?.error) {
        alert(result.error);
      } else if (result?.success) {
        await refreshCartCount();
        alert(t('addToCart'));
      }
    });
  };
  const toggleCheckout = () => {
    if(!checkOut){
      setCheckout(true);
    }else{
      setCheckout(false);
    }
  }

  return (
    <div className="w-full min-h-screen mb-20 bg-white text-black
     selection:bg-black selection:text-white pt-24 lg:pt-32">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          <div className="w-full lg:w-3/5    ">
            <div className="sticky top-24 flex flex-col w-full  aspect-[3/4]
              overflow-hidden rounded-sm gap-10 ">
              {product.imageUrl ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={selectedImage || product.imageUrl} 
                  alt={product.name} 
                  className="object-cover object-center w-full " 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center
                 font-mono text-sm text-neutral-400 uppercase
                  tracking-widest">
                  {t('loadingMedia')}
                </div>
              )}
               <div className=" w-full flex ">
              {product.images.length > 0? (
                
                <div className=" grid grid-cols-4 gap-3 ">
                  {product.images.map((img, index) => (
                    <div key={index} className="aspect-square  overflow-hidden ">
                      <img 
                       onClick={()=> setSelectedImage(img)}
                       src={img }
                       alt={`${product.name} - Image ${index + 1}`}
                       className={` object-center w-full h-full rounded-[8%]
                        hover:scale-[1.1] transition-transform 
                        ${selectedImage === img ?' opacity-80  ' : 'border-2 border-zinc-400 '} `}/>
                        
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 text-sm font-mono text-neutral-400 uppercase tracking-widest">
                  {t('nothingToSee')}
                </div>
              )}
            </div>
            </div>
            
           
          </div>
           

          <div className="w-full lg:w-2/5 flex flex-col pt-4 lg:pt-10 pb-32">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-black/10 pb-8"
            >
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-4">
                {t('coreCollection')}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[1.1] mb-4">
                {product.name !== "Loading..." ? product.name : product.description}
              </h1>
              <div className="flex items-baseline gap-4 mt-6">
                <p className="text-xl font-mono font-medium text-black tracking-wider">
                  DA{product.price.toFixed(2)}
                </p>
                <p className="text-xs text-neutral-500 font-light tracking-wide">
                  {t('taxesIncluded')}
                </p>
              </div>
            </motion.div>

            {/* Size Selector */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="py-10 border-b border-black/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-black">{t('selectSize')}</h2>
                <button className="text-[11px] font-medium tracking-wide text-neutral-500 underline underline-offset-4 hover:text-black transition-colors">
                  {t('sizeGuide')}
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {product.size.length > 0 ? (
                  product.size.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelectedSize(item)}
                      className={`relative py-4 flex items-center justify-center text-sm font-medium transition-all rounded-sm overflow-hidden ${
                        selectedSize === item 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-black border border-neutral-200 hover:border-black'
                      }`}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <div className="col-span-4 py-4 text-xs font-mono text-neutral-400 uppercase text-center border border-dashed border-neutral-200">
                    {t('sizesUnavailable')}
                  </div>
                )}
              </div>
            </motion.div>
             {checkOut && product.id && (
              <CheckoutForm
                items={[{
                  productId: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  img: product.imageUrl,
                  size: selectedSize ?? undefined,
                  quantity: 1,
                }]}
              />
            )}  

            {/* Checkout Action */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="py-10 flex flex-col gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isPending}
                className="relative w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors disabled:opacity-70 rounded-sm overflow-hidden group"
              >
                <span className="relative z-10">
                  {isPending ? t('processing') : t('addToCart')}
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={()=> toggleCheckout()}
                disabled={isPending}
                className="relative w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-colors disabled:opacity-70 rounded-sm overflow-hidden group"
              >
                <span className="relative z-10">
                  {checkOut ? t('cancel') : t('buyNow')}
                </span>
              </motion.button>

              {/* Trust badges / Microcopy */}
              <div className="flex justify-center items-center gap-6 mt-4 opacity-60">
                <span className="text-[10px] uppercase tracking-widest font-medium">{t('freeGlobalShipping')}</span>
                <span className="w-1 h-1 bg-black rounded-full"></span>
                <span className="text-[10px] uppercase tracking-widest font-medium">{t('freeReturns')}</span>
              </div>
            </motion.div>

           

            {/* Description / Details Tabs */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <div className="flex gap-8 border-b border-black/10">
                <button 
                  onClick={() => setActiveTab("description")}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'description' ? 'text-black' : 'text-neutral-400 hover:text-black'}`}
                >
                  {t('description')}
                  {activeTab === 'description' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("details")}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'details' ? 'text-black' : 'text-neutral-400 hover:text-black'}`}
                >
                  {t('details')}
                  {activeTab === 'details' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              </div>

              <div className="py-8 min-h-[150px]">
                <AnimatePresence mode="wait">
                  {activeTab === "description" ? (
                    <motion.p 
                      key="desc"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm leading-relaxed text-neutral-600 font-light"
                    >
                      {product.description}
                    </motion.p>
                  ) : (
                    <motion.ul 
                      key="details"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm leading-relaxed text-neutral-600 font-light list-disc pl-4 flex flex-col gap-2"
                    >
                      <li>{t('engineeredMovement')}</li>
                      <li>{t('standardFit')}</li>
                      <li>{t('machineWash')}</li>
                      <li>{t('productId')}: {product.id || "N/A"}</li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
      <Category products={relatedProducts} />
      
    </div>
  );
};

export default ProductDetails
