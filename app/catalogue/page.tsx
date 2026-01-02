'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VehicleCard } from '@/components/VehicleCard';

// Mock Data
const vehicles = [
  { id: '1', name: 'Kawasaki Ninja 400', tagline: 'Track Born, Street Bred', price: 'PKR 18.5 Lac' },
  { id: '2', name: 'Ducati Panigale V4', tagline: 'The Science of Speed', price: 'PKR 85.0 Lac' },
  { id: '3', name: 'BMW S1000RR', tagline: 'Adrenaline Redefined', price: 'PKR 75.0 Lac' },
  { id: '4', name: 'Yamaha R1M', tagline: 'MotoGP Technology', price: 'PKR 68.0 Lac' },
  { id: '5', name: 'Suzuki Hayabusa', tagline: 'The Ultimate Sportbike', price: 'PKR 55.0 Lac' },
  { id: '6', name: 'OW Electric Scooter', tagline: 'Urban Mobility', price: 'PKR 3.5 Lac' },
];

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
            Discover our premium selection of heavy bikes and scooters. 
            From track-ready beasts to efficient urban cruisers.
          </motion.p>
        </div>

        {/* Filter (Placeholder) */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-16 text-sm uppercase tracking-widest text-muted">
           <button className="text-primary border-b border-primary pb-1">All Stock</button>
           <button className="hover:text-primary transition-colors">Heavy Bikes</button>
           <button className="hover:text-primary transition-colors">Sports Bikes</button>
           <button className="hover:text-primary transition-colors">Scooters</button>
           <button className="hover:text-primary transition-colors">Replicas</button>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16"
        >
          {vehicles.map((vehicle) => (
            <motion.div key={vehicle.id} variants={itemVariants}>
              <VehicleCard {...vehicle} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
