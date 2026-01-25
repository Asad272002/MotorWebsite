'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VehicleCard } from '@/components/VehicleCard';
import { vehiclesData } from '@/data/vehicles';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Catalogue() {
  const [filter, setFilter] = useState<'ALL' | 'TARO' | 'LIFAN'>('ALL');

  const filteredVehicles = Object.values(vehiclesData).filter(vehicle => {
    if (filter === 'ALL') return true;
    return vehicle.brand === filter;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif text-primary mb-6"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-muted text-lg"
          >
            Discover our premium selection of TARO and LIFAN motorcycles. 
            From track-ready beasts to efficient urban cruisers.
          </motion.p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16 text-sm uppercase tracking-widest text-muted">
           <button 
             onClick={() => setFilter('ALL')}
             className={`transition-colors ${filter === 'ALL' ? 'text-primary border-b border-primary pb-1' : 'hover:text-primary'}`}
           >
             All Models
           </button>
           <button 
             onClick={() => setFilter('TARO')}
             className={`transition-colors ${filter === 'TARO' ? 'text-primary border-b border-primary pb-1' : 'hover:text-primary'}`}
           >
             TARO
           </button>
           <button 
             onClick={() => setFilter('LIFAN')}
             className={`transition-colors ${filter === 'LIFAN' ? 'text-primary border-b border-primary pb-1' : 'hover:text-primary'}`}
           >
             LIFAN
           </button>
        </div>

        {/* Grid */}
        <motion.div 
          key={filter} // Re-animate on filter change
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16"
        >
          {filteredVehicles.map((vehicle) => (
            <motion.div key={vehicle.id} variants={itemVariants}>
              <VehicleCard 
                id={vehicle.id}
                name={vehicle.name}
                tagline={vehicle.tagline}
                price={vehicle.price}
                image={vehicle.imagePath}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
