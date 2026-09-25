import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bike, Clock3, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SocialIcon } from "@/components/ui/social-icon";
import { OW_MOTORS_CONTACT, OW_MOTORS_FOUNDED_YEAR, OW_MOTORS_YEARS_OF_SERVICE } from "@/data/contact";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About OW Motors",
  description: `Discover OW Motors, a trusted multi-brand motorcycle destination in Lahore serving riders since ${OW_MOTORS_FOUNDED_YEAR}.`,
  path: "/about",
});

const values = [
  { Icon: Bike, title: "Multi-brand selection", description: "Explore Taro, Lifan, Hi-Speed, Super Star, and Fuego motorcycles through one focused showroom experience." },
  { Icon: ShieldCheck, title: "Clear guidance", description: "Compare configurations, specifications, colors, and pricing with direct support from our team." },
  { Icon: Users, title: "Rider-focused service", description: "From first questions to motorcycle selection, we help customers make informed decisions with confidence." },
] as const;

export default function AboutPage() {
  return <>
    <header className="about-hero relative isolate overflow-hidden bg-[#090909] text-white">
      <div className="about-hero-grid absolute inset-0 -z-20 opacity-30" aria-hidden="true" />
      <div className="about-hero-glow absolute -right-32 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-brand/25 blur-[110px]" aria-hidden="true" />
      <div className="absolute inset-y-0 right-[42%] -z-10 hidden w-px rotate-[18deg] bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block" aria-hidden="true" />
      <Container className="grid min-h-[610px] max-w-6xl items-center gap-8 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div className="about-hero-copy relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[.06] px-4 py-2 backdrop-blur"><span className="h-2 w-2 animate-pulse rounded-full bg-brand motion-reduce:animate-none" /><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Serving riders since {OW_MOTORS_FOUNDED_YEAR}</span></div>
          <p className="text-eyebrow mb-3 !text-[#ff4747]">About OW Motors</p>
          <h1 className="font-display text-[clamp(3.3rem,7vw,6.5rem)] font-bold leading-[.88] tracking-[-.035em] text-white">Driven by<br /><span className="about-hero-outline">motorcycles.</span><br />Built for riders.</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-white/60 sm:text-lg">A multi-brand motorcycle destination helping riders explore sport, touring, cruiser, street, and adventure machines with confidence.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/motorcycles" className="ow-button-primary">Explore motorcycles</Link><Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/20 px-5 text-sm font-semibold !text-white transition-all hover:border-white hover:bg-white hover:!text-near-black">Talk to our team</Link></div>
        </div>
        <div className="relative hidden h-[500px] lg:block" aria-hidden="true">
          <div className="about-hero-orbit absolute inset-10 rounded-full border border-white/10" />
          <div className="about-hero-orbit about-hero-orbit-delayed absolute inset-24 rounded-full border border-brand/25" />
          <div className="absolute bottom-14 left-1/2 h-10 w-[78%] -translate-x-1/2 rounded-full bg-black/80 blur-xl" />
          <Image src="/images/home/taro-motorcycle-01.png" alt="" width={1200} height={900} priority className="about-hero-bike absolute inset-0 h-full w-full object-contain object-center drop-shadow-[0_30px_45px_rgba(0,0,0,.65)]" sizes="(min-width: 1024px) 45vw, 0px" />
          <div className="about-hero-badge absolute right-0 top-20 rounded-xl border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-md"><span className="block font-display text-2xl font-bold text-white">5</span><span className="text-[10px] uppercase tracking-[.14em] text-white/50">Motorcycle brands</span></div>
          <div className="about-hero-badge about-hero-badge-delayed absolute bottom-24 left-0 rounded-xl border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-md"><span className="flex items-center gap-1 font-display text-2xl font-bold text-white">4.0 <Star className="h-4 w-4 fill-[#F5A623] text-[#F5A623]" /></span><span className="text-[10px] uppercase tracking-[.14em] text-white/50">Customer rating</span></div>
        </div>
      </Container>
      <div className="about-speed-lines absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" aria-hidden="true" />
    </header>

    <section aria-label="OW Motors at a glance" className="relative z-10 -mt-px bg-near-black pb-8 text-white sm:pb-10"><Container className="grid max-w-6xl grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[.055] shadow-[0_22px_55px_rgba(0,0,0,.28)] backdrop-blur sm:grid-cols-4">{[
      [`${OW_MOTORS_YEARS_OF_SERVICE}+`, "Years serving riders"],
      [OW_MOTORS_CONTACT.reviewSummary.rating, "Google customer rating"],
      [`${OW_MOTORS_CONTACT.reviewSummary.count}+`, "Customer reviews"],
      ["5", "Motorcycle brands"],
    ].map(([value, label], index)=><div key={label} className={`group px-5 py-6 transition-colors hover:bg-white/[.05] ${index % 2 ? "border-l border-white/10" : ""} ${index > 1 ? "border-t border-white/10 sm:border-t-0" : ""} sm:border-l sm:first:border-l-0`}><strong className="block font-display text-3xl text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">{value}</strong><span className="mt-1 block text-xs text-white/55">{label}</span></div>)}</Container></section>

    <section className="bg-white py-14 sm:py-20"><Container className="max-w-6xl"><div className="max-w-2xl"><p className="text-eyebrow mb-3">What we stand for</p><h2 className="text-display-lg">A better way to choose your next motorcycle</h2></div><div className="mt-9 grid gap-4 md:grid-cols-3">{values.map(({ Icon, title, description })=><article key={title} className="rounded-xl border border-border bg-white p-6 shadow-[0_10px_32px_rgba(17,17,17,.05)]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand"><Icon aria-hidden="true" className="h-5 w-5" /></span><h3 className="mt-5 font-display text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-cool-gray">{description}</p></article>)}</div></Container></section>

    <section className="border-y border-border bg-soft-gray py-14 sm:py-20"><Container className="grid max-w-6xl gap-10 lg:grid-cols-[1fr_.9fr] lg:gap-16"><div><p className="text-eyebrow mb-3">Customer trust</p><h2 className="text-display-lg">Reviewed by riders</h2><div className="mt-6 flex items-end gap-4"><strong className="font-display text-6xl font-bold text-near-black">{OW_MOTORS_CONTACT.reviewSummary.rating}</strong><div className="pb-1"><div className="flex gap-1 text-[#F5A623]" aria-label="4 out of 5 stars">{[0,1,2,3].map((star)=><Star key={star} aria-hidden="true" className="h-5 w-5 fill-current" />)}<Star aria-hidden="true" className="h-5 w-5" /></div><p className="mt-1 text-sm text-cool-gray">Based on {OW_MOTORS_CONTACT.reviewSummary.count} public customer reviews</p></div></div><p className="mt-6 max-w-xl text-sm leading-7 text-cool-gray">Customer feedback highlights knowledgeable guidance, motorcycle variety, purchasing support, and a professional showroom experience.</p><a href={OW_MOTORS_CONTACT.mapsShareUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand">View reviews on Google <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a></div><div className="rounded-xl border border-border bg-white p-6 shadow-[0_12px_36px_rgba(17,17,17,.06)]"><div className="flex items-center gap-3"><Clock3 aria-hidden="true" className="h-6 w-6 text-brand" /><h2 className="font-display text-2xl font-bold">Showroom hours</h2></div><dl className="mt-6 divide-y divide-border">{OW_MOTORS_CONTACT.hours.map((row)=><div key={row.days} className="flex justify-between gap-5 py-4 text-sm"><dt className="font-semibold">{row.days}</dt><dd className={row.time === "Closed" ? "font-semibold text-brand" : "text-cool-gray"}>{row.time}</dd></div>)}</dl><div className="mt-5 flex items-start gap-3 rounded-lg bg-soft-gray p-4"><MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" /><p className="text-sm leading-6 text-cool-gray">{OW_MOTORS_CONTACT.address}</p></div></div></Container></section>

    <section className="bg-white py-14 sm:py-20"><Container className="max-w-6xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-eyebrow mb-3">Stay connected</p><h2 className="text-display-lg">Follow the ride</h2><p className="mt-3 text-sm text-cool-gray">See motorcycle walkarounds, arrivals, launches, and showroom updates.</p></div></div><div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{OW_MOTORS_CONTACT.socialChannels.map((channel)=><a key={channel.platform} href={channel.href} target="_blank" rel="noreferrer" className={`group flex min-h-36 flex-col justify-between rounded-xl border border-border bg-white p-5 !text-near-black shadow-[0_8px_28px_rgba(17,17,17,.05)] transition-all duration-300 hover:-translate-y-1 hover:!text-white ${channel.accent}`}><span className="flex items-center justify-between"><SocialIcon platform={channel.platform} className="h-7 w-7" /><ArrowUpRight aria-hidden="true" className="h-5 w-5 opacity-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" /></span><span><strong className="block text-base">{channel.label}</strong><span className="mt-1 block truncate text-xs opacity-65">{channel.handle}</span></span></a>)}</div></Container></section>
  </>;
}