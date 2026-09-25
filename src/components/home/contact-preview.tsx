import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/ui/section";
import { OW_MOTORS_CONTACT } from "@/data/contact";
import type { ContactPreviewContent } from "@/lib/storefront/content";

export function ContactPreview({ content }: Readonly<{ content: ContactPreviewContent }>) {
  if (!content.visible) return null;
  const items = [
    { Icon: MapPin, label: "Location", text: content.location },
    { Icon: Phone, label: "Phone", text: content.phone },
    { Icon: Mail, label: "Email", text: content.email },
    { Icon: Clock, label: "Opening Hours", text: content.openingHours },
  ] as const;
  return (
    <Section labelledBy="contact-preview-title" className="border-t border-border bg-white py-14 sm:py-20">
      <p className="text-eyebrow mb-3">{content.eyebrow}</p><h2 id="contact-preview-title" className="text-display-lg">{content.heading}</h2>
      <div className="mt-9 grid items-stretch gap-10 md:mt-12 md:grid-cols-[.8fr_1.2fr] md:gap-12">
        <div className="space-y-7">{items.map(({ Icon, label, text }) => <div key={label} className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft-gray"><Icon aria-hidden="true" className="h-[17px] w-[17px] text-brand" /></div><div><h3 className="text-sm font-semibold">{label}</h3><p className="mt-1 text-sm leading-6 text-cool-gray">{text}</p></div></div>)}<a href={OW_MOTORS_CONTACT.mapsShareUrl} target="_blank" rel="noreferrer" className="ow-button-primary mt-2 inline-flex">Open in Google Maps</a></div>
        <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-border bg-soft-gray shadow-[0_14px_38px_rgba(17,17,17,.08)]"><iframe title="OW Motors showroom location on Google Maps" src={OW_MOTORS_CONTACT.mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" /></div>
      </div>
    </Section>
  );
}