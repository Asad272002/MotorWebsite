'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import bikesJson from '@/bikes_data/bikes.json';

type Bike = {
  name: string;
  cc: number;
  brand: string;
  specification: string;
  type: string;
  image?: {
    localPath: string;
  };
};

type CatalogBike = Bike & {
  images: string[];
  previewImage: string | null;
};

type CatalogBikeBase = Bike & {
  images: string[];
};

const rawBikes = bikesJson as Bike[];

const baseBikesMap = rawBikes.reduce((acc, bike) => {
  const key = bike.name.trim().toLowerCase();
  const imagePath = bike.image?.localPath;
  const existing = acc[key];

  if (existing) {
    if (imagePath && !existing.images.includes(imagePath)) {
      existing.images.push(imagePath);
    }
    return acc;
  }

  acc[key] = {
    ...bike,
    images: imagePath ? [imagePath] : [],
  };

  return acc;
}, {} as Record<string, CatalogBikeBase>);

const modelImagesByNameKey: Record<string, string[]> = {
  'taro gp 2': ['/models/tarogp2_200.png', '/models/tarogp2_250.png'],
  'taro gp 1': ['/models/tarogp1_400cc.png'],
  'taro gp1': ['/models/tarogp1_250cc.png'],
  'taro c6': ['/models/taroC6_250.png'],
  'taro c5': ['/models/taroC5_401.png'],
  'lifan kpm': ['/models/lifankpm_200.png'],
  'lifan k19': ['/models/lifanK19_200.png'],
  'lifan v16s': ['/models/LifanV16s.png'],
  'lifan kpt': ['/models/lifankpt_400cc.png', '/models/kpt200.png'],
};

const bikes: CatalogBike[] = Object.entries(baseBikesMap).map(([key, bike]) => {
  const modelImages = modelImagesByNameKey[key] ?? [];
  const images = [...bike.images];

  modelImages.forEach((img) => {
    if (!images.includes(img)) {
      images.push(img);
    }
  });

  const previewImage = modelImages[0] ?? images[0] ?? null;

  return {
    ...bike,
    images,
    previewImage,
  };
});

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const replicaBikes = bikes.filter(
  (bike) => bike.type.toLowerCase() === 'replica'
);

const originalBikes = bikes.filter(
  (bike) => bike.type.toLowerCase() === 'original'
);

const replicaCcOptions = Array.from(
  new Set(replicaBikes.map((bike) => bike.cc))
).sort((a, b) => a - b);

const originalByBrand = originalBikes.reduce(
  (acc, bike) => {
    const brandKey = bike.brand.trim();
    if (!acc[brandKey]) {
      acc[brandKey] = [];
    }
    acc[brandKey].push(bike);
    return acc;
  },
  {} as Record<string, CatalogBike[]>
);

const ORIGINAL_BRANDS_ORDER = ['Taro', 'Lifan', 'Hi speed', 'Super star'];

