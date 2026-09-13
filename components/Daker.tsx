"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data - replace titles and descriptions with your t('...') translation keys
const slides = [
  {
    id: 0,
    title: "COMMUNITY-DRIVEN CULTURE",
    desc: "More than just a brand, we're a movement—connecting creatives, athletes, and trendsetters who define the streets. Welcome to ATHLETIX.",
    img: "p_img8.png",
    navLine1: "01",
    navLine2: "Limited Drops. Maximum Impact."
  },
  {
    id: 1,
    title: "BUILT FOR THE STREETS",
    desc: "Engineered for the unseen elements of the modern environment. Zero distractions. Pure physical expression.",
    img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop",
    navLine1: "02",
    navLine2: "Built for the Streets"
  },
  {
    id: 2,
    title: "KINETIC ARCHITECTURE",
    desc: "Premium materials sculpted to fit. Experience the raw intersection of high fashion and athletic utility.",
    img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop",
    navLine1: "03",
    navLine2: "ATHLETIX Attitude"
  },
  {
    id: 3,
    title: "FUTURE-READY FASHION",
    desc: "Archive access granted. Unreleased colorways and rare iterations available for 48 hours only.",
    img: "https://images.unsplash.com/photo-1512353087810-254cb9859f69?q=80&w=2000&auto=format&fit=crop",
    navLine1: "04",
    navLine2: "Future-Ready Fashion"
  },
  {
    id: 4,
    title: "THE VAULT IS OPEN",
    desc: "Secure your pieces before they vanish. Join the collective and unlock exclusive drops.",
    img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2000&auto=format&fit=crop",
    navLine1: "05",
    navLine2: "Community-Driven Culture"
  }
];

const Hero = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);

  // Auto-play the slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full mt-24 lg:mt-28 px-4 md:px-8 max-w-[95rem] mx-auto">
      <div className="relative w-full h-[35rem] md:h-[45rem] lg:h-[50rem] bg-black rounded-[2rem] overflow-hidden flex flex-col justify-end group shadow-2xl">
        
        {/* Layer 1: Background Images (Crossfade) */}
        <AnimatePresence initial={false}>
          <motion.img
            key={active}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            src={slides[active].img}
            alt="Athletix Campaign"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </AnimatePresence>

        {/* Layer 2: Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />

        {/* Layer 3: Main Text Content */}
        <div className="relative z-20 px-8 md:px-16 lg:px-24 pb-32 md:pb-40 w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter uppercase leading-[0.9] text-white mb-6">
                {slides[active].title}
              </h1>
              <p className="text-neutral-300 text-sm md:text-base font-medium tracking-wide leading-relaxed max-w-lg mb-8">
                {slides[active].desc}
              </p>
              
              {/* Pill-shaped Button */}
              <a 
                href="#products" 
                className="inline-flex items-center gap-4 bg-white text-black pl-8 pr-2 py-2 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform duration-300"
              >
                {t('shopNow') || "Shop Now"}
                <span className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Layer 4: Bottom Slider Navigation */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-8 md:px-16 lg:px-24 pb-8">
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {slides.map((slide, index) => (
              <div 
                key={slide.id}
                onClick={() => setActive(index)}
                className="cursor-pointer group flex flex-col justify-end"
              >
                {/* Progress Bar Container */}
                <div className="w-full h-[2px] bg-white/20 mb-3 relative overflow-hidden">
                  {active === index && (
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 6, ease: "linear" }}
                      className="absolute top-0 left-0 h-full bg-white"
                    />
                  )}
                </div>
                
                {/* Nav Text */}
                <div className={`hidden md:block text-[10px] uppercase tracking-widest transition-colors duration-300 ${active === index ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                  <span className="font-black block mb-1">{slide.navLine1}</span>
                  <span className="font-medium line-clamp-1">{slide.navLine2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;