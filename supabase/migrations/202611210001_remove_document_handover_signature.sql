begin;

create or replace function public.finalize_document_handover(
  p_sale_id uuid,
  p_document_file_ids uuid[],
  p_recipient_type text,
  p_recipient_name text,
  p_recipient_cnic text,
  p_recipient_phone text,
  p_notes text,
  p_acknowledgement_text text,
  p_recipient_photo_storage_path text,
  p_actor_id uuid
)
returns uuid
language plpgsql
security definer
set search_path to 'public', 'pg_temp'
as $function$
declare
  v_handover_id uuid := gen_random_uuid();
  v_number text;
  v_expected integer;
  v_ready integer;
begin
  if coalesce(array_length(p_document_file_ids, 1), 0) = 0 then raise exception 'Select at least one document file.'; end if;
  if nullif(btrim(p_recipient_photo_storage_path), '') is null then raise exception 'A recipient photograph is required.'; end if;
  if p_recipient_type not in ('buyer','representative') then raise exception 'Invalid recipient type.'; end if;
  if p_recipient_type = 'representative' and nullif(btrim(p_recipient_cnic), '') is null then raise exception 'Representative CNIC is required.'; end if;
  if not exists (select 1 from profiles where id = p_actor_id and is_active and role in ('developer','admin','manager')) then raise exception 'Not authorized.'; end if;
  if not exists (select 1 from sales where id = p_sale_id and sale_status in ('approved','completed')) then raise exception 'Only approved or completed bike sales can be handed over.'; end if;

  select count(distinct id) into v_expected
  from sale_document_files
  where id = any(p_document_file_ids) and sale_id = p_sale_id and archived_at is null;

  select count(distinct f.id) into v_ready
  from sale_document_files f
  where f.id = any(p_document_file_ids)
    and f.sale_id = p_sale_id
    and f.archived_at is null
    and exists (select 1 from sale_document_pages p where p.document_file_id = f.id)
    and not exists (
      select 1
      from document_handover_items i
      join document_handovers h on h.id = i.handover_id
      where i.document_file_id = f.id and h.status = 'completed'
    );

  if v_expected <> array_length(p_document_file_ids, 1) or v_ready <> v_expected then
    raise exception 'One or more files are unavailable, empty, or already handed over.';
  end if;

  v_number := 'OWM-HO-' || lpad(nextval('document_handover_number_seq')::text, 6, '0');
  insert into document_handovers (
    id, handover_number, sale_id, recipient_type, recipient_name,
    recipient_cnic, recipient_phone, notes, acknowledgement_text,
    recipient_photo_storage_path, handed_over_by
  ) values (
    v_handover_id, v_number, p_sale_id, p_recipient_type, btrim(p_recipient_name),
    nullif(btrim(p_recipient_cnic), ''), nullif(btrim(p_recipient_phone), ''),
    nullif(btrim(p_notes), ''), p_acknowledgement_text,
    p_recipient_photo_storage_path, p_actor_id
  );

  insert into document_handover_items (handover_id, document_file_id, file_name_snapshot)
  select v_handover_id, id, name
  from sale_document_files
  where id = any(p_document_file_ids);

  return v_handover_id;
end
$function$;

revoke execute on function public.finalize_document_handover(uuid, uuid[], text, text, text, text, text, text, text, uuid) from public, anon;
grant execute on function public.finalize_document_handover(uuid, uuid[], text, text, text, text, text, text, text, uuid) to authenticated, service_role;

drop function if exists public.finalize_document_handover(uuid, uuid[], text, text, text, text, text, text, text, text, uuid);
alter table public.document_handovers drop column if exists signature_storage_path;

commit;
