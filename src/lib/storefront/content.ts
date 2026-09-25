import { z } from "zod";
import type { Json, Tables } from "@/lib/supabase/database.types";
import { OW_MOTORS_YEARS_OF_SERVICE } from "@/data/contact";

export const STOREFRONT_SETTING_KEYS = {
  whyChoose: "storefront.home.why_choose",
  aboutPreview: "storefront.home.about_preview",
  contactPreview: "storefront.home.contact_preview",
  brandsPage: "storefront.brands.page",
} as const;

export const storefrontIconSchema = z.enum(["shield", "star", "tag", "headphones", "zap"]);
export type StorefrontIcon = z.infer<typeof storefrontIconSchema>;

const text = (maximum: number) => z.string().trim().min(1).max(maximum);
const href = z.string().trim().regex(/^\/(?!\/)[^\s]*$/, "Use an internal path beginning with /.").max(240);

export const whyChooseContentSchema = z.object({
  visible: z.boolean(),
  eyebrow: text(80),
  heading: text(140),
  cards: z.array(z.object({
    id: z.string().min(1).max(80),
    icon: storefrontIconSchema,
    title: text(100),
    description: text(360),
    visible: z.boolean(),
    order: z.number().int().min(0).max(100),
  })).min(1).max(8),
});

export const aboutPreviewContentSchema = z.object({
  visible: z.boolean(),
  eyebrow: text(80),
  heading: text(140),
  description: text(900),
  imagePath: text(500),
  imageAlt: text(240),
  points: z.array(text(180)).min(1).max(6),
  ctaLabel: text(80),
  ctaHref: href,
  primaryStatValue: text(20),
  primaryStatLabel: text(80),
  secondaryStatValue: text(20),
  secondaryStatLabel: text(80),
});

export const contactPreviewContentSchema = z.object({
  visible: z.boolean(),
  eyebrow: text(80),
  heading: text(140),
  location: text(300),
  phone: text(100),
  email: z.string().trim().email().max(254),
  openingHours: text(240),
  mapMessage: text(300),
  ctaLabel: text(80),
  ctaHref: href,
});

export const brandsPageContentSchema = z.object({
  eyebrow: text(80),
  heading: text(140),
  description: text(360),
  showcase: z.array(z.object({
    brandId: z.string().uuid(),
    visible: z.boolean(),
    order: z.number().int().min(0).max(100),
  })).max(50),
});

export type WhyChooseContent = z.infer<typeof whyChooseContentSchema>;
export type AboutPreviewContent = z.infer<typeof aboutPreviewContentSchema>;
export type ContactPreviewContent = z.infer<typeof contactPreviewContentSchema>;
export type BrandsPageContent = z.infer<typeof brandsPageContentSchema>;

export type StorefrontContent = Readonly<{
  whyChoose: WhyChooseContent;
  aboutPreview: AboutPreviewContent;
  contactPreview: ContactPreviewContent;
  brandsPage: BrandsPageContent;
}>;

export const DEFAULT_STOREFRONT_CONTENT: StorefrontContent = {
  whyChoose: {
    visible: true,
    eyebrow: "Why Choose Us",
    heading: "The OW Motors Difference",
    cards: [
      { id: "motorcycle-selection", icon: "shield", title: "Motorcycle Selection", description: "A focused destination for motorcycles across five distinct brands and riding styles.", visible: true, order: 0 },
      { id: "multiple-brands", icon: "star", title: "Multiple Brands", description: "Explore Taro, Lifan, Hi-Speed, Super Star, and Fuego through one consistent dealership experience.", visible: true, order: 1 },
      { id: "clear-information", icon: "tag", title: "Clear Information", description: "Verified model, pricing, and availability information is presented clearly as inventory goes live.", visible: true, order: 2 },
      { id: "rider-support", icon: "headphones", title: "Rider Support", description: "A direct route to contact the OW Motors team for product guidance and purchasing information.", visible: true, order: 3 },
      { id: "direct-assistance", icon: "zap", title: "Direct Assistance", description: "Move from browsing to a dealership inquiry through a dedicated, accessible contact route.", visible: true, order: 4 },
    ],
  },
  aboutPreview: {
    visible: true,
    eyebrow: "About OW Motors",
    heading: "Your Motorcycle Destination",
    description: "Since 2016, OW Motors has brought Taro, Lifan, Hi-Speed, Super Star, and Fuego together in one rider-focused motorcycle experience.",
    imagePath: "images/ow-motors-logo.png",
    imageAlt: "OW Motors",
    points: [
      "Motorcycles from five distinct brands",
      "A clear path from discovery to dealership contact",
      "Product information designed around rider decisions",
      "A growing catalog backed by published inventory data",
    ],
    ctaLabel: "Learn more about us",
    ctaHref: "/about",
    primaryStatValue: `${OW_MOTORS_YEARS_OF_SERVICE}+`,
    primaryStatLabel: "Years serving riders",
    secondaryStatValue: "5",
    secondaryStatLabel: "Motorcycle brands",
  },
  contactPreview: {
    visible: true,
    eyebrow: "Find Us",
    heading: "Contact & Location",
    location: "Shop 61-A, Main Maulana Shaukat Ali Road, Township, Lahore 54000",
    phone: "0322 2033399 (Primary) · 0336 0415607 (Secondary)",
    email: "info@owmotors.com",
    openingHours: "Monday–Saturday: 11:00 AM–8:00 PM · Sunday: Closed",
    mapMessage: "Visit the OW Motors showroom in Township, Lahore",
    ctaLabel: "Contact OW Motors",
    ctaHref: "/contact",
  },
  brandsPage: {
    eyebrow: "OW Motors",
    heading: "Our Brands",
    description: "Explore the motorcycle brands available at OW Motors.",
    showcase: [],
  },
};

type SettingRow = Pick<Tables<"site_settings">, "setting_key" | "setting_value">;

function parsedOrDefault<T>(value: Json | undefined, schema: z.ZodType<T>, fallback: T): T {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

export function parseStorefrontContent(rows: readonly SettingRow[]): StorefrontContent {
  const settings = new Map(rows.map((row) => [row.setting_key, row.setting_value]));
  return {
    whyChoose: parsedOrDefault(settings.get(STOREFRONT_SETTING_KEYS.whyChoose), whyChooseContentSchema, DEFAULT_STOREFRONT_CONTENT.whyChoose),
    aboutPreview: parsedOrDefault(settings.get(STOREFRONT_SETTING_KEYS.aboutPreview), aboutPreviewContentSchema, DEFAULT_STOREFRONT_CONTENT.aboutPreview),
    contactPreview: parsedOrDefault(settings.get(STOREFRONT_SETTING_KEYS.contactPreview), contactPreviewContentSchema, DEFAULT_STOREFRONT_CONTENT.contactPreview),
    brandsPage: parsedOrDefault(settings.get(STOREFRONT_SETTING_KEYS.brandsPage), brandsPageContentSchema, DEFAULT_STOREFRONT_CONTENT.brandsPage),
  };
}

export function storefrontSettingKeys() {
  return Object.values(STOREFRONT_SETTING_KEYS);
}
