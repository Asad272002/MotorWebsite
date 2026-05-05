'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { HeroVideo } from '@/components/HeroVideo';
import { Atmosphere3D } from '@/components/Atmosphere3D';
import { Button } from '@/components/Button';
import { VehicleCard } from '@/components/VehicleCard';
import { ArrowRight } from 'lucide-react';
import { formatPricePkr, getBikeTopVariant, vehiclesData } from '@/data/vehicles';

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
  const detailSlugOverrides: Record<string, string> = {
    'lifan-kpm-200': 'lifan-kpm',
  };

  const featuredVehicles = [
    vehiclesData['taro-gp-2'],
    vehiclesData['taro-gp-1'],
    vehiclesData['taro-c6'],
    vehiclesData['lifan-kpm-200'],
    vehiclesData['lifan-v16s'],
  ].filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[100dvh] min-h-[600px] flex items-end justify-start overflow-hidden">
        {/* Background Video */}
        <HeroVideo />

        <Atmosphere3D className="absolute inset-0 z-[1] pointer-events-none opacity-20 mix-blend-screen" />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/55 to-transparent z-[2] pointer-events-none" />

        {/* Content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 text-left px-6 pb-20 md:pb-40 md:pl-20 max-w-5xl w-full"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif text-champagne mb-6 md:mb-8 leading-tight drop-shadow-2xl">
            Crafted Performance.<br />
            Timeless Design.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-foreground/85 text-sm sm:text-base md:text-xl max-w-xl mb-8 md:mb-12 font-light leading-relaxed drop-shadow-xl">
            Experience the epitome of two-wheeled luxury. Where engineering meets art, and every ride becomes a statement.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/catalogue">
              <Button variant="primary" size="lg" className="rounded-full">
                Browse Catalogue
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a
              href="https://maps.app.goo.gl/GtwvrJteHG5GjoNt5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="rounded-full">
                Visit Showroom
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Collection Teaser */}
      <section className="py-24">
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
                {(() => {
                  const top = getBikeTopVariant(vehicle.name);
                  const displayPrice = top ? formatPricePkr(top.pricePkr) : vehicle.price;
                  const detailSlug = detailSlugOverrides[vehicle.id] ?? vehicle.id;
                  return (
                    <VehicleCard
                      id={detailSlug}
                      name={vehicle.name}
                      tagline={vehicle.tagline}
                      price={displayPrice}
                      cc={top?.cc}
                      image={vehicle.imagePath}
                    />
                  );
                })()}
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
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-secondary/30 border border-white/10 rounded-[28px] p-8 md:p-14 shadow-[0_50px_120px_rgba(0,0,0,0.55)]">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
               <h2 className="text-4xl md:text-5xl font-serif text-champagne mb-8 leading-tight">
                 Redefining the<br />
                 Riding Experience
               </h2>
               <p className="text-muted text-lg leading-relaxed mb-8">
                 At OW Motors, we believe a motorcycle is more than just a machine; it is an extension of one&apos;s personality. Our showroom is designed to be a sanctuary for enthusiasts, free from the noise of traditional dealerships.
               </p>
               <Link href="/about">
                 <Button variant="primary" className="rounded-full">Read Our Story</Button>
               </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="aspect-square bg-black/20 border border-white/10 rounded-3xl relative overflow-hidden"
            >
              <Image
                src="/showroom.png"
                alt="OW Motors showroom"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-black/10" />
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
