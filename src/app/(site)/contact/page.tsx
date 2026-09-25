import type { Metadata } from "next";
import { ArrowUpRight, Phone } from "lucide-react";
import { ContactInquiryForm } from "@/components/forms/contact-inquiry-form.client";
import { Container } from "@/components/ui/container";
import { SocialIcon } from "@/components/ui/social-icon";
import { OW_MOTORS_CONTACT } from "@/data/contact";
import { createPageMetadata, hasAnySearchParameters } from "@/lib/seo/metadata";

export async function generateMetadata({ searchParams }: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>): Promise<Metadata> {
  return createPageMetadata({
    title: "Contact OW Motors",
    description: "Call OW Motors or connect through Instagram, Facebook, TikTok, and YouTube for motorcycle availability and purchasing support.",
    path: "/contact",
    noIndex: hasAnySearchParameters(await searchParams),
  });
}

export default function ContactPage() {
  return <>
    <header className="border-b border-border bg-soft-gray py-14 sm:py-20"><Container className="max-w-6xl"><p className="text-eyebrow mb-3">Contact</p><h1 className="text-display-xl">Talk to OW Motors</h1><p className="mt-5 max-w-2xl text-cool-gray">Speak directly with our team about motorcycles, configurations, pricing, and availability—or follow OW Motors on your preferred social channel.</p></Container></header>
    <section className="bg-white py-12 sm:py-16"><Container className="grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
      <div>
        <p className="text-eyebrow mb-3">Direct assistance</p><h2 className="text-display-lg">Call our team</h2><p className="mt-3 max-w-md text-sm leading-6 text-cool-gray">Tap a number to call. Use the primary line first, with the secondary line available when needed.</p>
        <div className="mt-7 space-y-3">{OW_MOTORS_CONTACT.phones.map((phone, index)=><a key={phone.label} href={phone.href} className="group flex min-h-20 items-center justify-between gap-4 rounded-xl border border-border bg-white px-5 shadow-[0_8px_28px_rgba(17,17,17,.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_14px_35px_rgba(198,40,40,.12)]"><span className="flex items-center gap-4"><span className={`flex h-11 w-11 items-center justify-center rounded-full ${index === 0 ? "bg-brand text-white" : "bg-soft-gray text-brand"}`}><Phone aria-hidden="true" className="h-5 w-5" /></span><span><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-cool-gray">{phone.label} number</span><span className="mt-1 block font-display text-xl font-bold text-near-black">{phone.display}</span></span></span><ArrowUpRight aria-hidden="true" className="h-5 w-5 text-cool-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" /></a>)}</div>
        <div className="mt-10"><h2 className="font-display text-2xl font-bold">Follow OW Motors</h2><p className="mt-2 text-sm text-cool-gray">New motorcycles, walkarounds, updates, and showroom content.</p><div className="mt-5 grid grid-cols-2 gap-3">{OW_MOTORS_CONTACT.socialChannels.map((channel)=><a key={channel.platform} href={channel.href} target="_blank" rel="noreferrer" className={`group flex min-h-24 flex-col justify-between rounded-xl border border-border bg-white p-4 !text-near-black shadow-[0_6px_24px_rgba(17,17,17,.04)] transition-all duration-300 hover:-translate-y-0.5 hover:!text-white ${channel.accent}`}><span className="flex items-center justify-between"><SocialIcon platform={channel.platform} className="h-6 w-6" /><ArrowUpRight aria-hidden="true" className="h-4 w-4 opacity-45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" /></span><span><strong className="block text-sm">{channel.label}</strong><span className="mt-0.5 block truncate text-[11px] opacity-65">{channel.handle}</span></span></a>)}</div></div>
      </div>
      <div className="rounded-2xl border border-border bg-soft-gray p-5 shadow-[0_16px_45px_rgba(17,17,17,.06)] sm:p-8"><p className="text-eyebrow mb-2">Send an inquiry</p><h2 className="mb-6 font-display text-3xl font-bold">How can we help?</h2><ContactInquiryForm /></div>
    </Container></section>
  </>;
}