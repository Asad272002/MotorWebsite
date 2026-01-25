'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className={clsx(
          'transition-all duration-500 ease-in-out rounded-full flex items-center justify-between',
          isScrolled 
            ? 'bg-white/95 shadow-xl border border-gray-200 py-3 px-8 w-full max-w-6xl' 
            : (isHomePage 
                ? 'bg-white/10 border border-white/20 backdrop-blur-md py-4 px-8 w-full max-w-7xl shadow-lg'
                : 'bg-transparent py-4 px-8 w-full max-w-7xl')
        )}
      >
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <h1 className={clsx(
            "font-serif font-bold text-xl md:text-2xl tracking-widest uppercase transition-colors duration-300 drop-shadow-sm",
            (isScrolled || !isHomePage) ? "text-primary" : "text-white"
          )}>
            OW Motors
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'text-sm uppercase tracking-widest transition-colors duration-300 relative group',
                (isScrolled || !isHomePage)
                  ? (pathname === link.href ? 'text-primary' : 'text-muted hover:text-primary')
                  : (pathname === link.href ? 'text-white' : 'text-white/80 hover:text-white')
              )}
            >
              {link.name}
              <span 
                className={clsx(
                  "absolute -bottom-1 left-0 h-[1px] transition-all duration-300",
                  (isScrolled || !isHomePage) ? "bg-primary" : "bg-white",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={clsx(
            "md:hidden relative z-50 p-2 -mr-2 transition-colors duration-300",
            isOpen ? "text-primary" : ((isScrolled || !isHomePage) ? "text-primary" : "text-white")
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 top-0 z-40 bg-white flex flex-col items-center justify-center space-y-8 md:hidden"
            >
              {/* Close Button Positioned absolutely within the fixed overlay */}
              <button
                 className="absolute top-8 right-8 text-primary p-2"
                 onClick={() => setIsOpen(false)}
                 aria-label="Close menu"
              >
                <X size={32} />
              </button>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="font-serif text-3xl text-primary hover:text-accent transition-colors tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
