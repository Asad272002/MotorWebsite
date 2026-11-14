"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Camera, Check, FilePlus2, Images, Trash2, Upload, UserRoundCheck } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form.client";
import { AdminPanel, StatusBadge, adminInputClass, adminLabelClass, adminTextareaClass } from "@/components/admin/admin-ui";
import { createDocumentFile, deleteDocumentPage, finalizeDocumentHandover, uploadDocumentPages, voidDocumentHandover } from "@/app/admin/document-handover-actions";
import type { DocumentFile, DocumentHandover, HandoverSale } from "@/lib/erp/document-handovers";

type QueuedPicture = { id: string; file: File; url: string };

function PictureCapture({ saleId, documentFileId }: Readonly<{ saleId: string; documentFileId: string }>) {
  const [pictures, setPictures] = useState<QueuedPicture[]>([]);
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  function add(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).filter((file) => file.type.startsWith("image/")).map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) }));
    setPictures((current) => [...current, ...next].slice(0, 12));
  }
  function remove(id: string) {
    setPictures((current) => {
      const removed = current.find((picture) => picture.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((picture) => picture.id !== id);
    });
  }
  return (
    <AdminForm action={uploadDocumentPages} submitLabel={`Save ${pictures.length || ""} picture${pictures.length === 1 ? "" : "s"}`} pendingLabel="Uploading pictures..." className="space-y-3" formAttributes={{ encType: "multipart/form-data" }}>
      <input type="hidden" name="saleId" value={saleId} /><input type="hidden" name="documentFileId" value={documentFileId} />
      <input type="hidden" name="captureSource" value="camera" />
      {pictures.map((picture) => <input key={picture.id} type="file" name="pictures" className="hidden" ref={(input) => { if (input) { const transfer = new DataTransfer(); transfer.items.add(picture.file); input.files = transfer.files; } }} />)}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => cameraRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#C62828] bg-[#C62828] px-4 text-sm font-semibold text-white hover:bg-[#A91F1F]"><Camera className="h-4 w-4" />Open camera</button>
        <button type="button" onClick={() => uploadRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[#D1D5DB] px-4 text-sm font-semibold text-[#374151] hover:bg-[#F7F7F8]"><Upload className="h-4 w-4" />Choose pictures</button>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => { add(event.target.files); event.target.value = ""; }} />
        <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => { add(event.target.files); event.target.value = ""; }} />
      </div>
      {pictures.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{pictures.map((picture, index) => <figure key={picture.id} className="overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F7F7F8]"><div className="relative aspect-[4/3]"><Image src={picture.url} alt={`New page ${index + 1}`} fill unoptimized className="object-contain" /></div><figcaption className="flex items-center justify-between gap-2 border-t border-[#E5E7EB] bg-white px-2 py-2 text-xs"><span>Page {index + 1}</span><button type="button" onClick={() => remove(picture.id)} className="inline-flex min-h-9 min-w-9 items-center justify-center rounded text-[#C62828] hover:bg-red-50" aria-label={`Remove new page ${index + 1}`}><Trash2 className="h-4 w-4" /></button></figcaption></figure>)}</div> : <p className="rounded-md border border-dashed border-[#D1D5DB] bg-[#FAFAFA] px-4 py-5 text-center text-xs text-[#6B7280]">Capture clear pictures of every page. You can remove any wrong picture before saving.</p>}
    </AdminForm>
  );
}

export function DocumentWorkspace({ sale, files, handovers, actorRole }: Readonly<{ sale: HandoverSale; files: DocumentFile[]; handovers: DocumentHandover[]; actorRole: string }>) {
  const readyFiles = useMemo(() => files.filter((file) => file.pages.length > 0 && !file.handed_over), [files]);
  const [selected, setSelected] = useState<string[]>([]);
  const [recipientType, setRecipientType] = useState("buyer");
  const [recipientName, setRecipientName] = useState(sale.customer?.full_name ?? "");
  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); }
  return <div className="space-y-6">
    <AdminPanel title="Add a document file" description="Names are completely dynamic. Create only the files required for this sold motorcycle." actions={<FilePlus2 className="h-5 w-5 text-[#C62828]" />}>
      <AdminForm action={createDocumentFile} submitLabel="Create document file" pendingLabel="Creating file..." className="grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="saleId" value={sale.id} />
        <label className={adminLabelClass}>File name<input name="name" required minLength={2} maxLength={160} className={adminInputClass} placeholder="e.g. Registration smart card" /></label>
        <label className={adminLabelClass}>Reference number <span className="font-normal text-[#6B7280]">(optional)</span><input name="referenceNumber" maxLength={120} className={adminInputClass} /></label>
        <label className={`${adminLabelClass} sm:col-span-2`}>Description <span className="font-normal text-[#6B7280]">(optional)</span><textarea name="description" maxLength={500} rows={2} className={adminTextareaClass} /></label>
      </AdminForm>
    </AdminPanel>

    <AdminPanel title="Document files" description="Each file can contain several photographed pages. Handed-over files are locked to protect the record." actions={<span className="text-sm font-bold text-[#6B7280]">{files.length} files</span>}>
      <div className="space-y-5">{files.length ? files.map((file) => <article key={file.id} className={`rounded-lg border p-4 sm:p-5 ${file.handed_over ? "border-green-200 bg-green-50/40" : "border-[#E5E7EB]"}`}>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-xl font-bold">{file.name}</h3><StatusBadge value={file.handed_over ? "completed" : file.pages.length ? "in_progress" : "draft"} label={file.handed_over ? "Handed over" : file.pages.length ? "Ready" : "Awaiting pictures"} /></div>{file.description ? <p className="mt-1 text-sm text-[#6B7280]">{file.description}</p> : null}<p className="mt-2 text-xs text-[#9CA3AF]">{file.pages.length} saved picture{file.pages.length === 1 ? "" : "s"}</p></div><Images className="h-5 w-5 text-[#C62828]" /></div>
        {file.pages.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{file.pages.map((page, index) => <figure key={page.id} className="overflow-hidden rounded-md border border-[#E5E7EB] bg-white"><a href={page.signed_url} target="_blank" rel="noreferrer" className="relative block aspect-[4/3]"><Image src={page.signed_url ?? ""} alt={`${file.name}, page ${index + 1}`} fill unoptimized className="object-contain" /></a><figcaption className="flex items-center justify-between gap-2 border-t border-[#E5E7EB] px-2 py-2 text-xs"><span>Page {index + 1}</span>{!file.handed_over ? <AdminForm action={deleteDocumentPage} submitLabel="Delete" pendingLabel="Deleting..." destructive hideAutoSubmit className="contents" confirmMessage="Delete this incorrect document picture? This cannot be undone."><input type="hidden" name="saleId" value={sale.id} /><input type="hidden" name="pageId" value={page.id} /><button type="submit" className="inline-flex min-h-9 min-w-9 items-center justify-center rounded text-[#C62828] hover:bg-red-50" aria-label={`Delete page ${index + 1}`}><Trash2 className="h-4 w-4" /></button></AdminForm> : null}</figcaption></figure>)}</div> : null}
        {!file.handed_over ? <div className="mt-4 border-t border-[#E5E7EB] pt-4"><PictureCapture key={`${file.id}-${file.pages.length}`} saleId={sale.id} documentFileId={file.id} /></div> : null}
      </article>) : <div className="rounded-md border border-dashed border-[#D1D5DB] p-10 text-center text-sm text-[#6B7280]">No document files yet. Create the first one above.</div>}</div>
    </AdminPanel>

    <AdminPanel title="Hand over documents" description="Choose one file, several files, or all remaining ready files. A recipient photograph is mandatory." actions={<UserRoundCheck className="h-5 w-5 text-[#C62828]" />}>
      {readyFiles.length ? <AdminForm action={finalizeDocumentHandover} submitLabel="Complete handover" pendingLabel="Recording handover..." confirmMessage="Finalize this handover? Selected files will be locked and the recipient photograph will become part of the permanent record." formAttributes={{ encType: "multipart/form-data" }}>
        <input type="hidden" name="saleId" value={sale.id} />
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold">Select ready files</p><button type="button" onClick={() => setSelected(readyFiles.map((file) => file.id))} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#D1D5DB] px-3 text-xs font-bold hover:bg-[#F7F7F8]"><Check className="h-4 w-4" />Select all remaining</button></div>
        <div className="grid gap-2 sm:grid-cols-2">{readyFiles.map((file) => <label key={file.id} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border px-4 ${selected.includes(file.id) ? "border-[#C62828] bg-[#FEF2F2]" : "border-[#D1D5DB]"}`}><input type="checkbox" name="documentFileIds" value={file.id} checked={selected.includes(file.id)} onChange={() => toggle(file.id)} className="h-4 w-4 accent-[#C62828]" /><span><strong className="block text-sm">{file.name}</strong><span className="text-xs text-[#6B7280]">{file.pages.length} picture{file.pages.length === 1 ? "" : "s"}</span></span></label>)}</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={adminLabelClass}>Recipient type<select name="recipientType" value={recipientType} onChange={(event) => { const next = event.target.value; setRecipientType(next); if (next === "buyer") setRecipientName(sale.customer?.full_name ?? ""); }} className={adminInputClass}><option value="buyer">Original buyer</option><option value="representative">Representative</option></select></label>
          <label className={adminLabelClass}>Recipient name<input name="recipientName" required minLength={2} maxLength={120} value={recipientName} onChange={(event) => setRecipientName(event.target.value)} className={adminInputClass} /></label>
          <label className={adminLabelClass}>Recipient CNIC / ID {recipientType === "representative" ? "*" : "(optional)"}<input name="recipientCnic" required={recipientType === "representative"} maxLength={30} className={adminInputClass} /></label>
          <label className={adminLabelClass}>Recipient phone <span className="font-normal text-[#6B7280]">(optional)</span><input name="recipientPhone" type="tel" maxLength={30} className={adminInputClass} defaultValue={recipientType === "buyer" ? sale.customer?.phone_primary : ""} /></label>
          <label className={`${adminLabelClass} sm:col-span-2`}>Recipient photograph *<input name="recipientPhoto" type="file" accept="image/*" capture="user" required className={`${adminInputClass} py-2`} /><span className="mt-1 block text-xs font-normal text-[#6B7280]">Take a clear photograph of the person receiving the files. The handover cannot be completed without it.</span></label>
          <label className={`${adminLabelClass} sm:col-span-2`}>Signature image <span className="font-normal text-[#6B7280]">(optional)</span><input name="signature" type="file" accept="image/*" className={`${adminInputClass} py-2`} /></label>
          <label className={`${adminLabelClass} sm:col-span-2`}>Notes <span className="font-normal text-[#6B7280]">(optional)</span><textarea name="notes" maxLength={1000} rows={3} className={adminTextareaClass} /></label>
        </div>
        <label className="flex items-start gap-3 rounded-md border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-sm text-[#374151]"><input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#C62828]" /><span>I confirm that the selected original motorcycle document files were physically handed to the photographed recipient.</span></label>
      </AdminForm> : <p className="rounded-md border border-dashed border-[#D1D5DB] p-8 text-center text-sm text-[#6B7280]">No files are currently ready for handover.</p>}
    </AdminPanel>

    <AdminPanel title="Handover history" description="Completed and voided receipts remain available as an audit trail.">
      <div className="space-y-3">{handovers.length ? handovers.map((handover) => <article key={handover.id} className="grid gap-4 rounded-lg border border-[#E5E7EB] p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><Link href={`/admin/document-handovers/receipts/${handover.id}`} className="font-mono text-sm font-bold text-[#C62828] hover:underline">{handover.handover_number}</Link><StatusBadge value={handover.status === "completed" ? "completed" : "cancelled"} label={handover.status} /></div><p className="mt-2 text-sm font-semibold">{handover.recipient_name} · {handover.recipient_type}</p><p className="mt-1 text-xs text-[#6B7280]">{handover.items.map((item) => item.file_name_snapshot).join(", ")} · {new Date(handover.handed_over_at).toLocaleString("en-PK")}</p></div>{handover.status === "completed" && ["developer", "admin"].includes(actorRole) ? <AdminForm action={voidDocumentHandover} submitLabel="Void handover" pendingLabel="Voiding..." destructive confirmMessage="Void this handover? The original receipt and evidence will remain in the audit history." className="space-y-2"><input type="hidden" name="saleId" value={sale.id} /><input type="hidden" name="handoverId" value={handover.id} /><input name="reason" required minLength={5} maxLength={500} className={adminInputClass} placeholder="Reason for voiding" /></AdminForm> : null}</article>) : <p className="rounded-md border border-dashed border-[#D1D5DB] p-8 text-center text-sm text-[#6B7280]">No handovers recorded yet.</p>}</div>
    </AdminPanel>
  </div>;
}
