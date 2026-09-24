import type { Metadata } from "next";
import Link from "next/link";
import { CatalogLayout } from "@/components/catalog/catalog-layout";
import { parseCatalogFilters, type RawSearchParams } from "@/lib/catalog/filters";
import { catalogMetadataPolicy, createPageMetadata } from "@/lib/seo/metadata";
import { getCatalogPageData } from "@/lib/supabase/public-queries";

type Props = { searchParams: Promise<RawSearchParams> };

const TITLE = "All Motorcycles";
const DESCRIPTION = "Explore the complete OW Motors motorcycle lineup.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  const filters = parseCatalogFilters(query);
  const catalog = await getCatalogPageData(filters, undefined, "motorcycles", 6);
  const policy = catalogMetadataPolicy(query, "/motorcycles");
  const invalidPage = filters.page > catalog.totalPages;
  return createPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: invalidPage ? "/motorcycles" : policy.canonicalPath,
    noIndex: policy.noIndex || invalidPage || catalog.total === 0,
  });
}

export default async function MotorcyclesPage({ searchParams }: Props) {
  const filters = parseCatalogFilters(await searchParams);
  const catalog = await getCatalogPageData(filters, undefined, "motorcycles", 6);
  return <>
    <CatalogLayout title={TITLE} description={DESCRIPTION} pathname="/motorcycles" filters={filters} catalog={catalog} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Motorcycles" }]} desktopColumns={3} />
    <section className="border-y border-border bg-near-black px-[var(--page-gutter)] py-12 text-white">
      <div className="mx-auto flex max-w-5xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Dedicated Collection</p><h2 className="mt-2 font-display text-4xl font-bold">Replica Motorcycles</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">Explore replica designs separately, with their own CC, ABS, color, price, and specification options.</p></div>
        <Link href="/motorcycles/replicas" className="inline-flex min-h-12 shrink-0 items-center justify-center border border-brand bg-brand px-6 text-sm font-semibold !text-white transition-colors hover:bg-white hover:!text-brand">View Replicas</Link>
      </div>
    </section>
  </>;
}
