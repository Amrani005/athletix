'use client'

import React, { useState, useEffect, useRef } from 'react'; // EDITED
import Link from 'next/link';
import { navigation } from '@/app/layout';
import { useCartCount } from '@/app/context/CartCountContext';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import { useSession, signOut } from 'next-auth/react'; // ADDED

import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingBagIcon,
  Bars2Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Header = () => {

  const { data: session } = useSession(); // ADDED

  const { refreshCartCount, cartCount } = useCartCount();

  const [openNavigation, setOpenNavigation] = useState(false);

  const [openProfileCard, setOpenProfileCard] = useState(false); // ADDED

  const profileRef = useRef<HTMLDivElement>(null); // ADDED

  // ADDED
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfileCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up scroll lock if component unmounts
  useEffect(() => {
    return () => enablePageScroll();
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const closeNavigation = () => {
    setOpenNavigation(false);
    enablePageScroll();
  };

  return (
    <header className="fixed top-0 left-0 shadow-2xl shadow-black w-full z-50 bg-white border-b border-neutral-200 selection:bg-black selection:text-white">
      <div className="max-w-[90rem] mx-auto px-6 md:px-8 h-20 md:h-24 flex items-center justify-between">

        {/* LEFT: Mobile Hamburger & Desktop Navigation */}
        <div className="flex-1 flex items-center">

          {/* Mobile Menu Trigger */}
          <button
            onClick={toggleNavigation}
            className="lg:hidden p-2 -ml-2 text-black hover:opacity-70 transition-opacity z-50 relative"
          >
            {openNavigation ? (
              <XMarkIcon className="w-7 h-7 stroke-[1.5]" />
            ) : (
              <Bars2Icon className="w-7 h-7 stroke-[1.5]" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8">
            {navigation.map((item) => (
              <Link  
                key={item.id}
                href={item.url}
                className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-black transition-colors duration-300 relative group"
              >
                {item.title}

                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* CENTER: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <Link href="/home" onClick={closeNavigation}> 
          
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-black">
              ATHLETIX
            </h1>
          </Link>
        </div>

        {/* RIGHT: Utility Icons */}
        <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6 z-50 relative">

          <Link href="/collection" className="text-black hover:opacity-50 transition-opacity">
            <MagnifyingGlassIcon className="w-6 h-6 stroke-[1.5]" />
          </Link>

          {/* USER ICON SECTION - EDITED */}
          <div className="relative hidden sm:block" ref={profileRef}>

            {!session?.user ? (

              // NOT SIGNED IN - ZINC ICON
              <Link
                href="/login"
                className="text-zinc-400 hover:text-black transition-colors"
              >
                <UserIcon className="w-6 h-6 stroke-[1.5]" />
              </Link>

            ) : (

              // SIGNED IN - BLACK ICON + PROFILE CARD
              <>
                <button
                  onClick={() => setOpenProfileCard(!openProfileCard)}
                  className="text-black hover:opacity-50 transition-opacity"
                >
                  <UserIcon className="w-6 h-6 stroke-[1.5]" />
                </button>

                {/* PROFILE CARD - ADDED */}
                <div
                  className={`absolute right-0 top-12 w-64 bg-white border border-neutral-200 shadow-2xl transition-all duration-300 overflow-hidden
                  ${openProfileCard
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                >

                  <div className="p-5 border-b border-neutral-100">

                    <p className="text-sm text-neutral-500">
                      Signed in as
                    </p>

                    <p className="font-semibold text-black truncate">
                      {session.user.email}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      signOut({
                        callbackUrl: '/login',
                      })
                    }
                    className="w-full text-left px-5 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>

                </div>
              </>
            )}
          </div>

          {/* CART */}
          <Link href="/cart" className="relative text-black hover:opacity-50 transition-opacity flex items-center">

            <ShoppingBagIcon className="w-6 h-6 stroke-[1.5]" />

            <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>

          </Link>
        </div>
      </div>

      {/* FULL-SCREEN MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] flex flex-col justify-center px-8
        ${openNavigation ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'}`}
      >
        <nav className="flex flex-col gap-6">

          {navigation.map((item, index) => (
            <div
              key={item.id}
              className="overflow-hidden"
            >
              <Link
                href={item.url}
                onClick={closeNavigation}
                className={`block text-4xl sm:text-5xl font-medium tracking-tighter uppercase text-black hover:text-neutral-400 transition-colors duration-300 transform
                  ${openNavigation ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {item.title}
              </Link>
            </div>
          ))}

          <div className="w-full h-px bg-neutral-200 my-4"></div>

          <Link
            href="/login"
            onClick={closeNavigation}
            className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
          >
            My Account
          </Link>

        </nav>
      </div>
    </header>
  );
};

export default Header;