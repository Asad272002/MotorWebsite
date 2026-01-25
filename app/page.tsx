'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { HeroVideo } from '@/components/HeroVideo';
import { Button } from '@/components/Button';
import { VehicleCard } from '@/components/VehicleCard';
import { ArrowRight } from 'lucide-react';
import { vehiclesData } from '@/data/vehicles';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const featuredVehicles = Object.values(vehiclesData).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[100dvh] min-h-[600px] flex items-end justify-start overflow-hidden">
        {/* Background Video */}
        <HeroVideo />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-[1] pointer-events-none" />

        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-left px-6 pb-20 md:pb-40 md:pl-20 max-w-5xl w-full"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-[#D4C5B0] mb-6 md:mb-8 leading-tight drop-shadow-2xl">
            Crafted Performance.<br />
            Timeless Design.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-[#F9F9F7] text-sm sm:text-base md:text-xl max-w-xl mb-8 md:mb-12 font-light leading-relaxed drop-shadow-xl">
            Experience the epitome of two-wheeled luxury. Where engineering meets art, and every ride becomes a statement.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/catalogue">
              <Button variant="outline" size="lg" className="group text-sm md:text-base px-6 py-3 md:px-8 md:py-4 border-white text-white hover:bg-white hover:text-black hover:border-white backdrop-blur-sm bg-white/5">
                Explore Collection
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Collection Teaser */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">The Collection</h2>
              <p className="text-muted max-w-md">Curated for the discerning rider. Discover our latest arrivals.</p>
            </div>
            <Link href="/catalogue" className="hidden md:block">
              <Button variant="ghost">View All Vehicles <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div 
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <VehicleCard 
                  id={vehicle.id}
                  name={vehicle.name}
                  tagline={vehicle.tagline}
                  price={vehicle.price}
                  image={vehicle.imagePath}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/catalogue">
              <Button variant="ghost">View All Vehicles <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Editorial Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
               <h2 className="text-4xl md:text-5xl font-serif text-primary mb-8 leading-tight">
                 Redefining the<br />
                 Riding Experience
               </h2>
               <p className="text-muted text-lg leading-relaxed mb-8">
                 At OW Motors, we believe a motorcycle is more than just a machine; it is an extension of one's personality. Our showroom is designed to be a sanctuary for enthusiasts, free from the noise of traditional dealerships.
               </p>
               <Link href="/about">
                 <Button variant="primary">Read Our Story</Button>
               </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-square bg-secondary/30 relative overflow-hidden"
            >
               {/* Abstract Editorial Image Placeholder */}
               <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-serif italic text-4xl text-primary/20">Editorial</span>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
