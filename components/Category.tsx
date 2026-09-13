'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';

type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default function Category({ products }: { products: RelatedProduct[] }) {
  const { t } = useLanguage();

  if (products.length === 0) return null;

  return (
    <section className="w-full bg-white text-black py-16 md:py-24 px-4 md:px-8 border-t border-neutral-200">
      <div className="max-w-[100rem] mx-auto">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-8 mb-10">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter uppercase">
            {t('mayYouLike')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Link href={`/productpage/${product.id}`} className="group flex flex-col cursor-pointer">
                <div className="relative w-full aspect-[3/4] bg-[#f4f4f5] overflow-hidden mb-4 rounded-sm">
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-neutral-900 line-clamp-2 group-hover:text-neutral-500 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-sm font-mono font-medium text-black whitespace-nowrap">
                    DA{product.price}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
