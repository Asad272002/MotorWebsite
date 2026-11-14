import { Container } from "@/components/ui/container";

export type LegalSection = Readonly<{ heading: string; paragraphs?: readonly string[]; bullets?: readonly string[] }>;

export function LegalPage({ eyebrow, title, updated, introduction, sections }: Readonly<{ eyebrow: string; title: string; updated: string; introduction: readonly string[]; sections: readonly LegalSection[] }>) {
  return <>
    <header className="border-b border-border bg-soft-gray py-14 sm:py-20"><Container className="max-w-4xl"><p className="text-eyebrow mb-3">{eyebrow}</p><h1 className="text-display-xl">{title}</h1><p className="mt-4 text-sm font-semibold text-cool-gray">Last updated: {updated}</p></Container></header>
    <main className="bg-white py-12 sm:py-16"><Container className="max-w-4xl"><div className="space-y-5 text-[15px] leading-7 text-cool-gray">{introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><div className="mt-12 space-y-12">{sections.map((section) => <section key={section.heading} aria-labelledby={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}><h2 id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="font-display text-2xl font-bold text-near-black sm:text-3xl">{section.heading}</h2><div className="mt-4 space-y-4 text-[15px] leading-7 text-cool-gray">{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets?.length ? <ul className="list-disc space-y-2 pl-6">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</div></section>)}</div></Container></main>
  </>;
}
