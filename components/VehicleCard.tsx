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
  return (
    <Link href={`/catalogue/${id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
      >
        <div className="aspect-[16/10] mb-6 overflow-hidden relative rounded-sm">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
            <div className="absolute -right-28 -top-28 h-[200%] w-[80%] rotate-[-18deg] bg-gradient-to-b from-amber-500/20 via-orange-400/10 to-transparent" />
            <div className="absolute right-0 top-0 h-full w-[70%] bg-[radial-gradient(circle_at_1px_1px,rgba(245,158,11,0.14)_1px,transparent_0)] bg-[length:18px_18px] opacity-30" />
            <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
          </div>
          {image ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               src={image} 
               alt={name} 
               className="relative w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
             />
          ) : (
            <>
              <div className="absolute inset-0 bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center text-muted/50 font-serif text-xl">
                 {name}
              </div>
            </>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 pointer-events-none">
            {cc ? (
              <span className="bg-white/85 backdrop-blur border border-amber-200/70 text-slate-950 text-xs uppercase tracking-widest px-3 py-2 w-fit">
                {cc} CC
              </span>
            ) : (
              <span />
            )}
            <span className="bg-white/85 backdrop-blur border border-amber-200/70 text-slate-950 text-xs uppercase tracking-widest px-3 py-2 w-fit sm:ml-auto">
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
             <span className="bg-white/90 backdrop-blur text-primary text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 shadow-sm">
                View Details <ArrowUpRight size={14} />
             </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-serif text-primary group-hover:text-accent transition-colors duration-300">
            {name}
          </h3>
          <p className="text-sm text-muted mt-1">{tagline}</p>
          {/* Mobile-only "View" text if we really want it? Nah, standard pattern. */}
        </div>
      </motion.div>
    </Link>
  );
};
