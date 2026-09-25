"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProductVariant } from "@/data/products";
import { ProductGallery } from "@/components/motorcycles/product-gallery.client";

const formatPrice = (price: number) => `PKR ${price.toLocaleString("en-PK")}`;
const availabilityLabel = (value: ProductVariant["availability"]) => ({
  "in-stock": "In Stock",
  "out-of-stock": "Out of Stock",
  "coming-soon": "Coming Soon",
  "contact-us": "Contact for availability",
  discontinued: "Discontinued",
})[value];

export function ProductConfigurator({ brandName, productName, description, variants }: Readonly<{ brandName: string; productName: string; description: string; variants: readonly ProductVariant[] }>) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0].id);
  const [selectedSpecificationGroup, setSelectedSpecificationGroup] = useState<string | null>(null);
  const [mobileSpecificationMenuOpen, setMobileSpecificationMenuOpen] = useState(false);
  const mobileSpecificationMenuRef = useRef<HTMLDivElement>(null);
  const selected = variants.find((variant) => variant.id === selectedVariantId) ?? variants[0];
  const specificationGroups = selected.specificationGroups ?? [{ title: "Specifications", items: selected.specifications }];
  const activeSpecificationGroup = specificationGroups.find((group) => group.title === selectedSpecificationGroup) ?? specificationGroups[0];
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!mobileSpecificationMenuRef.current?.contains(event.target as Node)) setMobileSpecificationMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSpecificationMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  const configurations = [...new Map(variants.map((variant) => [variant.configurationId, { id: variant.configurationId, label: variant.configurationLabel }])).values()];
  const colors = [...new Map(variants.map((variant) => [variant.colorId, { id: variant.colorId, name: variant.colorName, hex: variant.colorHex }])).values()];
  const selectConfiguration = (configurationId: string) => { const match = variants.find((variant) => variant.configurationId === configurationId && variant.colorId === selected.colorId) ?? variants.find((variant) => variant.configurationId === configurationId); if (match) setSelectedVariantId(match.id); };
  const selectColor = (colorId: string) => { const match = variants.find((variant) => variant.configurationId === selected.configurationId && variant.colorId === colorId); if (match) setSelectedVariantId(match.id); };
  return <>
    <div className="mx-auto grid max-w-7xl gap-8 px-[var(--page-gutter)] lg:grid-cols-[1.45fr_1fr] lg:gap-12">
      <ProductGallery key={selected.id} images={selected.images} productName={`${brandName} ${productName}`} />
      <div>
        <p className="text-eyebrow mb-2">{brandName}</p><h1 className="font-display text-[clamp(2.4rem,4vw,3.5rem)] font-bold leading-none">{productName}</h1><p className="mt-4 text-sm leading-6 text-cool-gray">{description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-5"><p className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-brand">{formatPrice(selected.price)}</p><span className={`border px-3 py-1.5 text-xs font-semibold ${selected.availability === "in-stock" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-brand"}`}>{availabilityLabel(selected.availability)}</span></div>
        {configurations.length > 1 ? <fieldset className="mt-5"><legend className="mb-3 text-sm">Configuration: <strong>{selected.configurationLabel}</strong></legend><div className="flex flex-wrap gap-2">{configurations.map((configuration) => <button key={configuration.id} type="button" onClick={() => selectConfiguration(configuration.id)} aria-pressed={selected.configurationId === configuration.id} className={`min-h-11 touch-manipulation border px-5 text-sm font-semibold transition-all hover:border-brand active:scale-[.97] active:border-brand ${selected.configurationId === configuration.id ? "border-brand bg-brand/5 text-brand" : "border-border bg-white"}`}>{configuration.label}</button>)}</div></fieldset> : null}
        <fieldset className="mt-5"><legend className="mb-3 text-sm">Color: <strong>{selected.colorName}</strong></legend><div className="flex flex-wrap gap-2">{colors.map((color) => { const match = variants.find((variant) => variant.configurationId === selected.configurationId && variant.colorId === color.id); const isSelected = selected.colorId === color.id; return <label key={color.id} className={`relative flex min-h-12 touch-manipulation cursor-pointer select-none items-center gap-2 border px-4 text-sm font-semibold transition-all hover:border-brand active:scale-[.97] active:border-brand focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--ow-focus)] ${isSelected ? "border-brand bg-brand/5 text-brand" : "border-border bg-white"} ${match ? "" : "pointer-events-none cursor-not-allowed opacity-35 line-through"}`}><input type="radio" name="product-color" value={color.id} checked={isSelected} disabled={!match} onChange={() => selectColor(color.id)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" /><span aria-hidden="true" className="h-4 w-4 rounded-full border border-black/15" style={{ backgroundColor: color.hex }} /><span>{color.name}</span></label>; })}</div></fieldset>
        <div className="mt-6 border border-border bg-soft-gray p-5"><p className="text-eyebrow mb-3">Your Selection</p><dl className="space-y-2 text-sm">{[["Motorcycle", productName], ["Configuration", selected.configurationLabel], ["Color", selected.colorName], ["Price", formatPrice(selected.price)], ["Availability", availabilityLabel(selected.availability)]].map(([label, value]) => <div key={label} className="flex justify-between gap-6"><dt className="text-cool-gray">{label}</dt><dd className={`text-right font-semibold ${label === "Price" ? "text-brand" : ""}`}>{value}</dd></div>)}</dl></div>
        <div className="mt-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2"><Link href="/contact" className="flex min-h-11 touch-manipulation items-center justify-center border border-brand bg-brand text-sm font-semibold !text-white transition-colors hover:bg-white hover:!text-brand active:bg-white active:!text-brand">Contact Us</Link><Link href="/contact?channel=whatsapp" className="flex min-h-11 touch-manipulation items-center justify-center border border-[#0B7A34] bg-[#0B7A34] text-sm font-semibold !text-white transition-colors hover:bg-white hover:!text-[#0B7A34] active:bg-white active:!text-[#0B7A34]">WhatsApp</Link></div>
      </div>
    </div>
        <section aria-labelledby="selected-specifications" className="mt-14 border-y border-border bg-soft-gray py-12 sm:mt-20 sm:py-16">
      <div className="mx-auto max-w-7xl px-[var(--page-gutter)]">
        <div className="max-w-2xl">
          <p className="text-eyebrow mb-2">Technical</p>
          <h2 id="selected-specifications" className="text-display-lg">Specifications</h2>
          <p className="mt-3 text-sm leading-6 text-cool-gray">Specifications for the selected {selected.configurationLabel} configuration.</p>
        </div>
        {specificationGroups.length > 1 ? <>
          <div ref={mobileSpecificationMenuRef} className="relative mt-8 sm:hidden">
            <span id="mobile-specification-category-label" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-cool-gray">Specification category</span>
            <button type="button" aria-haspopup="listbox" aria-expanded={mobileSpecificationMenuOpen} aria-labelledby="mobile-specification-category-label mobile-specification-category-value" onClick={() => setMobileSpecificationMenuOpen((open) => !open)} className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border bg-white px-4 text-left shadow-[0_10px_32px_rgba(17,17,17,.08)] transition-all duration-300 ${mobileSpecificationMenuOpen ? "border-brand ring-4 ring-brand/10" : "border-border"}`}>
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{String(specificationGroups.indexOf(activeSpecificationGroup) + 1).padStart(2, "0")}</span>
                <span id="mobile-specification-category-value" className="truncate font-bold text-near-black">{activeSpecificationGroup.title}</span>
              </span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-5 w-5 shrink-0 text-brand transition-transform duration-300 ${mobileSpecificationMenuOpen ? "rotate-180" : ""}`}><path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
            </button>
            <div role="listbox" aria-labelledby="mobile-specification-category-label" className={`absolute inset-x-0 top-[calc(100%+.5rem)] z-30 origin-top overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-[0_20px_55px_rgba(17,17,17,.18)] transition-all duration-200 ${mobileSpecificationMenuOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-[.98] opacity-0"}`}>
              {specificationGroups.map((group, groupIndex) => { const isActive = group.title === activeSpecificationGroup.title; return <button key={group.title} type="button" role="option" aria-selected={isActive} onClick={() => { setSelectedSpecificationGroup(group.title); setMobileSpecificationMenuOpen(false); }} className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-sm font-bold transition-colors ${isActive ? "bg-near-black text-white" : "text-near-black hover:bg-soft-gray"}`}><span className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${isActive ? "bg-brand text-white" : "bg-soft-gray text-cool-gray"}`}>{String(groupIndex + 1).padStart(2, "0")}</span>{group.title}</span>{isActive ? <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-brand"><path d="m4.5 10 3.2 3.2 7.8-7.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> : null}</button>; })}
            </div>
          </div>
          <div role="tablist" aria-label="Specification categories" className="mt-8 hidden gap-1 rounded-xl border border-border bg-white p-1.5 shadow-[0_8px_30px_rgba(17,17,17,.04)] sm:inline-flex">
            {specificationGroups.map((group, groupIndex) => { const isActive = group.title === activeSpecificationGroup.title; return <button key={group.title} id={`spec-tab-${groupIndex}`} type="button" role="tab" aria-selected={isActive} aria-controls="specification-panel" onClick={() => setSelectedSpecificationGroup(group.title)} className={`relative min-h-11 overflow-hidden rounded-lg px-6 text-sm font-bold transition-colors duration-300 ${isActive ? "text-white" : "text-cool-gray hover:bg-soft-gray hover:text-near-black"}`}><span className={`absolute inset-0 rounded-lg bg-near-black transition-transform duration-300 ease-out motion-reduce:transition-none ${isActive ? "scale-100" : "scale-0"}`} aria-hidden="true" /><span className="relative z-10">{group.title}</span></button>; })}
          </div>
        </> : null}
        <div className="mt-5 max-w-4xl">
          <article key={`${selected.id}-${activeSpecificationGroup.title}`} id="specification-panel" role="tabpanel" aria-label={`${activeSpecificationGroup.title} specifications`} className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_36px_rgba(17,17,17,.07)] animate-[specification-panel-in_280ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none">
            <header className="flex items-center gap-4 border-b border-border bg-near-black px-5 py-4 text-white sm:px-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-sm font-bold" aria-hidden="true">{String(specificationGroups.indexOf(activeSpecificationGroup) + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-xl font-bold tracking-tight">{activeSpecificationGroup.title}</h3>
            </header>
            <dl className="divide-y divide-border">
              {activeSpecificationGroup.items.map((specification) => <div key={specification.label} className="grid grid-cols-[minmax(7.5rem,.8fr)_minmax(0,1.2fr)] gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-soft-gray sm:px-6 motion-reduce:transition-none">
                <dt className="font-semibold text-near-black">{specification.label}</dt>
                <dd className="break-words text-right font-medium text-[#59616b]">{specification.value}</dd>
              </div>)}
            </dl>
          </article>
        </div>
      </div>
    </section>
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-border bg-white px-3 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-3px_12px_rgba(0,0,0,.08)] sm:gap-4 sm:px-5 md:grid-cols-[1fr_1fr_1fr]"><div className="min-w-0"><p className="truncate font-display text-sm font-bold">{brandName} {productName}</p><p className="truncate text-[0.65rem] text-cool-gray">{selected.cc}cc · {selected.colorName}</p></div><p className="hidden text-center font-display text-xl font-bold text-brand md:block">{formatPrice(selected.price)}</p><div className="flex justify-end gap-2"><Link href="/contact" className="ow-button-primary whitespace-nowrap px-3 text-xs sm:px-5">Contact Us</Link><Link href="/contact?channel=whatsapp" className="hidden min-h-11 items-center border border-[#0B7A34] bg-[#0B7A34] px-4 text-xs font-semibold !text-white transition-colors hover:bg-white hover:!text-[#0B7A34] active:bg-white active:!text-[#0B7A34] sm:inline-flex">WhatsApp</Link></div></div>
  </>;
}
