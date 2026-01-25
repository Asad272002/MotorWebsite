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
  image?: string; // URL or placeholder
}

export const VehicleCard: React.FC<VehicleProps> = ({ id, name, tagline, price, image }) => {
  return (
    <Link href={`/catalogue/${id}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
      >
        <div className="aspect-[16/10] bg-secondary/20 mb-6 overflow-hidden relative">
          {image ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img 
               src={image} 
               alt={name} 
               className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out bg-white"
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
          
          {/* View Details Button (appears on hover) */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="bg-white/90 backdrop-blur text-primary text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                View Details <ArrowUpRight size={14} />
             </span>
          </div>
        </div>

        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-serif text-primary group-hover:text-accent transition-colors duration-300">
                    {name}
                </h3>
                <p className="text-sm text-muted mt-1">{tagline}</p>
            </div>
            <span className="text-sm font-medium text-primary/80">{price}</span>
        </div>
      </motion.div>
    </Link>
  );
};
