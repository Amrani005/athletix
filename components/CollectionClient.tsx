"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { category, types } from "@/app/layout"; // Assuming options was unused
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import Footer from "@/components/Footer";


const CollectionClient = ({ products }: { products: any }) => {
  const [search, setSearch] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
     
  // Safely filter products, checking name or description
 

  const toggleCategory = () => setOpenCategory(!openCategory);

  return (
    <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white pt-24 lg:pt-32 flex flex-col">
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 w-full flex-grow">
        
        {/* Editorial Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-8 mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tighter uppercase text-black">
              Collection
            </h1>
            <p className="text-neutral-500 mt-2 text-sm tracking-widest uppercase">
              {products.length} {products.length === 1 ? "Result" : "Results"}
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Minimalist Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 py-2 pl-2 pr-8 focus:outline-none focus:border-black text-sm tracking-wide transition-colors"
              />
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Sort/Relevance Button */}
            <button className="hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.1em] uppercase text-neutral-500 hover:text-black transition-colors whitespace-nowrap">
              Sort By <FaChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 pb-20">
          
          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden flex items-center justify-between w-full border border-neutral-200 p-4 text-sm font-bold tracking-widest uppercase"
            onClick={toggleCategory}
          >
            Filters
            {openCategory ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          {/* Sidebar / Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${openCategory ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-32 flex flex-col gap-10">
              
              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-black uppercase mb-6">
                  Categories
                </h3>
                <ul className="flex flex-col gap-4">
                  {category.map((item) => (
                    <li key={item.id}>
                      <button className="text-sm font-light text-neutral-500 hover:text-black hover:translate-x-1 transition-all text-left w-full uppercase tracking-wide">
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Types */}
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-black uppercase mb-6">
                  Types
                </h3>
                <ul className="flex flex-col gap-4">
                  {types.map((item) => (
                    <li key={item.id}>
                      <button className="text-sm font-light text-neutral-500 hover:text-black hover:translate-x-1 transition-all text-left w-full uppercase tracking-wide">
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="w-full">
            {products?.length > 0 ? (
              <motion.div 
                layout
                className=" grid grid-cols-2 lg:grid 
                lg:grid-cols-4 gap-10 justify-center items-center  
                mt-10 sm:-mr-10 "
              >
                  {products.map((item: any) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Link
                        href={{pathname: `/productpage/${item.id}`  
                        }}
                        className=" "
                      >
                        {/* Image Container */}
                        <div className="relative w-full hover:scale-105
                         transition-transform duration-[300ms] aspect-[4/5]  overflow-hidden mb-4 ">
                          <img
                            src={item.imageUrl}
                            alt={item.name || "Athletix Product"}
                            
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="w-full h-full rounded-2xl"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        

                        {/* Product Info */}
                        <div className="flex justify-between px-3 py-2 items-start gap-4">
                          <h2 className="text-sm font-medium tracking-wide uppercase text-black line-clamp-1">
                            {item.name || item.description}
                          </h2>
                          <span className="text-sm font-light text-neutral-500 tracking-wider">
                            ${parseFloat(item.price?.toString().replace(/[^0-9.]/g, "")).toFixed(2)}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </motion.div>
            ) : (
              /* Premium Empty State */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 border border-neutral-200 border-dashed"
              >
                <p className="text-lg font-light text-neutral-400 tracking-wide mb-4 text-center">
                  No products matched your search criteria.
                </p>
                <button 
                  onClick={() => setSearch("")}
                  className="text-xs font-bold tracking-[0.1em] uppercase text-black underline underline-offset-4 hover:text-neutral-500 transition-colors"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-neutral-200">
        <Footer />
      </div>
    </div>
  );
};

export default CollectionClient;
