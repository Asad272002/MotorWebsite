'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import bikesJson from '@/bikes_data/bikes.json';
import { formatPricePkr, getBikeTopVariant, getBikeVariants } from '@/data/vehicles';

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
  'lifan kpm': ['/bikes-data/lifan/kpm/kpm_2.png'],
  'lifan k19': ['/bikes/Lifan K19.png'],
  'lifan v16s': ['/bikes/Lifan_-lifan_v16s_-250cc-4.png'],
  'lifan kpt': ['/bikes/Lifan_-lifan_kpt-250cc-1.png'],
  'hi speed infinity': ['/bikes-data/hi-speed/infinity/infinity_3.jpg'],
  'super star 200cc': ['/bikes-data/superstar/superstart200/superstar_200.png'],
  'falcon': ['/bikes-data/superstar/falcon/Super_star-falcon.png'],
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
          className="border border-white/10 bg-secondary/35 rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="flex items-center">
            <div className="w-32 sm:w-40 md:w-44">
              <div className="aspect-[16/10] bg-black/20" />
            </div>
            <div className="flex-1 min-w-0 px-6 py-6">
              <div className="h-5 w-2/3 bg-black/20 rounded" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="h-10 bg-black/20 rounded-2xl" />
                <div className="h-10 bg-black/20 rounded-2xl" />
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
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.06),transparent_60%)]" />
        <div className="absolute -left-40 -top-24 h-[200%] w-[65%] rotate-[-18deg] bg-gradient-to-b from-amber-500/18 via-orange-400/8 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-[55%] bg-[radial-gradient(circle_at_1px_1px,rgba(245,158,11,0.14)_1px,transparent_0)] bg-[length:18px_18px] opacity-25" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-performance/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
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

          <div className="sticky top-24 z-30 flex justify-center mb-10">
            <div className="inline-flex rounded-full border border-white/10 bg-secondary/55 backdrop-blur-sm p-1 text-xs uppercase tracking-widest">
              <button
                onClick={() => {
                  if (activeCategory === 'ORIGINAL') return;
                  triggerListLoading();
                  setActiveCategory('ORIGINAL');
                  router.replace('/catalogue?tab=original', { scroll: false });
                }}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === 'ORIGINAL'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground'
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
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground'
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
                <div className="sticky top-40 z-20 flex flex-wrap justify-center gap-3 mb-10 text-xs uppercase tracking-widest text-muted">
                  <button
                    onClick={() => setOriginalBrandFilter('ALL')}
                    className={`px-3 py-1 border rounded-full transition-colors ${
                      originalBrandFilter === 'ALL'
                        ? 'border-accent text-primary bg-white/5'
                        : 'border-white/10 hover:border-accent hover:text-primary'
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
                            ? 'border-accent text-primary bg-white/5'
                            : 'border-white/10 hover:border-accent hover:text-primary'
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
                            {brandBikes.map((bike) => {
                              const listingTop = getBikeTopVariant(bike.baseName);
                              const topCc = listingTop?.cc ?? bike.ccs[bike.ccs.length - 1] ?? 0;
                              const priceLabel = listingTop ? formatPricePkr(listingTop.pricePkr) : 'Contact for Price';
                              const variants = getBikeVariants(bike.baseName);
                              const otherVariants = listingTop
                                ? variants.filter(
                                    (v) =>
                                      !(
                                        v.cc === listingTop.cc &&
                                        v.pricePkr === listingTop.pricePkr &&
                                        (v.variant ?? '') === (listingTop.variant ?? '')
                                      )
                                  )
                                : variants;

                              return (
                              <Link
                                key={bike.name}
                                href={`/catalogue/${slugify(bike.name)}${originalsDetailSuffix}`}
                                  className="group block border border-white/10 bg-secondary/35 rounded-2xl overflow-hidden transition-all hover:bg-secondary/45 hover:shadow-[0_40px_90px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent/35"
                              >
                                <div className="relative">
                                  <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/40 to-background" />
                                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(216,144,67,0.18),transparent_62%)]" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(215,215,215,0.08)_1px,transparent_0)] bg-[length:18px_18px] opacity-25" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
                                  </div>

                                  <div className="relative flex items-center">
                                  <div className="w-36 sm:w-44 md:w-52">
                                    <div className="aspect-[16/10] bg-black/10 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden ml-4 my-4">
                                      {bike.previewImage ? (
                                        <img
                                          src={bike.previewImage}
                                          alt={bike.name}
                                          className="w-full h-full object-contain p-2 drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.05]"
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

                                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                                          <div className="text-[10px] uppercase tracking-widest text-muted">
                                          Top Variant
                                        </div>
                                          <div className="text-sm font-semibold text-foreground">
                                          {topCc} CC
                                        </div>
                                      </div>
                                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                                          <div className="text-[10px] uppercase tracking-widest text-muted">
                                          Price
                                        </div>
                                          {priceLabel.startsWith('PKR ') ? (
                                            <div className="mt-1 flex flex-col leading-none">
                                              <span className="text-[10px] uppercase tracking-widest text-muted">
                                                PKR
                                              </span>
                                              <span className="mt-1 max-w-full overflow-hidden text-ellipsis text-[12px] md:text-[13px] font-semibold text-champagne tabular-nums whitespace-nowrap tracking-tight">
                                                {priceLabel.replace(/^PKR\s+/i, '')}
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="mt-1 text-xs sm:text-sm font-semibold text-champagne leading-tight">
                                              {priceLabel}
                                            </div>
                                          )}
                                      </div>
                                    </div>

                                      {otherVariants.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                          {otherVariants.map((v) => (
                                            <span
                                              key={`${v.cc}-${(v.variant ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')}-${v.pricePkr}`}
                                              className="inline-flex max-w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-foreground sm:rounded-full sm:py-1"
                                            >
                                              <span className="font-semibold uppercase tracking-widest">
                                                {v.cc} CC
                                              </span>
                                              {v.variant && (
                                                <span className="uppercase tracking-widest text-[10px] text-muted">
                                                  {v.variant}
                                                </span>
                                              )}
                                              <span className="text-champagne/90 tabular-nums">
                                                <span className="text-muted uppercase tracking-widest text-[10px]">
                                                  PKR
                                                </span>{' '}
                                                <span className="whitespace-nowrap">
                                                  {formatPricePkr(v.pricePkr).replace(/^PKR\s+/i, '')}
                                                </span>
                                              </span>
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                                </div>
                              </Link>
                              );
                            })}
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
                    {filteredReplicaList.map((bike) => {
                      const listingTop = getBikeTopVariant(bike.baseName);
                      const topCc = listingTop?.cc ?? bike.ccs[bike.ccs.length - 1] ?? 0;
                      const priceLabel = listingTop ? formatPricePkr(listingTop.pricePkr) : 'Contact for Price';
                      const variants = getBikeVariants(bike.baseName);
                      const otherVariants = listingTop
                        ? variants.filter(
                            (v) =>
                              !(
                                v.cc === listingTop.cc &&
                                v.pricePkr === listingTop.pricePkr &&
                                (v.variant ?? '') === (listingTop.variant ?? '')
                              )
                          )
                        : variants;

                      return (
                      <Link
                        key={bike.name}
                        href={`/catalogue/${slugify(bike.name)}${othersDetailSuffix}`}
                          className="group block border border-white/10 bg-secondary/35 rounded-2xl overflow-hidden transition-all hover:bg-secondary/45 hover:shadow-[0_40px_90px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent/35"
                      >
                        <div className="relative">
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/40 to-background" />
                            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(216,144,67,0.18),transparent_62%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(215,215,215,0.08)_1px,transparent_0)] bg-[length:18px_18px] opacity-25" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/10" />
                          </div>

                          <div className="relative flex items-center">
                          <div className="w-36 sm:w-44 md:w-52">
                            <div className="aspect-[16/10] bg-black/10 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden ml-4 my-4">
                              {bike.previewImage ? (
                                <img
                                  src={bike.previewImage}
                                  alt={bike.name}
                                  className="w-full h-full object-contain p-2 drop-shadow-[0_18px_36px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.05]"
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

                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                                  <div className="text-[10px] uppercase tracking-widest text-muted">
                                  Top Variant
                                </div>
                                  <div className="text-sm font-semibold text-foreground">
                                  {topCc} CC
                                </div>
                              </div>
                                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                                  <div className="text-[10px] uppercase tracking-widest text-muted">
                                  Price
                                </div>
                                  {priceLabel.startsWith('PKR ') ? (
                                    <div className="mt-1 flex flex-col leading-none">
                                      <span className="text-[10px] uppercase tracking-widest text-muted">
                                        PKR
                                      </span>
                                      <span className="mt-1 max-w-full overflow-hidden text-ellipsis text-[12px] md:text-[13px] font-semibold text-champagne tabular-nums whitespace-nowrap tracking-tight">
                                        {priceLabel.replace(/^PKR\s+/i, '')}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="mt-1 text-xs sm:text-sm font-semibold text-champagne leading-tight">
                                      {priceLabel}
                                    </div>
                                  )}
                              </div>
                            </div>

                              {otherVariants.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {otherVariants.map((v) => (
                                    <span
                                      key={`${v.cc}-${(v.variant ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')}-${v.pricePkr}`}
                                      className="inline-flex max-w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-foreground sm:rounded-full sm:py-1"
                                    >
                                      <span className="font-semibold uppercase tracking-widest">
                                        {v.cc} CC
                                      </span>
                                      {v.variant && (
                                        <span className="uppercase tracking-widest text-[10px] text-muted">
                                          {v.variant}
                                        </span>
                                      )}
                                      <span className="text-champagne/90 tabular-nums">
                                        <span className="text-muted uppercase tracking-widest text-[10px]">
                                          PKR
                                        </span>{' '}
                                        <span className="whitespace-nowrap">
                                          {formatPricePkr(v.pricePkr).replace(/^PKR\s+/i, '')}
                                        </span>
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                        </div>
                      </Link>
                      );
                    })}
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
