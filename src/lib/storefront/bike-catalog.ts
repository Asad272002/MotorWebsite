import "server-only";

import bikesJson from "../../../docs/bikes.json";
import type { CatalogMotorcycle, NavigationMotorcycle } from "@/data/catalog";
import type { ProductDetail, ProductImage, ProductVariant } from "@/data/products";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createPublicServerSupabaseClient } from "@/lib/supabase/server";
import type { Json, Tables } from "@/lib/supabase/database.types";

const PLACEHOLDER_IMAGE = "/images/motorcycle-placeholder.svg";
const FALLBACK_TIMESTAMP = "2026-09-25T00:00:00.000Z";

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function categoryLabel(value: string) {
  return value.split("-").filter(Boolean).map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join(" ");
}

type BikeVariant = Readonly<{
  cc: number;
  abs: boolean;
  price_pkr: number;
  available_colors: readonly string[];
  specifications: readonly string[];
}>;

type BikeJson = Readonly<{
  brand: string;
  model_name: string;
  category: string;
  variants: readonly BikeVariant[];
}>;

type StorefrontBikeRow = Tables<"storefront_bikes">;

export type StorefrontBrandSummary = Readonly<{
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}>;

function isBikeVariant(value: unknown): value is BikeVariant {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.cc === "number"
    && typeof item.abs === "boolean"
    && typeof item.price_pkr === "number"
    && Array.isArray(item.available_colors)
    && item.available_colors.every((color) => typeof color === "string")
    && Array.isArray(item.specifications)
    && item.specifications.every((specification) => typeof specification === "string");
}

function parseVariants(value: Json): readonly BikeVariant[] {
  return Array.isArray(value) ? value.filter(isBikeVariant) as unknown as readonly BikeVariant[] : [];
}

function fallbackRows(): readonly StorefrontBikeRow[] {
  return (bikesJson as readonly BikeJson[]).map((bike, index) => {
    const brandSlug = slugify(bike.brand);
    const slug = slugify(bike.model_name);
    return {
      id: `json-${brandSlug}-${slug}`,
      brand: bike.brand,
      brand_id: null,
      brand_slug: brandSlug,
      category: bike.category,
      model_name: bike.model_name,
      slug,
      section: brandSlug === "replica" ? "replicas" : "motorcycles",
      short_description: `${bike.model_name} configurations, colors, pricing, and specifications.`,
      full_description: `Explore the available ${bike.model_name} configurations at OW Motors. Select an engine and braking package to compare colors, pricing, and specifications.`,
      variants: bike.variants as unknown as Json,
      primary_image_path: null,
      gallery_image_paths: [],
      is_published: true,
      is_featured: index < 8,
      display_order: index,
      created_at: FALLBACK_TIMESTAMP,
      updated_at: FALLBACK_TIMESTAMP,
    };
  });
}

export async function getStorefrontBikeRows(): Promise<readonly StorefrontBikeRow[]> {
  const supabase = createPublicServerSupabaseClient();
  const { data, error } = await supabase
    .from("storefront_bikes")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("model_name", { ascending: true });

  if (error) {
    if (error.code !== "PGRST205" && error.code !== "42P01") {
      console.error("[OW Motors storefront bike query failed]", { code: error.code });
    }
    return fallbackRows();
  }
  return data ?? [];
}

function resolveImage(path: string | null | undefined) {
  const value = path?.trim();
  if (!value) return PLACEHOLDER_IMAGE;
  if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
  const { url } = getSupabaseConfig();
  const encodedPath = value.split("/").map(encodeURIComponent).join("/");
  return `${url}/storage/v1/object/public/motorcycles/${encodedPath}`;
}

function formatPrice(price: number) {
  return `PKR ${price.toLocaleString("en-PK")}`;
}

function colorHex(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes("black")) return "#171717";
  if (normalized.includes("white")) return "#F5F5F5";
  if (normalized.includes("red") || normalized.includes("vine")) return "#C62828";
  if (normalized.includes("blue")) return "#1565C0";
  if (normalized.includes("green")) return "#2E7D32";
  if (normalized.includes("yellow")) return "#F9A825";
  if (normalized.includes("orange")) return "#EF6C00";
  if (normalized.includes("silver")) return "#9CA3AF";
  if (normalized.includes("gray") || normalized.includes("grey")) return "#6B7280";
  if (normalized.includes("beige")) return "#D6C6A5";
  if (normalized.includes("carbon")) return "#343434";
  return "#737373";
}

function configurationId(variant: BikeVariant) {
  return `${variant.cc}-${variant.abs ? "abs" : "non-abs"}`;
}

function configurationLabel(variant: BikeVariant) {
  return `${variant.cc}cc ${variant.abs ? "ABS" : "Non-ABS"}`;
}

function rowImages(row: StorefrontBikeRow): readonly ProductImage[] {
  const paths = [row.primary_image_path, ...row.gallery_image_paths].filter((path): path is string => Boolean(path?.trim()));
  const unique = [...new Set(paths)];
  if (!unique.length) return [{ src: PLACEHOLDER_IMAGE, alt: `${row.model_name} image coming soon` }];
  return unique.map((path, index) => ({
    src: resolveImage(path),
    alt: index === 0 ? `${row.model_name} motorcycle` : `${row.model_name} view ${index + 1}`,
  }));
}

