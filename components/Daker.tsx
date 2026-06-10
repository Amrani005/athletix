"use client";

const Hero = () => {
  return (
    <section className="w-full mt-25 lg:mt-30 px-4 md:px-8 max-w-[90rem] mx-auto">
      {/* Editorial Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-4 h-auto lg:h-[50rem]">
        
        {/* 1. Main Hero Block - The "Hook" */}
        <div className="lg:col-span-8 relative bg-black rounded-[2rem] 
        overflow-hidden flex flex-col justify-between p-8 md:p-14 lg:p-20
         group shadow-2xl">
           
           {/* Layer 1: Background Image (z-0) */}
           <img 
             src="p_img8.png" 
             alt="Athletix Main Campaign" 
             className="absolute inset-0 w-full h-full object-cover 
             z-0 transition-transform duration-[2000ms] ease-out 
             group-hover:scale-105"
           />
           
           {/* Layer 2: Deep Moody Overlays (z-10) */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-10 pointer-events-none"></div>
           <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none transition-opacity duration-1000 group-hover:opacity-0"></div>
           
           {/* Layer 3: Content (z-20) */}
           <div className="relative z-20 flex justify-start">
             <span className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/20 bg-black/20 backdrop-blur-md">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
               <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase">
                 Capsule 01 // The Arrival
               </span>
             </span>
           </div>

           <div className="relative z-20 mt-40 lg:mt-0">
             <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-medium tracking-tighter leading-[0.85] text-white mb-8 drop-shadow-2xl">
               KINETIC<br />ARCHITECTURE.
             </h1>
             <p className="text-neutral-300 text-lg md:text-xl font-light tracking-wide leading-relaxed max-w-lg mb-10 drop-shadow-md">
               Zero distractions. Pure physical expression. Engineered for the unseen elements of the modern environment.
             </p>
             
             {/* Sharp, Brutalist CTA */}
             <button className="relative overflow-hidden group/btn inline-flex items-center justify-center px-10 py-5 bg-white text-black text-sm font-bold uppercase tracking-[0.1em] transition-transform active:scale-95">
               <a href="#products" className="relative z-10 flex items-center gap-4">
                 Explore the Drop
                 <svg className="w-5 h-5 transition-transform duration-500 group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </a>
             </button>
           </div>
        </div>

        {/* 2. Secondary Stack - The "Teasers" */}
        <div className="lg:col-span-4 flex flex-col gap-2 md:gap-4 h-[35rem] lg:h-full">
          
          {/* Top Bento - Exclusivity Hook */}
          <div className="flex-1 bg-black rounded-[2rem] p-8 md:p-12 relative overflow-hidden group cursor-pointer">
            {/* Layer 1: Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop" 
              alt="The Vault Sneakers" 
              className="absolute inset-0 w-full h-full object-cover z-0 
              transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Layer 2: Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10 group-hover:bg-black/40 transition-colors duration-500"></div>
            
            {/* Layer 3: Content */}
            <div className="flex flex-col h-full justify-between relative z-20">
              <h3 className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase">Archive Access</h3>
              <div>
                <div className="text-5xl md:text-6xl font- tracking-tighter text-white mb-4 drop-shadow-lg">
                  THE<br />VAULT.
                </div>
                <p className="text-neutral-300 text-sm font-medium tracking-wide">
                  Rare iterations. Unreleased colorways.<br/>Access granted for 48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bento - Material/Texture Hook */}
          <div className="flex-[0.8] bg-black rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex items-end group cursor-pointer">
            {/* Layer 1: Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop" 
              alt="Fabric Texture" 
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Layer 2: Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
            
            {/* Layer 3: Content */}
            <div className="relative z-20 w-full flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-white">Materia Prima</h3>
                <p className="text-neutral-400 text-xs tracking-[0.1em] uppercase mt-2">Sculpted to fit</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500">
                <svg className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;