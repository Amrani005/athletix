'use client'
import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: ["Men's Collection", "Women's Collection", "Equipment", "New Arrivals"],
  },
  {
    title: "Support",
    links: ["Track Order", "Returns & Exchanges", "Size Guide", "FAQ"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Shipping Policy"],
  },
];

export const socialMedia = [
  { id: 1, img: "/git.svg", alt: "GitHub" },
  { id: 2, img: "/twit.svg", alt: "Twitter" },
  { id: 3, img: "/link.svg", alt: "LinkedIn" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-neutral-50 pt-16 pb-8 px-6 md:px-12 lg:px-24 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Top Section: Newsletter & Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Newsletter Input */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              Unlock Exclusive Drops.
            </h2>
            <p className="text-neutral-500 font-light max-w-sm">
              Subscribe to get early access to new collections, restocks, and exclusive Athletix deals.
            </p>
            
            {/* Newsletter Input Field */}
            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex items-center w-full max-w-md mt-2 border-b border-neutral-300 focus-within:border-neutral-900 transition-colors duration-300 pb-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400 font-light"
              />
              <button 
                type="submit" 
                className="ml-4 p-2 text-neutral-400 hover:text-neutral-900 transition-colors duration-300"
                aria-label="Subscribe"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {FOOTER_LINKS.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-widest">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3 text-neutral-500 font-light">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="hover:text-neutral-900 transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-neutral-200">
          
          <h1 className="text-sm font-medium text-neutral-500 tracking-wide text-center md:text-left">
            &copy; {currentYear} Athletix. All rights reserved.
          </h1>
          
          <div className="flex items-center gap-4">
            {socialMedia.map((item) => (
              <a 
                key={item.id} 
                href="#" 
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-neutral-200 hover:bg-neutral-900 transition-all duration-300"
                aria-label={item.alt}
              >
                <img 
                  src={item.img} 
                  alt={item.alt} 
                  className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:invert transition-all duration-300"
                />
              </a>
            ))}
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;