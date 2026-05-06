import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur shadow-sm">
              <Image
                src="/owmotor.png"
                alt="OW Motor Sports"
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
            <h2 className="font-serif text-xl tracking-widest text-champagne uppercase">
              OW Motors
            </h2>
          </div>
          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Shop#61-A, Main Peco Road Township,<br />
            Lahore, Pakistan.<br />
            <span className="block mt-2">+92 322 2033399</span>
          </p>
        </div>

        <div className="flex space-x-12 text-sm tracking-wide">
          <div className="flex flex-col space-y-3">
            <span className="text-champagne font-medium mb-1">Explore</span>
            <Link href="/catalogue" className="text-muted hover:text-foreground transition-colors">Catalogue</Link>
            <Link href="/about" className="text-muted hover:text-foreground transition-colors">About</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="text-champagne font-medium mb-1">Contact</span>
            <Link href="/contact" className="text-muted hover:text-foreground transition-colors">Inquiries</Link>
            <Link href="mailto:omerwaseem.97@gmail.com" className="text-muted hover:text-foreground transition-colors">omerwaseem.97@gmail.com</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-muted uppercase tracking-wider">
        <p>&copy; {new Date().getFullYear()} OW Motors. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://www.instagram.com/owmotors.official/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
          <a href="https://www.youtube.com/@owmotorsports" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">YouTube</a>
          <a href="https://www.facebook.com/owmotors" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
};
