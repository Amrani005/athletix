import React from 'react'
import Link from 'next/link'
import LogoutButton from "@/components/LogoutButton";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileClock, 
  Package, 
  Plus, 
  X, 
  Menu 
} from 'lucide-react'

const DashboardNavbar = () => {
  return (
    <>
      {/* 1. The CSS-Only State Checkbox */}
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />

      {/* 2. The Dark Overlay Backdrop */}
      <label 
        htmlFor="sidebar-toggle" 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 
        hidden peer-checked:block cursor-pointer transition-opacity"
      ></label>

      {/* 3. The Slide-Out Navigation Drawer (Now sliding from Left for LTR) */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-white border-r border-neutral-200 z-50 transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col">
        
        {/* Drawer Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
          <div className="text-sm font-bold tracking-[0.2em] uppercase text-black">
            System Control
          </div>
          <label htmlFor="sidebar-toggle" className="text-neutral-400 hover:text-black transition-colors cursor-pointer flex items-center justify-center">
            <X className="w-5 h-5" />
          </label>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-[0.1em] uppercase text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" /> 
            Overview
          </Link>
          
          <Link 
            href="/dashboard/orders" 
            className="flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-[0.1em] uppercase text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> 
            Order Ledger
          </Link>
          
          <Link 
            href="/dashboard/draft" 
            className="flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-[0.1em] uppercase text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <FileClock className="w-4 h-4" /> 
            Drafts
          </Link>
          
          <Link 
            href="/dashboard/products" 
            className="flex items-center gap-4 px-4 py-4 text-xs font-bold tracking-[0.1em] uppercase text-neutral-400 hover:text-black hover:bg-neutral-50 transition-colors"
          >
            <Package className="w-4 h-4" /> 
            Inventory
          </Link>
        </nav>

        {/* Special Action Button */}
        <div className="p-6 border-t border-neutral-200">
          <Link 
            href="/dashboard/products/add" 
            className="flex items-center justify-center gap-3 w-full bg-black text-white px-4 py-4 text-xs font-bold tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors active:scale-[0.98]"
          >
            <span>Add Product</span>
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* 4. The Top Navigation Bar */}
      <header className="bg-white border-b border-neutral-200 h-16 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between selection:bg-black selection:text-white">
        <div className="flex items-center">
          
          {/* THE TRIGGER: Hamburger Button */}
          <label 
            htmlFor="sidebar-toggle" 
           className="flex items-center justify-center gap-2 
           px-6 py-3 border border-neutral-200 text-xs 
           font-bold uppercase tracking-[0.1em]
            text-neutral-500 hover:text-black
             hover:scale-[1.1]  transition-transform cursor-pointer">
            <Menu className="w-6 h-6" />
          </label>
          
        </div>
        
        <div className="flex items-center gap-6">
          <div className="h-4 w-px bg-neutral-300 hidden sm:block"></div>
          
          <LogoutButton />
        </div>
      </header>
    </>
  )
}

export default DashboardNavbar;