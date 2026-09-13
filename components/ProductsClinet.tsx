'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useLanguage } from '@/app/context/LanguageContext';

type ProductCard = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
};

export default function ProductsClinet({ products }: { products: ProductCard[] }) {
  const { t } = useLanguage();

  return (
    <section id="products" className="w-full bg-white text-black py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[90rem] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, y: 0,x:0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-neutral-200 pb-8 mb-12 lg:mb-16"
        >
          <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-medium tracking-tighter uppercase leading-[0.85] text-black">
            {t('ourProducts')}
          </h1>
        </motion.div>

       <motion.div
  variants={gridVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.08 }}
  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
>
  {products.length > 0 ? (
    products.map((item) => (
      <motion.div key={item.id} variants={cardVariants}>
        <Link
          href={`/productpage/${item.id}`}
          className="group flex flex-col h-full cursor-pointer"
        >
          <motion.div
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative"
          >
            {/* Visual Frame - Updated to 3/4 aspect ratio for modern streetwear look */}
            <div className="relative w-full aspect-[3/4] bg-[#f4f4f5] overflow-hidden mb-4 rounded-sm">
              
              {/* Minimalist Status Tag */}
              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 shadow-sm border border-black/5">
                  {t('drop01')}
                </span>
              </div>

              {/* Floating Wishlist Button */}
              <button 
                onClick={(e) => e.preventDefault()} 
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white text-black shadow-sm"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              {/* Image with subtle scale on hover */}
              <motion.img
                src={item.imageUrl}
                alt={item.name || 'Product Image'}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center"
              />
              
              {/* Slide-up Quick Size Selector on Hover */}
              <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white/95 backdrop-blur-sm p-3 border-t border-black/5">
                <div className="flex justify-center gap-1.5">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={(e) => e.preventDefault()}
                      className="flex-1 py-1.5 text-[11px] font-bold text-neutral-800 hover:bg-black hover:text-white transition-colors border border-neutral-200 rounded-[2px]"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="flex flex-col flex-grow px-1">
              <div className="flex justify-between items-baseline gap-4 mb-1">
                <h2 className="text-[13px] md:text-sm font-bold tracking-wide uppercase text-neutral-900 line-clamp-1 group-hover:text-neutral-500 transition-colors duration-300">
                  {item.description || item.name}
                </h2>
                <span className="text-[13px] md:text-sm font-mono font-medium text-black tracking-wider">
                  DA{item.price}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-[11px] text-neutral-400">
                <span className="font-light tracking-wider uppercase">
                   {t('coreCollection')}
                </span>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    ))
  ) : (
    <motion.div
      variants={cardVariants}
      className="col-span-full py-20 flex justify-center border border-neutral-200 border-dashed"
    >
      <p className="text-sm font-bold tracking-[0.2em] text-neutral-400 uppercase">
        {t('archiveEmpty')}
      </p>
    </motion.div>
  )}
</motion.div>
      </div>
    </section>
  );
}