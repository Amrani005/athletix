"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black selection:bg-black selection:text-white pt-24 lg:pt-32 flex flex-col">
      {/* Assuming <Header /> is rendered globally in your layout, if not, add it here */}
      
      <div className="max-w-[90rem] mx-auto px-4 md:px-8 w-full flex-grow">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-neutral-200 pb-8 mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter uppercase text-black">
            Client Services
          </h1>
          <p className="text-neutral-500 mt-4 text-sm tracking-wide max-w-xl leading-relaxed">
            For inquiries regarding the archive, recent orders, or general styling questions, please submit a request below. Our concierge team operates globally and responds within 24 hours.
          </p>
        </motion.div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pb-20">
          
          {/* Left Column: Editorial Image & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-10"
          >
            {/* Cinematic Image Container */}
            <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
              <img 
                src="contact.png" 
                alt="Athletix Client Services"
                
                className="object-cover h-full grayscale hover:grayscale-0 transition-all duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-6 text-sm font-light tracking-wide text-neutral-600">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-black uppercase mb-2">Headquarters</h3>
                <p>1942 Innovation Drive<br/>Design District, NY 10012</p>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-black uppercase mb-2">Direct Contact</h3>
                <p>concierge@athletix.com<br/>+1 (800) 555-0199</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              
              {/* Name Input */}
              <div className="relative group">
                <input 
                  type="text" 
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light"
                />
                <label 
                  htmlFor="name"
                  className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
                >
                  Full Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <input 
                  type="email" 
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light"
                />
                <label 
                  htmlFor="email"
                  className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
                >
                  Email Address
                </label>
              </div>

              {/* Message Textarea */}
              <div className="relative group mt-4">
                <textarea 
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder=" "
                  className="block w-full bg-transparent border-0 border-b border-neutral-300 py-4 focus:outline-none focus:ring-0 focus:border-black transition-colors peer text-lg font-light resize-none"
                />
                <label 
                  htmlFor="message"
                  className="absolute top-4 text-neutral-400 text-lg font-light transition-all duration-300 transform -translate-y-8 scale-75 origin-left peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-black"
                >
                  Your Message
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="mt-6 w-full md:w-auto self-start px-12 py-5 bg-black text-white text-sm font-bold uppercase tracking-[0.1em] hover:bg-neutral-800 transition-colors duration-300 active:scale-[0.98]"
              >
                Submit Inquiry
              </button>

            </form>
          </motion.div>

        </div>
      </div>
      
      <div className="border-t border-neutral-200 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;