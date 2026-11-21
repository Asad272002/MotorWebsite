"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { AdminActionState } from "@/lib/admin/action-state";
import { serviceRoleClient, writeActivity } from "@/lib/admin/erp-action-runtime";
import { getDocumentHandoverSale } from "@/lib/erp/document-handovers";
import { getAuthenticatedProfile } from "@/lib/supabase/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LooseClient = any;
const uuid = z.string().uuid();
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

async function actor() {
  const current = await getAuthenticatedProfile();
  if (!current || !current.profile.is_active || !["developer", "admin", "manager"].includes(current.profile.role)) return null;
  return current;
}

function refresh(saleId: string) {
  revalidatePath("/admin/document-handovers");
  revalidatePath(`/admin/document-handovers/${saleId}`);
  revalidatePath("/admin/sales/list");
  revalidatePath("/admin/activity");
}

function clean(value: FormDataEntryValue | null, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function validImage(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && value.size <= MAX_IMAGE_BYTES && imageTypes.has(value.type);
}

export async function createDocumentFile(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const current = await actor();
  if (!current) return { status: "error", message: "You are not authorized to create document files." };
  const saleId = clean(formData.get("saleId"));
  const name = clean(formData.get("name"), 160);
  if (!uuid.safeParse(saleId).success || !(await getDocumentHandoverSale(saleId))) return { status: "error", message: "The sold-bike record is unavailable." };
  if (name.length < 2) return { status: "error", message: "Enter a document file name." };
  const db = serviceRoleClient() as unknown as LooseClient;
  const result = await db.from("sale_document_files").insert({
    sale_id: saleId,
    name,
    description: clean(formData.get("description"), 500) || null,
    reference_number: clean(formData.get("referenceNumber"), 120) || null,
    notes: clean(formData.get("notes"), 1000) || null,
    created_by: current.userId,
  }).select("id").single();
  if (result.error) return { status: "error", message: "The document file could not be created." };
  await writeActivity({ actorUserId: current.userId, actorRole: current.profile.role, action: "document_file_created", summary: `Created document file: ${name}`, targetTable: "sale_document_files", targetId: result.data.id, metadata: { saleId, name } });
  refresh(saleId);
  return { status: "success", message: `“${name}” is ready for document pictures.` };
}

export async function uploadDocumentPages(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const current = await actor();
  if (!current) return { status: "error", message: "You are not authorized to upload document pictures." };
  const saleId = clean(formData.get("saleId"));
  const fileId = clean(formData.get("documentFileId"));
  if (!uuid.safeParse(saleId).success || !uuid.safeParse(fileId).success || !(await getDocumentHandoverSale(saleId))) return { status: "error", message: "The document file is unavailable." };
  const pictures = formData.getAll("pictures").filter(validImage);
  if (!pictures.length) return { status: "error", message: "Capture or choose at least one document picture." };
  if (pictures.length > 12) return { status: "error", message: "Upload no more than 12 pages at a time." };
  const db = serviceRoleClient() as unknown as LooseClient;
  const fileResult = await db.from("sale_document_files").select("id,sale_id").eq("id", fileId).eq("sale_id", saleId).is("archived_at", null).maybeSingle();
  if (!fileResult.data) return { status: "error", message: "The document file is unavailable." };
  const handedResult = await db.from("document_handover_items").select("id,handover:document_handovers!inner(status)").eq("document_file_id", fileId);
  if ((handedResult.data ?? []).some((row: { handover?: { status?: string } }) => row.handover?.status === "completed")) return { status: "error", message: "Pictures cannot be changed after this file has been handed over." };
  const maxResult = await db.from("sale_document_pages").select("sequence_number").eq("document_file_id", fileId).order("sequence_number", { ascending: false }).limit(1);
  let sequence = Number(maxResult.data?.[0]?.sequence_number ?? 0);
  const uploaded: { path: string; row: Record<string, unknown> }[] = [];
  for (const picture of pictures) {
    sequence += 1;
    const extension = picture.type === "image/png" ? "png" : picture.type === "image/webp" ? "webp" : "jpg";
    const path = `sales/${saleId}/files/${fileId}/${crypto.randomUUID()}.${extension}`;
    const storageResult = await db.storage.from("sale-documents").upload(path, picture, { contentType: picture.type, upsert: false });
    if (storageResult.error) {
      if (uploaded.length) await db.storage.from("sale-documents").remove(uploaded.map((item) => item.path));
      return { status: "error", message: "A document picture could not be uploaded. Nothing was saved." };
    }
    uploaded.push({ path, row: { document_file_id: fileId, storage_path: path, sequence_number: sequence, capture_source: clean(formData.get("captureSource"), 20) === "camera" ? "camera" : "upload", mime_type: picture.type, file_size: picture.size, captured_by: current.userId } });
  }
  const insertResult = await db.from("sale_document_pages").insert(uploaded.map((item) => item.row));
  if (insertResult.error) {
    await db.storage.from("sale-documents").remove(uploaded.map((item) => item.path));
    return { status: "error", message: "The document pictures could not be attached to the file." };
  }
  await writeActivity({ actorUserId: current.userId, actorRole: current.profile.role, action: "document_page_added", summary: `Added ${uploaded.length} document picture(s)`, targetTable: "sale_document_files", targetId: fileId, metadata: { saleId, count: uploaded.length } });
  refresh(saleId);
  return { status: "success", message: `${uploaded.length} document picture${uploaded.length === 1 ? "" : "s"} saved.` };
}

export async function deleteDocumentPage(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const current = await actor();
  if (!current) return { status: "error", message: "You are not authorized to delete document pictures." };
  const saleId = clean(formData.get("saleId"));
  const pageId = clean(formData.get("pageId"));
  if (!uuid.safeParse(saleId).success || !uuid.safeParse(pageId).success || !(await getDocumentHandoverSale(saleId))) return { status: "error", message: "The document picture is unavailable." };
  const db = serviceRoleClient() as unknown as LooseClient;
  const pageResult = await db.from("sale_document_pages").select("id,storage_path,document_file_id,file:sale_document_files!inner(sale_id)").eq("id", pageId).maybeSingle();
  const page = pageResult.data;
  if (!page || page.file?.sale_id !== saleId) return { status: "error", message: "The document picture is unavailable." };
  const handedResult = await db.from("document_handover_items").select("id,handover:document_handovers!inner(status)").eq("document_file_id", page.document_file_id);
  if ((handedResult.data ?? []).some((row: { handover?: { status?: string } }) => row.handover?.status === "completed")) return { status: "error", message: "Pictures cannot be deleted after this file has been handed over." };
  const deleted = await db.from("sale_document_pages").delete().eq("id", pageId);
  if (deleted.error) return { status: "error", message: "The picture could not be deleted." };
  const storageResult = await db.storage.from("sale-documents").remove([page.storage_path]);
  if (storageResult.error) console.error("[OW Motors orphaned document image]", { pageId });
  await writeActivity({ actorUserId: current.userId, actorRole: current.profile.role, action: "document_page_deleted", summary: "Deleted an incorrect document picture", targetTable: "sale_document_files", targetId: page.document_file_id, metadata: { saleId, pageId } });
  refresh(saleId);
  return { status: "success", message: "The incorrect document picture was deleted." };
}

export async function finalizeDocumentHandover(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const current = await actor();
  if (!current) return { status: "error", message: "You are not authorized to complete handovers." };
  const saleId = clean(formData.get("saleId"));
  const recipientType = clean(formData.get("recipientType"), 30);
  const recipientName = clean(formData.get("recipientName"), 120);
  const recipientCnic = clean(formData.get("recipientCnic"), 30);
  const selectedIds = formData.getAll("documentFileIds").map((value) => clean(value)).filter((value) => uuid.safeParse(value).success);
  const photo = formData.get("recipientPhoto");
  if (!uuid.safeParse(saleId).success || !(await getDocumentHandoverSale(saleId))) return { status: "error", message: "The sold-bike record is unavailable." };
  if (!selectedIds.length) return { status: "error", message: "Select at least one ready document file." };
  if (recipientName.length < 2) return { status: "error", message: "Enter the recipient’s name." };
  if (recipientType === "representative" && !recipientCnic) return { status: "error", message: "Enter the representative’s CNIC or ID." };
  if (!validImage(photo)) return { status: "error", message: "A recipient photograph is required for every handover." };
  const db = serviceRoleClient() as unknown as LooseClient;
  const handoverId = crypto.randomUUID();
  const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
  const photoPath = `sales/${saleId}/handovers/${handoverId}/recipient.${extension}`;
  const photoUpload = await db.storage.from("sale-documents").upload(photoPath, photo, { contentType: photo.type, upsert: false });
  if (photoUpload.error) return { status: "error", message: "The required recipient photograph could not be uploaded." };
  const rpc = await db.rpc("finalize_document_handover", {
    p_sale_id: saleId,
    p_document_file_ids: selectedIds,
    p_recipient_type: recipientType,
    p_recipient_name: recipientName,
    p_recipient_cnic: recipientCnic || null,
    p_recipient_phone: clean(formData.get("recipientPhone"), 30) || null,
    p_notes: clean(formData.get("notes"), 1000) || null,
    p_acknowledgement_text: "The recipient confirms receipt of the listed original motorcycle documents.",
    p_recipient_photo_storage_path: photoPath,
    p_actor_id: current.userId,
  });
  if (rpc.error) {
    await db.storage.from("sale-documents").remove([photoPath]);
    return { status: "error", message: rpc.error.message || "The handover could not be completed." };
  }
  await writeActivity({ actorUserId: current.userId, actorRole: current.profile.role, action: "document_handover_completed", summary: `Completed a ${selectedIds.length}-file document handover`, targetTable: "document_handovers", targetId: rpc.data, metadata: { saleId, documentFileIds: selectedIds, recipientType } });
  refresh(saleId);
  return { status: "success", message: "Document handover completed with recipient photograph.", data: { handoverId: rpc.data } };
}

export async function voidDocumentHandover(_state: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const current = await actor();
  if (!current || !["developer", "admin"].includes(current.profile.role)) return { status: "error", message: "Only an administrator can void a handover." };
  const saleId = clean(formData.get("saleId"));
  const handoverId = clean(formData.get("handoverId"));
  const reason = clean(formData.get("reason"), 500);
  if (!uuid.safeParse(saleId).success || !uuid.safeParse(handoverId).success || reason.length < 5) return { status: "error", message: "Enter a clear reason before voiding this handover." };
  const db = serviceRoleClient() as unknown as LooseClient;
  const result = await db.from("document_handovers").update({ status: "voided", voided_by: current.userId, voided_at: new Date().toISOString(), void_reason: reason }).eq("id", handoverId).eq("sale_id", saleId).eq("status", "completed").select("id").maybeSingle();
  if (result.error || !result.data) return { status: "error", message: "The handover could not be voided." };
  await writeActivity({ actorUserId: current.userId, actorRole: current.profile.role, action: "document_handover_voided", summary: `Voided document handover: ${reason}`, targetTable: "document_handovers", targetId: handoverId, metadata: { saleId, reason } });
  refresh(saleId);
  return { status: "success", message: "The handover was voided. Its audit record remains available." };
}
