import "server-only";

import { serviceRoleClient } from "@/lib/admin/erp-action-runtime";
import { getAuthenticatedProfile } from "@/lib/supabase/auth";

// New handover tables are added by the accompanying migration. This narrow
// escape hatch can be removed after regenerating the project-wide DB contract.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LooseClient = any;

export type DocumentPage = { id: string; storage_path: string; sequence_number: number; capture_source: string; mime_type: string; file_size: number; captured_at: string; signed_url?: string };
export type DocumentFile = { id: string; sale_id: string; name: string; description: string | null; reference_number: string | null; notes: string | null; created_at: string; pages: DocumentPage[]; handed_over: boolean };
export type DocumentHandover = { id: string; handover_number: string; recipient_type: string; recipient_name: string; recipient_cnic: string | null; recipient_phone: string | null; recipient_photo_storage_path: string; signature_storage_path: string | null; handed_over_at: string; status: string; notes: string | null; items: { document_file_id: string; file_name_snapshot: string }[]; staff?: { full_name?: string | null } | null; photo_url?: string };
export type HandoverSale = { id: string; receipt_number: string; sale_status: string; requested_by: string; requested_at: string; brand_name_snapshot: string; motorcycle_name_snapshot: string; color_name_snapshot: string | null; cc_snapshot: number; chasis_number: string; engine_number: string | null; customer: { id: string; full_name: string; cnic: string; phone_primary: string; phone_secondary?: string | null; address?: string | null } | null };

function canSeeSale(role: string, actorId: string, sale: HandoverSale) {
  return role === "developer" || role === "admin" || sale.requested_by === actorId;
}

export async function listDocumentHandoverSales() {
  const actor = await getAuthenticatedProfile();
  if (!actor || !actor.profile.is_active || !["developer", "admin", "manager"].includes(actor.profile.role)) return [];
  const db = serviceRoleClient() as unknown as LooseClient;
  const [salesResult, filesResult, itemsResult, handoversResult] = await Promise.all([
    db.from("sales").select("id,receipt_number,sale_status,requested_by,requested_at,brand_name_snapshot,motorcycle_name_snapshot,color_name_snapshot,cc_snapshot,chasis_number,engine_number,customer:customers(id,full_name,cnic,phone_primary)").in("sale_status", ["approved", "completed"]).order("requested_at", { ascending: false }),
    db.from("sale_document_files").select("id,sale_id,archived_at").is("archived_at", null),
    db.from("document_handover_items").select("document_file_id,handover:document_handovers!inner(status)"),
    db.from("document_handovers").select("id,sale_id,status"),
  ]);
  const sales = ((salesResult.data ?? []) as HandoverSale[]).filter((sale) => canSeeSale(actor.profile.role, actor.userId, sale));
  const activeHandedIds = new Set((itemsResult.data ?? []).filter((row: { handover?: { status?: string } | null }) => row.handover?.status === "completed").map((row: { document_file_id: string }) => row.document_file_id));
  return sales.map((sale) => {
    const files = (filesResult.data ?? []).filter((file: { sale_id: string }) => file.sale_id === sale.id);
    const handed = files.filter((file: { id: string }) => activeHandedIds.has(file.id)).length;
    const handovers = (handoversResult.data ?? []).filter((handover: { sale_id: string; status: string }) => handover.sale_id === sale.id && handover.status === "completed").length;
    return { ...sale, document_count: files.length, handed_count: handed, handover_count: handovers };
  });
}

export async function getDocumentHandoverSale(saleId: string) {
  const actor = await getAuthenticatedProfile();
  if (!actor || !actor.profile.is_active || !["developer", "admin", "manager"].includes(actor.profile.role)) return null;
  const db = serviceRoleClient() as unknown as LooseClient;
  const saleResult = await db.from("sales").select("id,receipt_number,sale_status,requested_by,requested_at,brand_name_snapshot,motorcycle_name_snapshot,color_name_snapshot,cc_snapshot,chasis_number,engine_number,customer:customers(id,full_name,cnic,phone_primary,phone_secondary,address)").eq("id", saleId).maybeSingle();
  const sale = saleResult.data as HandoverSale | null;
  if (!sale || !["approved", "completed"].includes(sale.sale_status) || !canSeeSale(actor.profile.role, actor.userId, sale)) return null;

  const [filesResult, handoversResult] = await Promise.all([
    db.from("sale_document_files").select("id,sale_id,name,description,reference_number,notes,created_at,pages:sale_document_pages(id,storage_path,sequence_number,capture_source,mime_type,file_size,captured_at)").eq("sale_id", saleId).is("archived_at", null).order("created_at"),
    db.from("document_handovers").select("id,handover_number,recipient_type,recipient_name,recipient_cnic,recipient_phone,recipient_photo_storage_path,signature_storage_path,handed_over_at,status,notes,items:document_handover_items(document_file_id,file_name_snapshot),staff:profiles!document_handovers_handed_over_by_fkey(full_name)").eq("sale_id", saleId).order("handed_over_at", { ascending: false }),
  ]);
  const handovers = (handoversResult.data ?? []) as DocumentHandover[];
  const activeHandedIds = new Set(handovers.filter((handover) => handover.status === "completed").flatMap((handover) => handover.items.map((item) => item.document_file_id)));
  const files = ((filesResult.data ?? []) as Omit<DocumentFile, "handed_over">[]).map((file) => ({ ...file, pages: [...(file.pages ?? [])].sort((a, b) => a.sequence_number - b.sequence_number), handed_over: activeHandedIds.has(file.id) }));
  const storage = db.storage.from("sale-documents");
  const paths = [...files.flatMap((file) => file.pages.map((page) => page.storage_path)), ...handovers.map((handover) => handover.recipient_photo_storage_path)].filter(Boolean);
  const signed = paths.length ? await storage.createSignedUrls(paths, 3600) : { data: [] };
  const urlByPath = new Map<string, string>((signed.data ?? []).map((entry: { path: string; signedUrl: string }) => [entry.path, String(entry.signedUrl)]));
  return {
    sale,
    files: files.map((file) => ({ ...file, pages: file.pages.map((page) => ({ ...page, signed_url: urlByPath.get(page.storage_path) })) })),
    handovers: handovers.map((handover) => ({ ...handover, photo_url: urlByPath.get(handover.recipient_photo_storage_path) })),
    actorRole: actor.profile.role,
  };
}

export async function getDocumentHandoverReceipt(handoverId: string) {
  const actor = await getAuthenticatedProfile();
  if (!actor || !actor.profile.is_active || !["developer", "admin", "manager"].includes(actor.profile.role)) return null;
  const db = serviceRoleClient() as unknown as LooseClient;
  const result = await db.from("document_handovers").select("*,items:document_handover_items(document_file_id,file_name_snapshot),staff:profiles!document_handovers_handed_over_by_fkey(full_name),sale:sales(id,receipt_number,requested_by,brand_name_snapshot,motorcycle_name_snapshot,color_name_snapshot,cc_snapshot,chasis_number,engine_number,customer:customers(full_name,cnic,phone_primary))").eq("id", handoverId).maybeSingle();
  const row = result.data;
  if (!row || !canSeeSale(actor.profile.role, actor.userId, row.sale)) return null;
  const signed = await db.storage.from("sale-documents").createSignedUrl(row.recipient_photo_storage_path, 3600);
  return { ...row, photo_url: signed.data?.signedUrl ?? null };
}
