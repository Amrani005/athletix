"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react"; // أضف هذا
import { useRouter } from "next/navigation"; // أضف هذا

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your authentication logic here
    setLoading(true);
    setError("");

    // محاولة تسجيل الدخول عبر NextAuth
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // لا نريد إعادة توجيه تلقائية من المكتبة
    });

    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/"); // التوجه للرئيسية بعد النجاح
      router.refresh(); // تحديث الصفحة ليعرف النظام أن المستخدم سجل دخوله
    }
    console.log("Logging in:", formData.email);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black px-4 selection:bg-black selection:text-white flex">
      
      {/* Left Column: Editorial Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-100">
        <img 
          src="https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=1000&auto=format&fit=crop" 
          alt="Athletix Editorial Campaign"
          
          
          className="object-cover grayscale w-full h-full"
          sizes="50vw"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Brand Anchor */}
        <div className="absolute bottom-10 left-10">
          <Link href="/" className="text-white text-2xl font-medium tracking-tighter uppercase drop-shadow-md">
            Athletix.
          </Link>
        </div>
      </div>

      {/* Right Column: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md flex flex-col"
        >
          
          {/* Mobile Brand Anchor */}
          <Link href="/" className="lg:hidden text-2xl font-medium tracking-tighter uppercase mb-12">
            Athletix.
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase mb-4 text-black">
              Sign In
            </h1>
            <p className="text-neutral-500 text-sm tracking-wide leading-relaxed">
              Access the archive. View your order history, track shipments, and manage your preferences.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Email Input (Floating Label) */}
            <div className="relative group">
              <input 
                type="email" 
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-base font-light"
              />
              <label 
                htmlFor="email"
                className="absolute top-3 text-neutral-400 text-base font-light transition-all duration-300 transform -translate-y-7 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black"
              >
                Email Address
              </label>
            </div>

            {/* Password Input (Floating Label) */}
            <div className="relative group">
              <input 
                type="password" 
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-base font-light tracking-widest"
              />
              <label 
                htmlFor="password"
                className="absolute top-3 text-neutral-400 text-base font-light transition-all duration-300 transform -translate-y-7 scale-75 origin-left tracking-normal peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black"
              >
                Password
              </label>
            </div>

            {/* Submit */}
            <div className="pt-4 flex flex-col gap-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors duration-300 active:scale-[0.98] disabled:opacity-50"
              >
               {loading ? "Accessing..." : "Access Account"}
              </button>

{/* إضافة رسالة خطأ أسفل الزر في حال فشل الدخول */}
              {error && (
              <p className="text-red-500 text-xs font-bold uppercase text-center mt-4">
               {error}
              </p>
            )}
            </div>

          </form>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <Link 
              href="/forgot-password" 
              className="font-bold tracking-wide text-neutral-500 hover:text-black transition-colors"
            >
              Forgot Password?
            </Link>
            <Link 
              href="/signup" 
              className="font-bold tracking-wide uppercase text-black underline underline-offset-4 hover:text-neutral-500 transition-colors"
            >
              Create Account
            </Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;