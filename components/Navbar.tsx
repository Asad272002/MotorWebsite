'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/Button';

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
            ? 'bg-secondary/70 shadow-xl border border-white/10 backdrop-blur-md py-3 px-8 w-full max-w-6xl' 
            : (isHomePage 
                ? 'bg-background/30 border border-white/10 backdrop-blur-md py-4 px-8 w-full max-w-7xl shadow-lg'
                : 'bg-background/20 border border-white/5 backdrop-blur-md py-4 px-8 w-full max-w-7xl')
        )}
      >
        <Link href="/" className="relative z-50 flex items-center gap-3">
          <span
            className={clsx(
              'relative h-10 w-10 md:h-11 md:w-11 overflow-hidden rounded-full border shadow-sm',
              isScrolled || !isHomePage
                ? 'border-white/10 bg-white/5 backdrop-blur'
                : 'border-white/10 bg-white/5 backdrop-blur'
            )}
          >
            <Image
              src="/owmotor.png"
              alt="OW Motor Sports"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span
            className={clsx(
              'font-serif font-bold text-lg md:text-xl tracking-widest uppercase transition-colors duration-300 drop-shadow-sm',
              isScrolled || !isHomePage ? 'text-champagne' : 'text-champagne'
            )}
          >
            OW Motors
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'text-sm uppercase tracking-widest transition-colors duration-300 relative group',
                pathname === link.href
                  ? 'text-champagne'
                  : 'text-foreground/80 hover:text-foreground'
              )}
            >
              {link.name}
              <span 
                className={clsx(
                  "absolute -bottom-1 left-0 h-[1px] transition-all duration-300",
                  "bg-accent",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}

          <a
            href="https://maps.app.goo.gl/GtwvrJteHG5GjoNt5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" className="rounded-full px-5 py-2">
              Visit Showroom
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={clsx(
            "md:hidden relative z-10 p-2 transition-colors duration-300 rounded-full border border-white/15 bg-secondary/70 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.45)] text-champagne"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />

            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute right-4 top-4 bottom-4 w-[86vw] max-w-[360px] rounded-[28px] border border-white/10 bg-secondary/85 backdrop-blur-xl shadow-[0_60px_140px_rgba(0,0,0,0.7)] p-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted">
                  Menu
                </span>
                <button
                  className="text-champagne p-3 rounded-full border border-white/15 bg-black/20 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-10 flex flex-col gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-serif text-3xl text-champagne hover:text-foreground transition-colors tracking-widest"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <a
                  href="https://maps.app.goo.gl/GtwvrJteHG5GjoNt5"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="primary" size="lg" className="rounded-full w-full justify-center">
                    Visit Showroom
                  </Button>
                </a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
