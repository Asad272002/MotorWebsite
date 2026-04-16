'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface VehicleProps {
  id: string;
  name: string;
  tagline: string;
  price: string;
  cc?: number;
  image?: string; // URL or placeholder
}

export const VehicleCard: React.FC<VehicleProps> = ({
  id,
  name,
  tagline,
  price,
  cc,
  image,
}) => {
  const useMultiplyBlend = (image ?? '').includes('/models/');

  return (
    <Link href={`/catalogue/${id}`}>
      <motion.div 
        whileHover={{ y: -3 }}
        className="group cursor-pointer rounded-2xl overflow-hidden border border-white/10 bg-secondary/35 shadow-[0_30px_60px_rgba(0,0,0,0.35)] hover:bg-secondary/45 transition-colors"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-surface/35 via-background/40 to-background" />
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(216,144,67,0.22),transparent_62%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(215,215,215,0.10)_1px,transparent_0)] bg-[length:18px_18px] opacity-20" />
          </div>
          {image ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               src={image} 
               alt={name} 
               className={`relative w-full h-full object-contain p-4 group-hover:scale-[1.03] transition-transform duration-700 ease-out ${useMultiplyBlend ? 'mix-blend-multiply' : ''}`}
             />
          ) : (
            <>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center text-muted font-serif text-xl">
                 {name}
              </div>
            </>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pointer-events-none">
            {cc ? (
              <span className="bg-black/35 backdrop-blur border border-white/10 text-foreground text-xs uppercase tracking-widest px-3 py-2 w-fit">
                {cc} CC
              </span>
            ) : (
              <span />
            )}
            <span className="bg-black/35 backdrop-blur border border-white/10 text-champagne text-xs uppercase tracking-widest px-3 py-2 w-fit sm:ml-auto">
              {price}
            </span>
          </div>

          {/* View Details Button (appears on hover on desktop, always visible on mobile if needed, or we rely on tap) */}
          {/* Strategy: Keep clean on mobile (no button), relying on the card being clickable. 
              But for clarity, we could show a small icon or just ensure the user knows to tap. 
              Given the 'Vogue' style, less is more. I will keep it as is for mobile (clean), 
              but maybe add a subtle indicator if needed. 
              Actually, let's make the "View Details" button appear on focus-within for accessibility 
              and maybe just keep it simple. 
              
              Let's try to make it visible on small screens? 
              No, that covers the image. 
              
              Let's just ensure the whole card is tappable (it is wrapped in Link).
          */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="bg-black/35 backdrop-blur text-champagne text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 border border-white/10">
                View Details <ArrowUpRight size={14} />
             </span>
          </div>
        </div>

        <div className="px-6 py-6">
          <h3 className="text-xl font-serif text-foreground group-hover:text-champagne transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-muted mt-1">{tagline}</p>
          {/* Mobile-only "View" text if we really want it? Nah, standard pattern. */}
        </div>
      </motion.div>
    </Link>
  );
};
