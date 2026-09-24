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
type StorefrontBikeVariantRow = Tables<"storefront_bike_variants">;
type StorefrontBikeImageRow = Tables<"storefront_bike_images">;
type StorefrontBike = StorefrontBikeRow & Readonly<{
  normalizedVariants: readonly StorefrontBikeVariantRow[];
  normalizedImages: readonly StorefrontBikeImageRow[];
}>;

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

function legacyNormalizedVariants(row: StorefrontBikeRow): readonly StorefrontBikeVariantRow[] {
  let displayOrder = 0;
  return parseVariants(row.variants).flatMap((configuration) => configuration.available_colors.map((color) => {
    const colorSlug = slugify(color) || "color";
    const item: StorefrontBikeVariantRow = {
      id: `legacy-${row.id}-${configuration.cc}-${configuration.abs ? "abs" : "non-abs"}-${colorSlug}`,
      storefront_bike_id: row.id,
      cc: configuration.cc,
      has_abs: configuration.abs,
      price_pkr: configuration.price_pkr,
      color_name: color,
      color_slug: colorSlug,
      color_hex: null,
      color_id: `legacy-color-${row.id}-${colorSlug}`,
      specifications: [...configuration.specifications],
      is_default: displayOrder === 0,
      is_active: true,
      display_order: displayOrder++,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
    return item;
  }));
}

function withLegacyData(row: StorefrontBikeRow): StorefrontBike {
  return { ...row, normalizedVariants: legacyNormalizedVariants(row), normalizedImages: [] };
}

export async function getStorefrontBikeRows(): Promise<readonly StorefrontBike[]> {
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
    return fallbackRows().map(withLegacyData);
  }

  const rows = data ?? [];
  if (!rows.length) return [];
  const bikeIds = rows.map((row) => row.id);
  const [variantsResult, imagesResult] = await Promise.all([
    supabase.from("storefront_bike_variants").select("*").in("storefront_bike_id", bikeIds).eq("is_active", true).order("display_order", { ascending: true }),
    supabase.from("storefront_bike_images").select("*").in("storefront_bike_id", bikeIds).order("sort_order", { ascending: true }),
  ]);

  if (variantsResult.error || imagesResult.error) {
    console.error("[OW Motors normalized storefront media query failed]", {
      variantsCode: variantsResult.error?.code,
      imagesCode: imagesResult.error?.code,
    });
    return rows.map(withLegacyData);
  }

  return rows.map((row) => {
    const normalizedVariants = (variantsResult.data ?? []).filter((variant) => variant.storefront_bike_id === row.id);
    return {
      ...row,
      normalizedVariants: normalizedVariants.length ? normalizedVariants : legacyNormalizedVariants(row),
      normalizedImages: (imagesResult.data ?? []).filter((image) => image.storefront_bike_id === row.id),
    };
  });
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

function inferredColorHex(name: string) {
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

function configurationId(cc: number, hasAbs: boolean) {
  return `${cc}-${hasAbs ? "abs" : "non-abs"}`;
}

function configurationLabel(cc: number, hasAbs: boolean) {
  return `${cc}cc ${hasAbs ? "ABS" : "Non-ABS"}`;
}

function sortedImages(images: readonly StorefrontBikeImageRow[]) {
  return [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);
}

function rowImages(row: StorefrontBike, variantId?: string): readonly ProductImage[] {
  const variant = variantId ? row.normalizedVariants.find((item) => item.id === variantId) : undefined;
  const variantImages = variantId
    ? sortedImages(row.normalizedImages.filter((image) => image.variant_id === variantId))
    : [];
  const colorImages = variant
    ? sortedImages(row.normalizedImages.filter((image) => image.variant_id === null && image.color_id === variant.color_id))
    : [];
  const sharedImages = sortedImages(row.normalizedImages.filter((image) => image.variant_id === null && image.color_id === null));
  const selected = variantImages.length
    ? [...variantImages, ...sharedImages]
    : colorImages.length
      ? [...colorImages, ...sharedImages]
      : sharedImages;
  const unique = [...new Map(selected.map((image) => [image.storage_path, image])).values()];
  if (unique.length) return unique.map((image) => ({ src: resolveImage(image.storage_path), alt: image.alt_text }));

  const legacyPaths = [row.primary_image_path, ...row.gallery_image_paths].filter((path): path is string => Boolean(path?.trim()));
  const legacyUnique = [...new Set(legacyPaths)];
  if (!legacyUnique.length) return [{ src: PLACEHOLDER_IMAGE, alt: `${row.model_name} image coming soon` }];
  return legacyUnique.map((path, index) => ({
    src: resolveImage(path),
    alt: index === 0 ? `${row.model_name} motorcycle` : `${row.model_name} view ${index + 1}`,
  }));
}

function productVariants(row: StorefrontBike): readonly ProductVariant[] {
  return row.normalizedVariants.map((variant) => ({
    id: variant.id,
    cc: variant.cc,
    abs: variant.has_abs,
    configurationId: configurationId(variant.cc, variant.has_abs),
    configurationLabel: configurationLabel(variant.cc, variant.has_abs),
    colorId: variant.color_slug,
    colorName: variant.color_name,
    colorHex: variant.color_hex ?? inferredColorHex(variant.color_name),
    price: Number(variant.price_pkr),
    availability: "contact-us" as const,
    stockStatus: "coming_soon" as const,
    quantity: 0,
    isDefault: variant.is_default,
    images: rowImages(row, variant.id),
    specifications: [
      { label: "Brand", value: row.brand },
      { label: "Model", value: row.model_name },
      { label: "Engine capacity", value: `${variant.cc}cc` },
      { label: "Braking system", value: variant.has_abs ? "ABS" : "Non-ABS" },
      ...variant.specifications.map((specification, index) => ({ label: `Feature ${index + 1}`, value: specification })),
    ],
  })).sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

export async function getStorefrontCatalogMotorcycles(): Promise<readonly CatalogMotorcycle[]> {
  const rows = await getStorefrontBikeRows();
  return rows.flatMap((row) => {
    const variants = row.normalizedVariants;
    if (!variants.length) return [];
    const prices = variants.map((variant) => Number(variant.price_pkr));
    const engineOptions = [...new Set(variants.map((variant) => `${variant.cc}cc`))];
    const configurations = [...new Set(variants.map((variant) => configurationLabel(variant.cc, variant.has_abs)))];
    const defaultVariant = variants.find((variant) => variant.is_default) ?? variants[0];
    const defaultImage = rowImages(row, defaultVariant?.id)[0];
    const colors = [...new Map(variants.map((variant) => [variant.color_slug, variant])).values()].map((variant) => {
      const colorImage = rowImages(row, variant.id)[0] ?? defaultImage;
      return {
        id: `${row.id}-${variant.color_slug}`,
        name: variant.color_name,
        hex: variant.color_hex ?? inferredColorHex(variant.color_name),
        image: colorImage?.src ?? PLACEHOLDER_IMAGE,
        imageAlt: colorImage?.alt ?? `${row.model_name} in ${variant.color_name}`,
      };
    });
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
      image: defaultImage?.src ?? PLACEHOLDER_IMAGE,
      imageAlt: defaultImage?.alt ?? `${row.model_name} image coming soon`,
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
  const defaultVariant = variants.find((variant) => variant.isDefault) ?? variants[0];
  const overviewImage = defaultVariant?.images[0] ?? rowImages(row)[0] ?? null;
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