function productVariants(row: StorefrontBikeRow): readonly ProductVariant[] {
  const images = rowImages(row);
  return parseVariants(row.variants).flatMap((variant, variantIndex) =>
    variant.available_colors.map((color, colorIndex) => ({
      id: `${row.id}-${configurationId(variant)}-${slugify(color)}`,
      cc: variant.cc,
      abs: variant.abs,
      configurationId: configurationId(variant),
      configurationLabel: configurationLabel(variant),
      colorId: slugify(color),
      colorName: color,
      colorHex: colorHex(color),
      price: variant.price_pkr,
      availability: "contact-us" as const,
      stockStatus: "coming_soon" as const,
      quantity: 0,
      isDefault: variantIndex === 0 && colorIndex === 0,
      images,
      specifications: [
        { label: "Brand", value: row.brand },
        { label: "Model", value: row.model_name },
        { label: "Engine capacity", value: `${variant.cc}cc` },
        { label: "Braking system", value: variant.abs ? "ABS" : "Non-ABS" },
        ...variant.specifications.map((specification, index) => ({ label: `Feature ${index + 1}`, value: specification })),
      ],
    })),
  );
}

export async function getStorefrontCatalogMotorcycles(): Promise<readonly CatalogMotorcycle[]> {
  const rows = await getStorefrontBikeRows();
  return rows.flatMap((row) => {
    const variants = parseVariants(row.variants);
    if (!variants.length) return [];
    const prices = variants.map((variant) => variant.price_pkr);
    const engineOptions = [...new Set(variants.map((variant) => `${variant.cc}cc`))];
    const configurations = variants.map(configurationLabel);
    const image = resolveImage(row.primary_image_path);
    const colors = [...new Set(variants.flatMap((variant) => variant.available_colors))].map((color) => ({
      id: `${row.id}-${slugify(color)}`,
      name: color,
      hex: colorHex(color),
      image,
      imageAlt: `${row.model_name} in ${color}`,
    }));
    const price = Math.min(...prices);
    return [{
      id: row.id,
      brand: row.brand_slug,
      brandName: row.brand,
      name: row.model_name,
      slug: row.slug,
      categories: [row.section, row.category],
      categoryLabels: [row.section === "replicas" ? "Replicas" : "Motorcycles", categoryLabel(row.category)],
      engine: engineOptions[0],
      engineOptions,
      configurationLabels: configurations,
      cooling: "See specifications",
      transmission: "not-specified",
      transmissionLabel: "See specifications",
      fuel: "not-specified",
      availability: "contact-us",
      image,
      imageAlt: row.primary_image_path ? `${row.model_name} motorcycle` : `${row.model_name} image coming soon`,
      shortDescription: row.short_description,
      colors,
      summary: configurations.join(" / "),
      price,
      priceLabel: prices.length > 1 ? `From ${formatPrice(price)}` : formatPrice(price),
      featuredOrder: row.is_featured ? row.display_order : 1000 + row.display_order,
      updatedAt: row.updated_at,
    }];
  });
}

export async function getStorefrontNavigationMotorcycles(): Promise<readonly NavigationMotorcycle[]> {
  const motorcycles = await getStorefrontCatalogMotorcycles();
  return motorcycles.map(({ id, brand, brandName, name, slug, categories, categoryLabels, image, imageAlt, price, priceLabel }) => ({
    id, brand, brandName, name, slug, categories, categoryLabels, image, imageAlt, price, priceLabel,
  }));
}

export async function getStorefrontBrandSummaries(): Promise<readonly StorefrontBrandSummary[]> {
  const rows = await getStorefrontBikeRows();
  return [...new Map(rows.filter((row) => row.section !== "replicas").map((row) => [row.brand_slug, {
    id: row.brand_id ?? `storefront-${row.brand_slug}`,
    name: row.brand,
    slug: row.brand_slug,
    updatedAt: row.updated_at,
  }])).values()];
}

export async function getStorefrontProduct(brandSlug: string, productSlug: string): Promise<ProductDetail | null> {
  const rows = await getStorefrontBikeRows();
  const row = rows.find((bike) => bike.brand_slug === brandSlug && bike.slug === productSlug);
  if (!row) return null;
  const variants = productVariants(row);
  const overviewImage = rowImages(row)[0];
  return {
    id: row.id,
    brand: row.brand_slug,
    brandName: row.brand,
    name: row.model_name,
    slug: row.slug,
    categories: [row.section, row.category],
    description: row.short_description,
    fullDescription: row.full_description,
    seoTitle: `${row.model_name} Price and Specifications in Pakistan`,
    seoDescription: row.short_description,
    overviewHeading: row.model_name,
    overview: [row.full_description],
    overviewImage,
    variants,
    features: [],
    technicalGroups: [],
    faqs: variants.length ? [
      { question: `Which ${row.model_name} configurations are available?`, answer: [...new Set(variants.map((variant) => variant.configurationLabel))].join(", ") },
      { question: `Which colors are available for the ${row.model_name}?`, answer: [...new Set(variants.map((variant) => variant.colorName))].join(", ") },
    ] : [],
  };
}
