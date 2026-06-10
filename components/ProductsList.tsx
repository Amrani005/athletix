"use client";

import { deleteProducts } from "@/actions/deleteProducts";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, Plus, Package, Calendar, Tag, Pencil, ArrowRight } from "lucide-react";

export default function ProductsList({ products }: { products: any[] }) {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-12">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 pt-10 lg:pt-16">
        
        {/* Editorial Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-200 pb-8 mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase text-black mb-2">
              Inventory
            </h1>
            <p className="text-neutral-500 text-sm tracking-wide">
              Manage your product catalog and archive stock levels.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link 
              href="/dashboard"
              className="flex-1 md:flex-none flex justify-center items-center gap-2 border border-black bg-transparent text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/dashboard/products/add" 
              className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-black text-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Minimalist Ledger Table Container */}
        <div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Table Header */}
              <div className="grid grid-cols-[2.5fr_1fr_1fr_100px] gap-4 py-4 border-b border-black text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
                <div className="flex items-center gap-2 pr-4">Product Name</div>
                <div className="flex items-center gap-2">Price</div>
                <div className="flex items-center gap-2">Date Added</div>
                <div className="text-right pl-6">Actions</div>
              </div>

              {/* Scrollable List with Motion */}
              <div className="h-full mt-2 flex flex-col divide-y divide-neutral-100">
                {products.length > 0 ? (
                  products.map((product: any, index: number) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                      className="grid grid-cols-[2.5fr_1fr_1fr_100px] gap-4 py-6 items-center hover:bg-neutral-50 transition-colors group"
                    >
                      {/* Name */}
                      <div className="font-medium text-sm tracking-wide text-black truncate pr-4">
                        {product.name}
                      </div>

                      {/* Price */}
                      <div className="font-light tracking-wider text-black flex items-center gap-1">
                        {Number(product.price).toLocaleString('en-US')} 
                        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase ml-1">DZD</span>
                      </div>

                      {/* Date */}
                      <div className="text-sm font-light text-neutral-500 tracking-wide">
                        {new Date(product.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end items-center gap-4 pl-6">
                        {/* Edit Button */}
                        <Link 
                          href={`/dashboard/products/${product.id}/edit`}
                          className="text-neutral-300 hover:text-black transition-colors"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4"/>
                        </Link>

                        {/* Delete Form */}
                        <form action={deleteProducts}>
                          <input type="hidden" name="id" value={product.id} />
                          <button 
                            type="submit" 
                            className="text-neutral-300 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  /* Premium Empty State */
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="py-32 px-6 text-center flex flex-col items-center justify-center border border-neutral-200 border-dashed mt-4"
                  >
                    <Package className="w-8 h-8 text-neutral-300 mb-6" />
                    <h3 className="text-lg font-medium uppercase tracking-tight text-black mb-2">Archive Empty</h3>
                    <p className="text-sm font-light text-neutral-500 max-w-sm mx-auto mb-8 tracking-wide leading-relaxed">
                      Your inventory is currently empty. Add your first product to begin populating the catalog.
                    </p>
                    <Link 
                      href="/dashboard/products/add" 
                      className="text-xs font-bold uppercase tracking-[0.1em] text-black underline underline-offset-4 hover:text-neutral-500 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3" />
                      Initialize Catalog
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}