'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-accent uppercase tracking-widest text-sm font-medium mb-4 block">Our Story</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary leading-tight mb-8">
            The Pursuit of <br/> Perfection.
          </h1>
          <p className="text-lg md:text-2xl text-muted font-light leading-relaxed">
            OW Motors, situated in the heart of Lahore at Peco Road Township, is Pakistan's premier destination for heavy bikes. We redefine the riding experience with a curated collection of luxury, sports, and electric two-wheelers.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="aspect-[16/9] md:aspect-[21/9] bg-secondary/20 mb-24 relative overflow-hidden"
        >
             {/* Placeholder for a wide editorial image */}
             <div className="absolute inset-0 flex items-center justify-center text-muted/30 text-4xl font-serif italic">
               OW Motor Sports / Showroom
             </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
           <div>
              <h3 className="text-2xl font-serif text-primary mb-6">Philosophy</h3>
              <p className="text-muted leading-relaxed mb-6">
                Under the vision of Omer Waseem, we believe that a motorcycle is more than just a machine—it's a statement of freedom and power. From Kawasaki Ninjas to Ducati masterpieces, our collection represents the pinnacle of engineering.
              </p>
              <p className="text-muted leading-relaxed">
                We reject the clutter of traditional dealerships. Our showroom on Peco Road offers a spacious, gallery-like environment where you can appreciate the fine details of every curve and component.
              </p>
           </div>
           <div>
              <h3 className="text-2xl font-serif text-primary mb-6">The Collection</h3>
              <p className="text-muted leading-relaxed mb-6">
                We specialize in Heavy Bikes, Sports Bikes, and premium Scooters. Whether you are looking for the raw power of a 1000cc beast or the urban agility of a modern electric scooter, OW Motors provides authentic, high-quality machines for the true enthusiast.
              </p>
           </div>
        </div>

        <div className="border-t border-secondary/30 pt-16 text-center">
           <h3 className="text-3xl font-serif text-primary mb-8">Visit Our Showroom</h3>
           <p className="text-muted max-w-lg mx-auto mb-8">
             Shop#61-A, Main Peco Road Township, Lahore.<br/>
             Come experience the roar of our engines firsthand.
           </p>
        </div>

      </div>
    </div>
  );
}
