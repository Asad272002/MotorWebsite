'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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

type CatalogBikeBase = Bike & {
  images: string[];
};

const rawBikes = bikesJson as Bike[];

type GroupedBike = Omit<CatalogBikeBase, 'cc'> & {
  ccs: number[];
  previewImage: string | null;
  baseName: string;
};

// Group bikes by normalized base name (e.g. "Taro GP1 300" and "Taro GP 1" both become "Taro GP1")
const normalizeBikeName = (name: string) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '') // remove spaces and dashes to compare "tarogp1"
    .replace(/cc$/, ''); // optionally remove trailing 'cc'
};

// We will manually define the base display names for grouping
const getBaseName = (name: string) => {
  const norm = normalizeBikeName(name);
  if (norm.includes('tarogp1')) return 'Taro GP 1';
  if (norm.includes('tarogp2')) return 'Taro GP 2';
  if (norm.includes('taroc6')) return 'Taro C6';
  if (norm.includes('taroc5')) return 'Taro C5';
  if (norm.includes('lifankpm')) return 'Lifan KPM';
  if (norm.includes('lifank19')) return 'Lifan K19';
  if (norm.includes('lifanv16s')) return 'Lifan V16S';
  if (norm.includes('lifankpt')) return 'Lifan KPT';
  if (norm.includes('hispeedinfinity')) return 'Hi Speed Infinity';
  if (norm.includes('hispeedfreedom')) return 'Hi Speed Freedom';
  if (norm.includes('hispeedcyclone')) return 'Hi Speed Cyclone';
  if (norm.includes('hispeedbatllo')) return 'Hi Speed Batllo';
  if (norm.includes('superstar200')) return 'Super Star 200cc';

  return name;
};

const groupedBikesMap = rawBikes.reduce((acc, bike) => {
  const isOther = bike.type.toLowerCase() === 'replica';
  const baseName = isOther ? bike.name.trim() : getBaseName(bike.name);
  const key = isOther ? `${baseName.toLowerCase()}-${bike.cc}` : baseName.toLowerCase();
  const imagePath = bike.image?.localPath;
  const existing = acc[key];

  if (existing) {
    if (!existing.ccs.includes(bike.cc)) {
      existing.ccs.push(bike.cc);
    }
    if (imagePath && !existing.images.includes(imagePath)) {
      existing.images.push(imagePath);
    }
    return acc;
  }

  acc[key] = {
    ...bike,
    baseName,
    name: baseName,
    ccs: [bike.cc],
    images: imagePath ? [imagePath] : [],
    previewImage: null, // to be populated
  };

  return acc;
}, {} as Record<string, GroupedBike>);

const modelImagesByNameKey: Record<string, string[]> = {
  'taro gp 2': ['/bikes/TARO GP 2.png'],
  'taro gp 1': ['/bikes/gp1_400_1.png', '/bikes/gp1_300_2.png'],
  'taro c6': ['/bikes/Taro -TARO c6-250cc-1.png'],
  'taro c5': ['/bikes/c5_400_1.png'],
  'lifan kpm': ['/bikes/Lifan kpm.png'],
  'lifan k19': ['/bikes/Lifan K19.png'],
  'lifan v16s': ['/bikes/Lifan_-lifan_v16s_-250cc-4.png'],
  'lifan kpt': ['/bikes/Lifan_-lifan_kpt-250cc-1.png'],
};

