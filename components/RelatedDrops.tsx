"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

type RelatedProduct = {
  id: string;
  tag?: string;
  name: string;
  price: number;
};

export default function RelatedDrops({ products }: { products?: RelatedProduct }) {
  const { t } = useLanguage();

  return (
    <section className="py-20 border-t border-black/10">
      <div className="max-w-[100rem] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
            {t('completeLook')}
          </h2>
          <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
            {t('viewArchive')}
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {products ? (
            <motion.div
              
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 1 * 0.1, duration: 0.5 }}
            >
              <Link href={`/productpage/${products.id}`} className="group flex flex-col cursor-pointer">
                <div className="relative w-full aspect-[3/4] bg-[#f4f4f5] overflow-hidden mb-4 rounded-sm">
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border border-black/5">
                      {products.tag || t('coreCollection')}
                    </span>
                  </div>
                  
                  {/* Replace with standard img or Next/Image if testing without real URLs */}
                  <div className="w-full h-full bg-neutral-200 transition-transform duration-700 ease-out group-hover:scale-105" />
                </div>
                
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-xs font-bold tracking-wide uppercase text-neutral-900 group-hover:text-neutral-500 transition-colors">
                    {products.name}
                  </h3>
                  <span className="text-xs font-mono font-medium text-black">
                    ${products.price}
                  </span>
                </div>
              </Link>
            </motion.div>
            ):(
              <p className="text-neutral-500">{t('noRelatedProducts')}</p>

            )}
          
        </div>
      </div>
    </section>
  );
}