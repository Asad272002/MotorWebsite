import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bike, UserRound } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { getDocumentHandoverSale } from "@/lib/erp/document-handovers";
import { DocumentWorkspace } from "./document-workspace.client";

export const metadata = { title: "Sold Bike Documents" };

export default async function SoldBikeDocumentsPage({ params }: Readonly<{ params: Promise<{ saleId: string }> }>) {
  const { saleId } = await params;
  const data = await getDocumentHandoverSale(saleId);
  if (!data) notFound();
  const { sale, files, handovers, actorRole } = data;
  const handed = files.filter((file) => file.handed_over).length;
  return <div className="space-y-7">
    <AdminPageHeader eyebrow="Document handover" title={`${sale.brand_name_snapshot} ${sale.motorcycle_name_snapshot}`} description={`${sale.receipt_number} · ${sale.cc_snapshot}cc · ${sale.color_name_snapshot ?? "Color not recorded"} · Chassis ${sale.chasis_number}`} actions={<Link href="/admin/document-handovers" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#D1D5DB] px-4 text-sm font-semibold hover:bg-[#F7F7F8]"><ArrowLeft className="h-4 w-4" />All handovers</Link>} />
    <section className="grid gap-4 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"><div><Bike className="h-5 w-5 text-[#C62828]" /><p className="mt-3 text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Motorcycle</p><p className="mt-1 font-semibold">{sale.brand_name_snapshot} {sale.motorcycle_name_snapshot}</p></div><div><UserRound className="h-5 w-5 text-[#C62828]" /><p className="mt-3 text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Buyer</p><p className="mt-1 font-semibold">{sale.customer?.full_name}</p><p className="text-xs text-[#6B7280]">{sale.customer?.phone_primary}</p></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Engine / chassis</p><p className="mt-2 text-sm">{sale.engine_number || "Engine not recorded"}</p><p className="text-xs text-[#6B7280]">{sale.chasis_number}</p></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Progress</p><div className="mt-2 flex items-center gap-2"><StatusBadge value={files.length > 0 && handed === files.length ? "completed" : handed ? "in_progress" : "draft"} label={`${handed} / ${files.length} handed`} /></div></div></section>
    <DocumentWorkspace sale={sale} files={files} handovers={handovers} actorRole={actorRole} />
  </div>;
}