const bikes: GroupedBike[] = Object.values(groupedBikesMap).map((bike) => {
  const key = bike.baseName.toLowerCase();
  const modelImages = modelImagesByNameKey[key] ?? [];
  const images = [...bike.images];

  modelImages.forEach((img) => {
    if (!images.includes(img)) {
      images.push(img);
    }
  });

  const previewImage = modelImages[0] ?? images[0] ?? null;
  
  // Sort CCs ascending
  const sortedCcs = [...bike.ccs].sort((a, b) => a - b);

  return {
    ...bike,
    ccs: sortedCcs,
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
  new Set(replicaBikes.flatMap((bike) => bike.ccs))
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
  {} as Record<string, GroupedBike[]>
);

const ORIGINAL_BRANDS_ORDER = ['Taro', 'Lifan', 'Hi speed', 'Super star'];

const CatalogueGridSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border border-secondary/30 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="flex items-center">
            <div className="w-32 sm:w-40 md:w-44">
              <div className="aspect-[16/10] bg-secondary/20" />
            </div>
            <div className="flex-1 min-w-0 px-6 py-6">
              <div className="h-5 w-2/3 bg-secondary/20 rounded" />
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-secondary/20 rounded-full" />
                <div className="h-6 w-16 bg-secondary/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Catalogue() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<'ORIGINAL' | 'OTHERS'>(
    'ORIGINAL'
  );
  const [originalBrandFilter, setOriginalBrandFilter] = useState<
    'ALL' | string
  >('ALL');
  const [replicaCcFilter, setReplicaCcFilter] = useState<number | 'ALL'>('ALL');
  const [isListLoading, setIsListLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerListLoading = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    setIsListLoading(true);
    loadingTimerRef.current = setTimeout(() => {
      setIsListLoading(false);
    }, 320);
  }, []);

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search)
      .get('tab')
      ?.toLowerCase();
    if (tab === 'others') {
      const id = setTimeout(() => {
        triggerListLoading();
        setActiveCategory('OTHERS');
      }, 0);

      return () => {
        clearTimeout(id);
        if (loadingTimerRef.current) {
          clearTimeout(loadingTimerRef.current);
        }
      };
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [triggerListLoading]);

  const filteredReplicaList = replicaBikes.filter((bike) => {
    if (replicaCcFilter === 'ALL') return true;
    return bike.ccs.includes(replicaCcFilter);
  });

  const originalsDetailSuffix = '?from=original';
  const othersDetailSuffix = '?from=others';

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
            and carefully selected others.
          </motion.p>
        </div>

        <div className="mt-24 border-t border-secondary/30 pt-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
              Full Inventory
            </h2>
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
              Start by choosing Originals or Others, then refine by brand or
              engine size.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-secondary/40 bg-white/80 backdrop-blur-sm p-1 text-xs uppercase tracking-widest">
              <button
                onClick={() => {
                  if (activeCategory === 'ORIGINAL') return;
                  triggerListLoading();
                  setActiveCategory('ORIGINAL');
                  router.replace('/catalogue?tab=original', { scroll: false });
                }}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === 'ORIGINAL'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Original
              </button>
              <button
                onClick={() => {
                  if (activeCategory === 'OTHERS') return;
                  triggerListLoading();
                  setActiveCategory('OTHERS');
                  router.replace('/catalogue?tab=others', { scroll: false });
                }}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === 'OTHERS'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary'
                }`}
              >
                Others
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeCategory === 'ORIGINAL' ? (
              <motion.section
                key="original"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mb-10"
              >
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
                  {ORIGINAL_BRANDS_ORDER.filter((brand) => originalByBrand[brand]).map(
                    (brand) => (
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
                    )
                  )}
                </div>

                {isListLoading ? (
                  <CatalogueGridSkeleton count={9} />
                ) : (
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
                              <Link
                                key={bike.name}
                                href={`/catalogue/${slugify(bike.name)}${originalsDetailSuffix}`}
                                className="group block border border-secondary/30 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                              >
                                <div className="flex items-center">
                                  <div className="w-32 sm:w-40 md:w-44">
                                    <div className="aspect-[16/10] bg-secondary/10 flex items-center justify-center">
                                      {bike.previewImage ? (
                                        <img
                                          src={bike.previewImage}
                                          alt={bike.name}
                                          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-muted">
                                          No Image
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0 px-6 py-6 flex flex-col justify-center">
                                    <h5 className="text-xl font-serif text-primary leading-snug">
                                      {bike.name}
                                    </h5>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {bike.ccs.map((cc) => (
                                        <span
                                          key={cc}
                                          className="inline-flex items-center rounded-full border border-secondary/40 px-3 py-1 uppercase tracking-widest text-xs text-muted hover:border-primary hover:text-primary transition-colors"
                                        >
                                          {cc} CC
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="others"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                  <h3 className="text-2xl font-serif text-primary">
                    Others by Engine Size
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

                {isListLoading ? (
                  <CatalogueGridSkeleton count={9} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredReplicaList.map((bike) => (
                      <Link
                        key={bike.name}
                        href={`/catalogue/${slugify(bike.name)}${othersDetailSuffix}`}
                        className="group block border border-secondary/30 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <div className="flex items-center">
                          <div className="w-32 sm:w-40 md:w-44">
                            <div className="aspect-[16/10] bg-secondary/10 flex items-center justify-center">
                              {bike.previewImage ? (
                                <img
                                  src={bike.previewImage}
                                  alt={bike.name}
                                  className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-muted">
                                  No Image
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 px-6 py-6 flex flex-col justify-center">
                            <h5 className="text-xl font-serif text-primary leading-snug">
                              {bike.name}
                            </h5>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {bike.ccs.map((cc) => (
                                <span
                                  key={cc}
                                  className="inline-flex items-center rounded-full border border-secondary/40 px-3 py-1 uppercase tracking-widest text-xs text-muted hover:border-primary hover:text-primary transition-colors"
                                >
                                  {cc} CC
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
