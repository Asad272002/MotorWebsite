import Image from "next/image";
import { notFound } from "next/navigation";
import { AdminPageHeader, StatusBadge } from "@/components/admin/admin-ui";
import { getDocumentHandoverReceipt } from "@/lib/erp/document-handovers";

export const metadata = { title: "Document Handover Receipt" };

export default async function HandoverReceiptPage({ params }: Readonly<{ params: Promise<{ handoverId: string }> }>) {
  const { handoverId } = await params;
  const receipt = await getDocumentHandoverReceipt(handoverId);
  if (!receipt) notFound();
  return <div className="space-y-7"><AdminPageHeader eyebrow="Document receipt" title={receipt.handover_number} description="Immutable evidence of motorcycle document handover. Use the browser print command to print or save as PDF." />
    <article className="mx-auto max-w-4xl rounded-lg border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-10 print:border-0 print:shadow-none"><header className="flex flex-col justify-between gap-4 border-b-2 border-[#111111] pb-5 sm:flex-row sm:items-start"><div><p className="font-display text-3xl font-bold">OW MOTORS</p><p className="mt-1 text-xs uppercase tracking-[.18em] text-[#6B7280]">Document handover receipt</p></div><div className="sm:text-right"><p className="font-mono font-bold">{receipt.handover_number}</p><p className="mt-1 text-xs text-[#6B7280]">{new Date(receipt.handed_over_at).toLocaleString("en-PK")}</p><div className="mt-2"><StatusBadge value={receipt.status === "completed" ? "completed" : "cancelled"} label={receipt.status} /></div></div></header>
      <section className="mt-6 grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Motorcycle</p><p className="mt-2 font-display text-xl font-bold">{receipt.sale.brand_name_snapshot} {receipt.sale.motorcycle_name_snapshot}</p><p className="mt-1 text-sm text-[#6B7280]">{receipt.sale.cc_snapshot}cc · {receipt.sale.color_name_snapshot}</p><p className="mt-1 text-sm">Chassis: {receipt.sale.chasis_number}<br />Engine: {receipt.sale.engine_number || "Not recorded"}<br />Sale: {receipt.sale.receipt_number}</p></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Recipient</p><p className="mt-2 font-display text-xl font-bold">{receipt.recipient_name}</p><p className="mt-1 text-sm capitalize text-[#6B7280]">{receipt.recipient_type}</p><p className="mt-1 text-sm">CNIC/ID: {receipt.recipient_cnic || "Not recorded"}<br />Phone: {receipt.recipient_phone || "Not recorded"}</p></div></section>
      <section className="mt-7 border-y border-[#E5E7EB] py-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Files handed over</p><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-semibold">{receipt.items.map((item: { document_file_id: string; file_name_snapshot: string }) => <li key={item.document_file_id}>{item.file_name_snapshot}</li>)}</ol></section>
      <section className="mt-7 grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Recipient photograph</p>{receipt.photo_url ? <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F7F7F8]"><Image src={receipt.photo_url} alt={`Recipient ${receipt.recipient_name}`} fill unoptimized className="object-contain" /></div> : null}</div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#6B7280]">Acknowledgement</p><p className="mt-3 text-sm leading-6">{receipt.acknowledgement_text}</p><p className="mt-5 text-sm"><strong>Handed over by:</strong><br />{receipt.staff?.full_name ?? "OW Motors staff"}</p>{receipt.notes ? <p className="mt-4 text-sm"><strong>Notes:</strong><br />{receipt.notes}</p> : null}</div></section>
    </article>
  </div>;
}