export default function Catalogue() {
  const [activeCategory, setActiveCategory] = useState<'ORIGINAL' | 'REPLICA'>(
    'ORIGINAL'
  );
  const [originalBrandFilter, setOriginalBrandFilter] = useState<
    'ALL' | string
  >('ALL');
  const [replicaCcFilter, setReplicaCcFilter] = useState<number | 'ALL'>('ALL');

  const filteredReplicaList = replicaBikes.filter((bike) => {
    if (replicaCcFilter === 'ALL') return true;
    return bike.cc === replicaCcFilter;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
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
            Explore the complete OW Motors inventory, including original machines
            and carefully selected replicas.
          </motion.p>
        </div>

        <div className="mt-24 border-t border-secondary/30 pt-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Full Inventory
            </h2>
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
              Start by choosing Originals or Replicas, then refine by brand or
              engine size.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-secondary/40 bg-white/80 backdrop-blur-sm p-1 text-xs uppercase tracking-widest">
              <button
                onClick={() => setActiveCategory('ORIGINAL')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === 'ORIGINAL'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => setActiveCategory('REPLICA')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === 'REPLICA'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Replicas
              </button>
            </div>
          </div>

          {activeCategory === 'ORIGINAL' && (
            <section className="mb-10">
              <div className="flex flex-wrap justify-center gap-3 mb-10 text-xs uppercase tracking-widest text-muted">
                <button
                  onClick={() => setOriginalBrandFilter('ALL')}
                  className={`px-3 py-1 border rounded-full transition-colors ${
                    originalBrandFilter === 'ALL'
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-secondary/40 hover:border-primary hover:text-primary'
                  }`}
                >
                  All Brands
                </button>
                {ORIGINAL_BRANDS_ORDER.filter((brand) =>
                  originalByBrand[brand]
                ).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setOriginalBrandFilter(brand)}
                    className={`px-3 py-1 border rounded-full transition-colors ${
                      originalBrandFilter === brand
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-secondary/40 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>

              <div className="space-y-12">
                {Object.entries(originalByBrand)
                  .filter(([brand]) => {
                    if (originalBrandFilter === 'ALL') return true;
                    return brand === originalBrandFilter;
                  })
                  .map(([brand, brandBikes]) => (
                    <div key={brand}>
                      <h3 className="text-sm md:text-base uppercase tracking-widest text-primary mb-4 text-center md:text-left">
                        {brand}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brandBikes.map((bike) => (
                          <div
                            key={bike.name}
                            className="border border-secondary/30 bg-white p-6 flex flex-col justify-between h-full"
                          >
                            <div className="mb-4">
                              {bike.previewImage && (
                                <div className="mb-4 aspect-[16/10] bg-secondary/10 overflow-hidden flex items-center justify-center">
                                  <img
                                    src={bike.previewImage}
                                    alt={bike.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <div className="flex items-baseline justify-between gap-4 mb-2">
                                <h5 className="text-lg font-serif text-primary">
                                  {bike.name}
                                </h5>
                                <span className="text-xs uppercase tracking-widest text-muted">
                                  {bike.cc} cc
                                </span>
                              </div>
                              <p className="text-xs uppercase tracking-widest text-muted mb-3">
                                {bike.brand}
                              </p>
                              <p className="text-sm text-muted whitespace-pre-line">
                                {bike.specification}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs inline-flex px-3 py-1 rounded-full bg-secondary/30 text-primary uppercase tracking-widest">
                                Original
                              </span>
                              <Link
                                href={`/catalogue/${slugify(bike.name)}`}
                                className="text-xs uppercase tracking-widest text-primary hover:text-accent"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {activeCategory === 'REPLICA' && (
            <section>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <h3 className="text-2xl font-serif text-primary">
                  Replicas by Engine Size
                </h3>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-widest text-muted">
                  <button
                    onClick={() => setReplicaCcFilter('ALL')}
                    className={`px-3 py-1 border rounded-full transition-colors ${
                      replicaCcFilter === 'ALL'
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-secondary/40 hover:border-primary hover:text-primary'
                    }`}
                  >
                    All CC
                  </button>
                  {replicaCcOptions.map((cc) => (
                    <button
                      key={cc}
                      onClick={() => setReplicaCcFilter(cc)}
                      className={`px-3 py-1 border rounded-full transition-colors ${
                        replicaCcFilter === cc
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-secondary/40 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {cc} cc
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredReplicaList.map((bike) => (
                  <div
                    key={`${bike.name}-${bike.cc}`}
                    className="border border-secondary/30 bg-white p-6 flex flex-col justify-between h-full"
                  >
                    <div className="mb-4">
                      {bike.previewImage && (
                        <div className="mb-4 aspect-[16/10] bg-secondary/10 overflow-hidden flex items-center justify-center">
                          <img
                            src={bike.previewImage}
                            alt={bike.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h5 className="text-lg font-serif text-primary">
                          {bike.name}
                        </h5>
                        <span className="text-xs uppercase tracking-widest text-muted">
                          {bike.cc} cc
                        </span>
                      </div>
                      <p className="text-xs uppercase tracking-widest text-muted mb-3">
                        {bike.brand}
                      </p>
                      <p className="text-sm text-muted whitespace-pre-line">
                        {bike.specification}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs inline-flex px-3 py-1 rounded-full bg-secondary/30 text-primary uppercase tracking-widest">
                        Replica
                      </span>
                      <Link
                        href={`/catalogue/${slugify(bike.name)}`}
                        className="text-xs uppercase tracking-widest text-primary hover:text-accent"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
