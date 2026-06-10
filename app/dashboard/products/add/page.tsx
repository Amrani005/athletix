"use client"; 

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createProducts } from "@/actions/createProducts"; 
import { motion } from "framer-motion";
import { UploadCloud, ImageIcon, Loader2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import SideBarNav from "@/components/SideBarNav";

const CLOUD_NAME = "deimq7tzj"; 
const UPLOAD_PRESET = "dxtx2rdd"; 

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AddProductPage() {
  const router = useRouter(); 

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageUrl(URL.createObjectURL(file));
    else setImageUrl(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setGalleryImages(Array.from(files).map(file => URL.createObjectURL(file)));
    else setGalleryImages([]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const uploadToCloudinary = async (file: File) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET); 
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      
      const json = await res.json();
      
      if (json.error) {
        console.error("Cloudinary Error:", json.error.message);
        return null;
      }
      
      return json.secure_url;
    } catch (err) {
      console.error("Fetch Error:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setIsSubmitting(true); 
    setUploadProgress("Uploading high-resolution assets...");

    try {
      const form = e.currentTarget;
      const finalData = new FormData();
      
      finalData.append("name", (form.elements.namedItem("name") as HTMLInputElement).value);
      finalData.append("price", (form.elements.namedItem("price") as HTMLInputElement).value);
      finalData.append("priceBefore", (form.elements.namedItem("priceBefore") as HTMLInputElement).value);
      finalData.append("description", (form.elements.namedItem("description") as HTMLTextAreaElement).value);
      
      // Store sizes as a JSON string to match your ProductDetails page logic
      finalData.append("size", JSON.stringify(selectedSizes));

      // Upload Main Image
      const imageInput = form.elements.namedItem("image") as HTMLInputElement;
      if (imageInput.files && imageInput.files.length > 0) {
        const url = await uploadToCloudinary(imageInput.files[0]);
        if (url) finalData.append("imageUrl", url);
      }

      // Upload Gallery Images
      const galleryInput = form.elements.namedItem("gallery") as HTMLInputElement;
      if (galleryInput.files && galleryInput.files.length > 0) {
        const urls = [];
        for (let i = 0; i < galleryInput.files.length; i++) {
          const url = await uploadToCloudinary(galleryInput.files[i]);
          if (url) urls.push(url);
        }
        finalData.append("images", JSON.stringify(urls));
      } else {
        finalData.append("images", "[]");
      }

      setUploadProgress("Synchronizing with archive...");
      
      const result = await createProducts(finalData);
      
      if (result && result.success) {
        router.push("/dashboard/products");
        router.refresh(); 
      } else {
        alert("Failed to initialize product. Please verify data integrity.");
      }
      
    } catch (error) {
       alert("An error occurred during synchronization.");
    } finally {
      setIsSubmitting(false); 
      setUploadProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-12">
      
      <SideBarNav/>

      <main className="flex-1 max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-16 overflow-hidden">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-neutral-200 pb-8 mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase text-black mb-2">
              Add to Archive
            </h1>
            <p className="text-neutral-500 text-sm tracking-wide">
              Initialize a new garment into the catalog.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link 
              href="/dashboard/products"
              className="flex-1 md:flex-none flex justify-center items-center gap-2 border border-black bg-transparent text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Cancel</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* COLUMN 1: Basic Info & Details (Left side, takes up 7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-7 flex flex-col gap-10"
          >
            
            {/* Product Name */}
            <div className="relative group">
              <input 
                name="name" 
                id="name"
                type="text" 
                required 
                disabled={isSubmitting}
                placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light" 
              />
              <label 
                htmlFor="name"
                className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
              >
                Product Name
              </label>
            </div>

            {/* Pricing Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="relative group">
                <input 
                  name="price" 
                  id="price"
                  type="number" 
                  required 
                  disabled={isSubmitting}
                  placeholder=" "
                  className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light" 
                />
                <label 
                  htmlFor="price"
                  className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
                >
                  Selling Price (DZD)
                </label>
              </div>

              <div className="relative group">
                <input 
                  name="priceBefore" 
                  id="priceBefore"
                  type="number" 
                  disabled={isSubmitting}
                  placeholder=" "
                  className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light" 
                />
                <label 
                  htmlFor="priceBefore"
                  className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
                >
                  Original Price (Optional)
                </label>
              </div>
            </div>

            {/* Sizes Configuration */}
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-4">
                Available Sizes
              </h3>
              <div className="flex flex-wrap gap-3">
                {STANDARD_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`w-14 h-14 flex items-center justify-center border font-medium transition-all duration-300
                      ${selectedSizes.includes(size)
                        ? 'bg-black text-white border-black scale-105' 
                        : 'bg-transparent text-black border-neutral-300 hover:border-black hover:bg-neutral-50'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSizes.length === 0 && (
                <p className="text-xs text-red-500 mt-2 font-light">Please select at least one size.</p>
              )}
            </div>

            {/* Description */}
            <div className="relative group mt-2">
              <textarea 
                name="description" 
                id="description"
                rows={6} 
                required
                disabled={isSubmitting}
                placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light resize-none" 
              />
              <label 
                htmlFor="description"
                className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
              >
                Editorial Description & Specs
              </label>
            </div>

          </motion.div>

          {/* COLUMN 2: Media & Submit Action (Right side, takes up 5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="lg:col-span-5 flex flex-col gap-10 lg:sticky lg:top-24"
          >
            
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-4">
                Primary Asset (Cover)
              </h3>
              <div className="relative group border border-neutral-300 border-dashed hover:border-black bg-neutral-50 transition-colors aspect-[4/5] flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                <input 
                  name="image" 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={handleImageChange} 
                  disabled={isSubmitting} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-neutral-400 group-hover:text-black transition-colors">
                    <UploadCloud className="w-8 h-8" />
                    <span className="text-xs font-bold tracking-widest uppercase">Upload Image</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mb-4 flex items-center justify-between">
                <span>Gallery Assets</span>
                <span className="text-neutral-400 font-light lowercase">({galleryImages.length} selected)</span>
              </h3>
              <div className="relative group border border-neutral-300 border-dashed hover:border-black bg-neutral-50 p-6 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <input 
                  name="gallery" 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleGalleryChange} 
                  disabled={isSubmitting} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className="flex flex-col items-center gap-3 text-neutral-400 group-hover:text-black transition-colors">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs font-bold tracking-widest uppercase text-center">Add Multiple Images</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-auto pt-6 border-t border-neutral-200">
              <button 
                type="submit" 
                disabled={isSubmitting || selectedSizes.length === 0}
                className={`w-full py-5 text-sm font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-colors duration-300
                  ${isSubmitting || selectedSizes.length === 0 
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98]'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress || "Processing..."}</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Product</span>
                    <Plus className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </motion.div>

        </form>
      </main>
    </div>
  );
}