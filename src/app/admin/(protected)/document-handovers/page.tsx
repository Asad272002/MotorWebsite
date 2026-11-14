import Link from "next/link";
import { Camera, CheckCircle2, FileClock, Files, Search } from "lucide-react";
import { AdminEmptyState, AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { listDocumentHandoverSales } from "@/lib/erp/document-handovers";

export const metadata = { title: "Document Handovers" };

export default async function DocumentHandoversPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const sales = await listDocumentHandoverSales(query);
  const stats = {
    total: sales.length,
    awaiting: sales.filter((sale) => sale.document_count === 0).length,
    partial: sales.filter((sale) => sale.handed_count > 0 && sale.handed_count < sale.document_count).length,
    complete: sales.filter((sale) => sale.document_count > 0 && sale.handed_count === sale.document_count).length,
  };
  return <div className="space-y-7">
    <AdminPageHeader eyebrow="Sales operations" title="Document Handovers" description="Create dynamic document files for sold motorcycles, capture their pages, and record individual or complete handovers." />
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[
      { label: "Eligible bike sales", value: stats.total, icon: Files },
      { label: "No files created", value: stats.awaiting, icon: FileClock },
      { label: "Partial handovers", value: stats.partial, icon: Camera },
      { label: "Fully handed over", value: stats.complete, icon: CheckCircle2 },
    ].map(({ label, value, icon: Icon }) => <article key={label} className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm"><Icon className="h-5 w-5 text-[#C62828]" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></article>)}</section>
    <section className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm"><header className="border-b border-[#E5E7EB] px-5 py-4"><div className="flex items-center gap-3"><Search className="h-5 w-5 text-[#C62828]" /><div><h2 className="font-display text-2xl font-bold">Sold-bike records</h2><p className="text-sm text-[#6B7280]">Search approved and completed sales by chassis number, CNIC, or customer name.</p></div></div><form method="get" className="mt-4 flex flex-col gap-2 sm:flex-row"><label htmlFor="handover-lookup" className="sr-only">Search sold-bike records</label><input id="handover-lookup" name="q" type="search" defaultValue={query} placeholder="Chassis, CNIC, or customer name" className="min-h-11 flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 text-sm outline-none transition focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/15" /><button type="submit" className="min-h-11 rounded-md bg-[#C62828] px-5 text-sm font-bold text-white transition hover:bg-[#A91F1F]">Search</button>{query ? <Link href="/admin/document-handovers" className="flex min-h-11 items-center justify-center rounded-md border border-[#D1D5DB] px-5 text-sm font-semibold hover:bg-[#F9FAFB]">Clear</Link> : null}</form>{query ? <p className="mt-3 text-xs text-[#6B7280]">{sales.length} matching record{sales.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;</p> : null}</header>{sales.length ? <div className="grid gap-3 p-4 sm:p-5">{sales.map((sale) => {
      const complete = sale.document_count > 0 && sale.handed_count === sale.document_count;
      const partial = sale.handed_count > 0 && !complete;
      return <Link key={sale.id} href={`/admin/document-handovers/${sale.id}`} className="grid gap-4 rounded-lg border border-[#E5E7EB] p-4 transition-colors hover:border-[#C62828]/40 hover:bg-[#FFFDFD] lg:grid-cols-[2fr_1.2fr_1fr_auto] lg:items-center"><div><p className="font-mono text-xs font-bold text-[#6B7280]">{sale.receipt_number}</p><h3 className="mt-1 font-display text-xl font-bold">{sale.brand_name_snapshot} {sale.motorcycle_name_snapshot}</h3><p className="mt-1 text-xs text-[#6B7280]">{sale.cc_snapshot}cc · {sale.color_name_snapshot} · Chassis {sale.chasis_number}</p></div><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">Customer</p><p className="mt-1 text-sm font-semibold">{sale.customer?.full_name ?? "Unknown"}</p><p className="font-mono text-xs text-[#6B7280]">{sale.customer?.cnic ?? "-"}</p></div><div><p className="text-xs text-[#6B7280]">{sale.handed_count} of {sale.document_count} files handed over</p><p className="mt-1 text-xs text-[#9CA3AF]">{sale.handover_count} receipt{sale.handover_count === 1 ? "" : "s"}</p></div><StatusBadge value={complete ? "completed" : partial ? "in_progress" : sale.document_count ? "draft" : "inactive"} label={complete ? "Complete" : partial ? "Partial" : sale.document_count ? "Preparing" : "No files"} /></Link>;
    })}</div> : <div className="p-5"><AdminEmptyState title={query ? "No matching sold bike" : "No eligible bike sales"} description={query ? "Try a different chassis number, CNIC, or customer name." : "Approved or completed motorcycle sales will appear here automatically."} /></div>}</section>
  </div>;
}
