import type { Metadata } from "next";
import { CatalogLayout } from "@/components/catalog/catalog-layout";
import { parseCatalogFilters, type RawSearchParams } from "@/lib/catalog/filters";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getCatalogPageData } from "@/lib/supabase/public-queries";

type Props = { searchParams: Promise<RawSearchParams> };

export const metadata: Metadata = createPageMetadata({
  title: "Replica Motorcycles",
  description: "Explore replica motorcycles available through OW Motors, with CC, ABS, color, price, and specification options.",
  path: "/motorcycles/replicas",
});

export default async function ReplicaMotorcyclesPage({ searchParams }: Props) {
  const filters = parseCatalogFilters(await searchParams);
  const catalog = await getCatalogPageData(filters, undefined, "replicas", 12);
  return <CatalogLayout
    title="Replica Motorcycles"
    description="A dedicated collection of replica motorcycle designs. Compare engine capacity, ABS and non-ABS packages, colors, prices, and specifications."
    pathname="/motorcycles/replicas"
    filters={filters}
    catalog={catalog}
    lockedCategory="replicas"
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Motorcycles", href: "/motorcycles" }, { label: "Replicas" }]}
    desktopColumns={3}
  />;
}
