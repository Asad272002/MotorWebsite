import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SocialIcon } from "@/components/ui/social-icon";
import { OW_MOTORS_CONTACT } from "@/data/contact";
import { PRIMARY_LINKS } from "@/lib/constants/navigation";
import { getPublicBrands, getStorefrontContent } from "@/lib/supabase/public-queries";
import { DEFAULT_STOREFRONT_CONTENT } from "@/lib/storefront/content";

const FOOTER_LINKS = PRIMARY_LINKS;

export async function SiteFooter() {
  const [brands, storefront] = await Promise.all([
    getPublicBrands().catch(() => []),
    getStorefrontContent().catch(() => DEFAULT_STOREFRONT_CONTENT),
  ]);
  const contact = storefront.contactPreview;
  return <footer className="bg-near-black text-white"><Container className="max-w-6xl pb-8 pt-14">
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_.8fr_.9fr_1.25fr] lg:gap-12">
      <div><Link href="/" aria-label="OW Motors home" className="inline-flex items-center"><Image src="/images/ow-motors-logo.png" alt="OW Motors" width={1536} height={1024} className="h-11 w-auto object-contain brightness-0 invert" sizes="110px" /></Link><p className="mt-4 max-w-[250px] text-sm leading-6 text-white/55">Explore premium motorcycles, compare configurations, and connect directly with OW Motors.</p><div className="mt-6 flex flex-wrap gap-2" aria-label="Follow OW Motors">{OW_MOTORS_CONTACT.socialChannels.map((channel)=><a key={channel.platform} href={channel.href} target="_blank" rel="noreferrer" aria-label={`Follow OW Motors on ${channel.label}`} title={channel.label} className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/15 !text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:!text-white ${channel.accent}`}><SocialIcon platform={channel.platform} className="h-[18px] w-[18px]" /></a>)}</div></div>
      <div><h2 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-white">Quick Links</h2><ul>{FOOTER_LINKS.map((link)=><li key={link.href}><Link className="inline-flex min-h-11 touch-manipulation items-center text-sm !text-white/55 transition-colors hover:!text-white sm:min-h-8" href={link.href}>{link.label}</Link></li>)}</ul></div>
      <div><h2 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-white">Our Brands</h2><ul>{brands.map((brand)=><li key={brand.id}><Link className="inline-flex min-h-11 touch-manipulation items-center text-sm !text-white/55 transition-colors hover:!text-white sm:min-h-8" href={`/motorcycles/brand/${brand.slug}`}>{brand.name} Motorcycles</Link></li>)}</ul></div>
      <div><h2 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-white">Contact</h2><address className="space-y-4 not-italic"><p className="flex items-start gap-3 text-sm leading-5 text-white/55"><MapPin size={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" /><span>{contact.location}</span></p>{OW_MOTORS_CONTACT.phones.map((phone)=><a key={phone.label} href={phone.href} className="group flex items-center gap-3 text-sm !text-white/65 transition-colors hover:!text-white"><Phone size={15} className="shrink-0 text-brand" aria-hidden="true" /><span><span className="mr-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/35">{phone.label}</span>{phone.display}</span></a>)}<a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm !text-white/65 transition-colors hover:!text-white"><Mail size={15} className="shrink-0 text-brand" aria-hidden="true" /><span>{contact.email}</span></a></address></div>
    </div>
    <div className="mt-11 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center"><p className="text-xs text-white/45">© {new Date().getFullYear()} OW Motors. All rights reserved.</p><div className="flex gap-6 text-xs text-white/45"><span>Privacy Policy</span><span>Terms of Service</span></div></div>
  </Container></footer>;
}