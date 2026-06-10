import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export default async function Products() {
  // Direct database fetch works perfectly here because this is a Server Component
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <section id="products" className="w-full bg-white text-black py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-[90rem] mx-auto">
        
        {/* Editorial Header */}
        <div className="border-b border-neutral-200 pb-8 mb-12 lg:mb-16">
          <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-medium tracking-tighter uppercase leading-[0.85] text-black">
            Our <br className="hidden md:block" /> Products
          </h1>
        </div>
        
        {/* Product Grid (No Framer Motion) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {products.length > 0 ? (
            products.map((item) => (
              <Link 
                key={item.id} 
                href={`/productpage/${item.id}`}
                className="group flex flex-col h-full cursor-pointer"
              >
                {/* Image Container with pure CSS hover effect instead of framer-motion */}
                <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden mb-6">
                  <img
                    src={item.imageUrl}
                    alt={item.name || "Product Image"} 
                    className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Minimalist Product Details */}
                <div className="flex flex-col flex-grow px-1">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-sm md:text-base font-semibold tracking-wide uppercase text-black line-clamp-2">
                      {item.description || item.name}
                    </h2>
                    <span className="text-sm font-light text-neutral-500 tracking-wider">
                      ${item.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 flex justify-center border border-neutral-200 border-dashed">
              <p className="text-sm font-bold tracking-[0.2em] text-neutral-400 uppercase">
                Archive Empty. No products available.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}