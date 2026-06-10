"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth"; // الدالة التي برمجناها للمرحلة 2

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // استدعاء دالة السيرفر التي تنشئ المستخدم والسلة في Neon
    const result = await registerUser(formData.name, formData.email, formData.password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // نجاح: التوجه لصفحة تسجيل الدخول
      alert("Account created! Please sign in.");
      router.push("/login");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white flex px-4">
      {/* Left Column: Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-100">
        <img 
          src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=1000&auto=format&fit=crop" 
          alt="Athletix Editorial Campaign"
          className="object-cover grayscale h-full w-full"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-10 left-10">
          <Link href="/" className="text-white text-2xl font-medium tracking-tighter uppercase drop-shadow-md">
            Athletix.
          </Link>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md flex flex-col"
        >
          <Link href="/" className="lg:hidden text-2xl font-medium tracking-tighter uppercase mb-12">
            Athletix.
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase mb-4 text-black">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="relative group">
              <input 
                type="text" name="name" id="name" value={formData.name} onChange={handleChange} required placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-base font-light"
              />
              <label htmlFor="name" className="absolute top-3 text-neutral-400 text-base font-light transition-all duration-300 transform -translate-y-7 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black">
                Full Name
              </label>
            </div>

            <div className="relative group">
              <input 
                type="email" name="email" id="email" value={formData.email} onChange={handleChange} required placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-base font-light"
              />
              <label htmlFor="email" className="absolute top-3 text-neutral-400 text-base font-light transition-all duration-300 transform -translate-y-7 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input 
                type="password" name="password" id="password" value={formData.password} onChange={handleChange} required placeholder=" "
                className="block w-full bg-transparent border-0 border-b border-neutral-300 py-3 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-base font-light tracking-widest"
              />
              <label htmlFor="password" className="absolute top-3 text-neutral-400 text-base font-light transition-all duration-300 transform -translate-y-7 scale-75 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-black">
                Password
              </label>
            </div>

            <div className="pt-4 flex flex-col gap-6">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-neutral-200 text-center">
            <Link href="/login" className="font-bold uppercase text-black underline underline-offset-4">
              Sign In Instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;