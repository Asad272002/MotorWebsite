import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-secondary/30 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl tracking-widest text-primary uppercase">OW Motors</h2>
          <p className="text-muted text-sm max-w-xs leading-relaxed">
            Shop#61-A, Main Peco Road Township,<br />
            Lahore, Pakistan.<br />
            <span className="block mt-2">+92 322 2033399</span>
          </p>
        </div>

        {/* Links */}
        <div className="flex space-x-12 text-sm tracking-wide">
          <div className="flex flex-col space-y-3">
            <span className="text-primary font-medium mb-1">Explore</span>
            <Link href="/catalogue" className="text-muted hover:text-primary transition-colors">Catalogue</Link>
            <Link href="/about" className="text-muted hover:text-primary transition-colors">About</Link>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="text-primary font-medium mb-1">Contact</span>
            <Link href="/contact" className="text-muted hover:text-primary transition-colors">Inquiries</Link>
            <Link href="mailto:omerwaseem.97@gmail.com" className="text-muted hover:text-primary transition-colors">omerwaseem.97@gmail.com</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center text-xs text-muted uppercase tracking-wider">
        <p>&copy; {new Date().getFullYear()} OW Motors. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://www.instagram.com/owmotors.official/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          <a href="https://www.youtube.com/@owmotorsports" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube</a>
          <a href="https://www.facebook.com/owmotors" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
};
