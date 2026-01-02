'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Hero3D } from '@/components/Hero3D';
import { Button } from '@/components/Button';
import { ArrowRight } from 'lucide-react';

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
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background 3D */}
        <Hero3D />
        
        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.p variants={fadeInUp} className="text-xs md:text-sm lg:text-base tracking-[0.2em] text-accent uppercase mb-4 md:mb-6 font-medium">
            OW Motors
          </motion.p>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-8xl font-serif text-primary mb-6 md:mb-8 leading-tight">
            Crafted Performance.<br />
            Timeless Design.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-muted text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-12 font-light leading-relaxed">
            Experience the epitome of two-wheeled luxury. Where engineering meets art, and every ride becomes a statement.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/catalogue">
              <Button variant="outline" size="lg" className="group text-sm md:text-base px-6 py-3 md:px-8 md:py-4">
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

          {/* Placeholder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] bg-secondary/20 mb-6 overflow-hidden relative">
                  {/* Placeholder Image */}
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" /> 
                  <div className="absolute inset-0 flex items-center justify-center text-muted/50 font-serif text-2xl">
                    {item === 1 ? 'Heavy Bikes' : item === 2 ? 'Sports' : 'Scooters'}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-serif text-primary mb-2 group-hover:text-accent transition-colors">
                  {item === 1 ? 'Kawasaki Series' : item === 2 ? 'Ducati Series' : 'OW Electric'}
                </h3>
                <p className="text-sm text-muted uppercase tracking-wider">Starting at PKR {item === 3 ? '3.5 Lac' : '18.5 Lac'}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 md:hidden text-center">
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
