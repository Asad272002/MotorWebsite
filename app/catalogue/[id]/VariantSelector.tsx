'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { ChevronRight } from 'lucide-react';
import { formatPricePkr, getBikePricesForCc, getBikeVariants } from '@/data/vehicles';

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

type GroupedBike = Omit<Bike, 'cc'> & {
  baseName: string;
  variants: Bike[];
};

export const VariantSelector = ({
  bikeGroup,
  galleryImages,
  galleryImagesByCc,
}: {
  bikeGroup: GroupedBike;
  galleryImages: string[];
  galleryImagesByCc: Record<number, string[]>;
}) => {
  const sortedVariants = useMemo(
    () => [...bikeGroup.variants].sort((a, b) => a.cc - b.cc),
    [bikeGroup.variants]
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = sortedVariants[selectedVariantIndex];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const specItems = useMemo(() => {
    const seen = new Set<string>();
    const items: string[] = [];

    const normalizeKey = (value: string) =>
      value.toLowerCase().replace(/[^a-z0-9]+/g, '');

    const add = (value: string) => {
      const v = value.trim();
      if (!v) return;
      const key = normalizeKey(v);
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push(v);
    };

    add(`${selectedVariant.cc}cc`);

    const spec = (selectedVariant.specification ?? '').replace(/[⚙️🏍]/g, ' ');

    const checks: Array<[RegExp, string]> = [
      [/\bEFI\b/i, 'EFI'],
      [/\bABS\b/i, 'ABS'],
      [/\bCBS\b/i, 'CBS'],
      [/\bTFT\b/i, 'TFT Display'],
      [/\bLED\b/i, 'LED Lights'],
      [/\bWATER\s*COOL(?:ED)?\b/i, 'Water Cooled'],
      [/\bOIL\s*COOL(?:ED)?\b/i, 'Oil Cooled'],
      [/\bDUAL\s*CYLINDER\b/i, 'Dual Cylinder'],
      [/\bSINGLE[-\s]*CYLINDER\b/i, 'Single Cylinder'],
    ];

    checks.forEach(([re, label]) => {
      if (re.test(spec)) add(label);
    });

    const gears = spec.match(/\b(\d+)\s*GEARS?\b/i);
    if (gears?.[1]) add(`${gears[1]} Gears`);

    spec
      .split(/[\n,]+/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((part) => {
        const cleaned = part.replace(/\s+/g, ' ').trim();
        if (!cleaned) return;
        if (cleaned.length > 80) return;
        add(cleaned);
      });

    return items;
  }, [selectedVariant.cc, selectedVariant.specification]);

  const imagesForCc = galleryImagesByCc[selectedVariant.cc] ?? [];
  const activeImages =
    imagesForCc.length > 0
      ? imagesForCc
      : galleryImages.length > 0
        ? galleryImages
        : selectedVariant.image?.localPath
          ? [selectedVariant.image.localPath]
          : [];
  const activeImage = activeImages[selectedImageIndex] ?? activeImages[0] ?? null;
  const ccOptions = useMemo(
    () => Array.from(new Set(sortedVariants.map((v) => v.cc))),
    [sortedVariants]
  );
  const typeLabel = bikeGroup.type.toLowerCase() === 'replica' ? 'Others' : bikeGroup.type;
  const priceVariants = useMemo(() => getBikeVariants(bikeGroup.baseName), [bikeGroup.baseName]);
  const priceSummaryByCc = useMemo(() => {
    const byCc = new Map<number, { min: number; max: number }>();
    priceVariants.forEach((v) => {
      const existing = byCc.get(v.cc);
      if (!existing) {
        byCc.set(v.cc, { min: v.pricePkr, max: v.pricePkr });
        return;
      }
      byCc.set(v.cc, {
        min: Math.min(existing.min, v.pricePkr),
        max: Math.max(existing.max, v.pricePkr),
      });
    });
    return byCc;
  }, [priceVariants]);

  const selectedPrices = useMemo(
    () => getBikePricesForCc(bikeGroup.baseName, selectedVariant.cc),
    [bikeGroup.baseName, selectedVariant.cc]
  );

  const selectedPriceLabel = useMemo(() => {
    if (selectedPrices.length === 0) return null;
    if (selectedPrices.length === 1) return formatPricePkr(selectedPrices[0].pricePkr);
    const byPrice = [...selectedPrices].sort((a, b) => a.pricePkr - b.pricePkr);
    const min = byPrice[0].pricePkr;
    const max = byPrice[byPrice.length - 1].pricePkr;
    const hasVariantLabels = selectedPrices.some((p) => (p.variant ?? '').trim().length > 0);
    if (!hasVariantLabels) return `${formatPricePkr(min)} - ${formatPricePkr(max)}`;
    const parts = byPrice.map((p) => `${p.variant ?? 'Variant'}: ${formatPricePkr(p.pricePkr)}`);
    return parts.join(' / ');
  }, [selectedPrices]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      <div className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedVariant.cc}-${activeImage ?? 'no-image'}-${selectedImageIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="aspect-[16/10] bg-secondary/30 border border-white/10 rounded-3xl overflow-hidden flex items-center justify-center p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
          >
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage}
                alt={selectedVariant.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-muted tracking-widest uppercase text-sm">
                No Image Available
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {activeImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {activeImages.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                onClick={() => setSelectedImageIndex(idx)}
                className={`h-20 w-28 shrink-0 rounded-2xl overflow-hidden border transition-all ${
                  idx === selectedImageIndex
                    ? 'border-accent shadow-md'
                    : 'border-white/10 hover:border-accent/50'
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-contain bg-black/10" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-block px-4 py-1.5 bg-black/20 border border-white/10 text-primary text-xs tracking-widest uppercase rounded-full font-medium">
            {bikeGroup.brand}
          </span>
          <span className="inline-block px-4 py-1.5 bg-black/20 border border-white/10 text-foreground text-xs tracking-widest uppercase rounded-full font-medium">
            {typeLabel}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary mb-6 leading-tight">
          {bikeGroup.baseName}
        </h1>

        {/* Variant Selection */}
        {ccOptions.length > 1 && (
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest text-muted mb-4 font-semibold">
              Select Engine Variant
            </h3>
            <div className="flex flex-wrap gap-3">
              {ccOptions.map((cc) => (
                <button
                  key={cc}
                  onClick={() => {
                    const idx = sortedVariants.findIndex((v) => v.cc === cc);
                    setSelectedVariantIndex(Math.max(0, idx));
                    setSelectedImageIndex(0);
                  }}
                  className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 border ${
                    selectedVariant.cc === cc
                      ? 'border-accent bg-accent text-white shadow-md transform scale-105'
                      : 'border-white/10 text-muted hover:border-accent/50 hover:text-foreground bg-black/20'
                  }`}
                >
                  <span className="flex flex-col items-center leading-tight">
                    <span className="uppercase tracking-widest">{cc} CC</span>
                    {priceSummaryByCc.has(cc) && (
                      <span className="text-[11px] opacity-80">
                        {(() => {
                          const s = priceSummaryByCc.get(cc) as { min: number; max: number };
                          if (s.min === s.max) return formatPricePkr(s.min);
                          return `${formatPricePkr(s.min)} - ${formatPricePkr(s.max)}`;
                        })()}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-secondary/30 rounded-2xl border border-white/10 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)] mb-10">
          <h3 className="text-xs uppercase tracking-widest text-muted mb-6 font-semibold flex items-center">
            Specifications <ChevronRight size={14} className="ml-1 opacity-50" />
          </h3>
          <ul className="space-y-2 text-base text-foreground/80 font-light">
            {specItems.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent/70 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted mb-2 font-semibold">
              Pricing & Enquiries
            </h3>
            <p className="text-sm text-muted">
              {selectedPriceLabel ? (
                <>
                  Price for the <strong className="text-primary">{selectedVariant.cc}cc</strong> model:{' '}
                  <strong className="text-champagne">{selectedPriceLabel}</strong>
                </>
              ) : (
                <>
                  Connect with our team for up-to-date pricing on the{' '}
                  <strong className="text-primary">{selectedVariant.cc}cc</strong> model.
                </>
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`https://wa.me/923222033399?text=${encodeURIComponent(
                `Hi, I'm interested in the ${selectedVariant.name} (${selectedVariant.cc}cc ${selectedVariant.brand}).${
                  selectedPriceLabel ? ` Listed price: ${selectedPriceLabel}.` : ''
                } Please share availability details.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto flex-1"
            >
              <Button size="lg" className="w-full text-sm font-semibold tracking-wide">
                WhatsApp for Price
              </Button>
            </a>
            <Link
              href={`/contact?vehicle=${encodeURIComponent(selectedVariant.name)}`}
              className="w-full md:w-auto flex-1"
            >
              <Button variant="outline" size="lg" className="w-full text-sm font-semibold tracking-wide">
                Request Callback
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
