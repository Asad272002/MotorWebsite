"use client";

import { useId, useState } from "react";
import { MAX_CATALOG_PRICE, MIN_CATALOG_PRICE } from "@/lib/catalog/filters";

const STEP = 25000;
const formatPrice = (price: number) => price >= 1_000_000
  ? `PKR ${(price / 1_000_000).toFixed(price % 1_000_000 ? 1 : 0)}M`
  : `PKR ${Math.round(price / 1000)}k`;

export function PriceRangeFields({ initialMin, initialMax }: Readonly<{ initialMin: number; initialMax: number }>) {
  const rangeId = useId();
  const minimumId = `${rangeId}-minimum`;
  const maximumId = `${rangeId}-maximum`;
  const [minimum, setMinimum] = useState(initialMin);
  const [maximum, setMaximum] = useState(initialMax);
  const minimumPosition = ((minimum - MIN_CATALOG_PRICE) / (MAX_CATALOG_PRICE - MIN_CATALOG_PRICE)) * 100;
  const maximumPosition = ((maximum - MIN_CATALOG_PRICE) / (MAX_CATALOG_PRICE - MIN_CATALOG_PRICE)) * 100;

  return <section className="border-b border-border py-4" aria-labelledby={`${rangeId}-title`}>
    <h3 id={`${rangeId}-title`} className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-near-black">Price Range</h3>
    <fieldset><legend className="sr-only">Price Range</legend>
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-near-black"><output htmlFor={minimumId}>{formatPrice(minimum)}</output><span aria-hidden="true" className="mx-2 h-px flex-1 bg-border" /><output htmlFor={maximumId}>{formatPrice(maximum)}</output></div>
      <div className="relative h-7">
        <span className="absolute inset-x-1 top-1/2 h-1 -translate-y-1/2 bg-border" aria-hidden="true" />
        <span className="absolute top-1/2 h-1 -translate-y-1/2 bg-brand" style={{ left: `${minimumPosition}%`, right: `${100 - maximumPosition}%` }} aria-hidden="true" />
        <input id={minimumId} name="priceMin" type="range" min={MIN_CATALOG_PRICE} max={MAX_CATALOG_PRICE} step={STEP} value={minimum} onChange={(event) => setMinimum(Math.min(Number(event.target.value), maximum))} aria-label="Minimum price" className="catalog-price-range" />
        <input id={maximumId} name="priceMax" type="range" min={MIN_CATALOG_PRICE} max={MAX_CATALOG_PRICE} step={STEP} value={maximum} onChange={(event) => setMaximum(Math.max(Number(event.target.value), minimum))} aria-label="Maximum price" className="catalog-price-range" />
      </div>
    </fieldset>
  </section>;
}
