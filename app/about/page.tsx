"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
// Assuming Header is in your global layout, if not, uncomment the import and usage below
// import Header from '@/components/Header';
import Footer from "@/components/Footer";
import { options } from "../layout";
import Header from "@/components/Header";

const About = () => {
  // Cinematic staggering animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (

    <div className="w-full  bg-white text-black
     selection:bg-black selection:text-white  flex
      flex-col">
      {/* <Header /> */}
       <Header/>
      <div className="max-w-[90rem] mx-auto  mt-25 lg:mt-35  px-4 md:px-8 w-full flex-grow">
        
        {/* Editorial Header */}
        <motion.div 
          initial="hidden"
          animate="show"
          className="border-b border-neutral-200 pb-8 mb-12 lg:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-medium tracking-tighter uppercase text-black">
            The Vision
          </h1>
          <p className="text-neutral-500 mt-4 text-sm tracking-widest uppercase">
            EST. 2026 // Athletix
          </p>
        </motion.div>

        {/* Split Screen Concept */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-32">
          
          {/* Left: Cinematic Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop" 
              alt="Athletix Design Philosophy" 
              
              className="object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Right: Editorial Copy */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              show: { transition: { staggerChildren: 0.2 } }
            }}
            className="lg:col-span-7 flex flex-col justify-center gap-12 lg:pr-10"
          >
            <motion.div  className="flex flex-col gap-6 text-lg md:text-2xl font-light leading-relaxed text-neutral-600">
              <p>
                <strong className="font-medium text-black">Athletix</strong> was born from a desire to bridge the gap between high-performance technical wear and minimalist urban architecture. We do not just design garments; we engineer them.
              </p>
              <p>
                Every silhouette is meticulously crafted using proprietary textiles to ensure fluidity, durability, and a striking visual presence. We stripped away the noise, the logos, and the excess, leaving only what is essential for the modern environment.
              </p>
            </motion.div>

            <motion.div  className="border-l border-black pl-8 mt-4">
              <h2 className="text-xs font-bold tracking-[0.2em] text-black uppercase mb-4">
                Our Directive
              </h2>
              <p className="text-xl md:text-3xl font-medium tracking-tight text-black leading-snug">
                To redefine the modern uniform through kinetic architecture and uncompromising material quality.
              </p>
            </motion.div>
          </motion.div>

        </div>

        {/* Brand Pillars (Replaces "Why Choose Us") */}
        <div className="pb-24">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-end justify-between border-b border-neutral-200 pb-8 mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter uppercase text-black">
              The Standard
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              show: { transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16"
          >
            {/* 
              Maps over your layout options. 
              Assuming item.title and item.desc exist.
            */}
            {options.map((item, index) => (
              <motion.div 
                key={index}
                className="flex flex-col border-t-2 border-black pt-6"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 mb-6">
                  0{index + 1}
                </span>
                <h3 className="font-medium text-2xl tracking-tight uppercase mb-4 text-black">
                  {item.title}
                </h3>
                <p className="text-neutral-500 font-light text-base leading-relaxed tracking-wide">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>

      <div className="border-t border-neutral-200 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default About;