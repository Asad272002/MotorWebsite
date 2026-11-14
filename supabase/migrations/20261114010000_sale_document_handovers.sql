-- Dynamic sold-bike document vault and auditable handovers.

alter type public.activity_action add value if not exists 'document_file_created';
alter type public.activity_action add value if not exists 'document_page_added';
alter type public.activity_action add value if not exists 'document_page_deleted';
alter type public.activity_action add value if not exists 'document_handover_completed';
alter type public.activity_action add value if not exists 'document_handover_voided';

create sequence if not exists public.document_handover_number_seq start 1;

create table if not exists public.sale_document_files (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  name text not null,
  description text,
  reference_number text,
  notes text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sale_document_files_name_valid check (char_length(btrim(name)) between 2 and 160)
);

create table if not exists public.sale_document_pages (
  id uuid primary key default gen_random_uuid(),
  document_file_id uuid not null references public.sale_document_files(id) on delete cascade,
  storage_path text not null unique,
  sequence_number integer not null,
  capture_source text not null default 'camera' check (capture_source in ('camera','upload')),
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  file_size integer not null check (file_size > 0 and file_size <= 10485760),
  captured_by uuid not null references public.profiles(id) on delete restrict,
  captured_at timestamptz not null default now(),
  unique(document_file_id, sequence_number)
);

create table if not exists public.document_handovers (
  id uuid primary key default gen_random_uuid(),
  handover_number text not null unique,
  sale_id uuid not null references public.sales(id) on delete restrict,
  recipient_type text not null check (recipient_type in ('buyer','representative')),
  recipient_name text not null,
  recipient_cnic text,
  recipient_phone text,
  notes text,
  acknowledgement_text text not null,
  recipient_photo_storage_path text not null,
  signature_storage_path text,
  handed_over_by uuid not null references public.profiles(id) on delete restrict,
  handed_over_at timestamptz not null default now(),
  status text not null default 'completed' check (status in ('completed','voided')),
  voided_by uuid references public.profiles(id) on delete restrict,
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz not null default now(),
  constraint document_handovers_name_valid check (char_length(btrim(recipient_name)) between 2 and 120),
  constraint document_handovers_representative_id check (recipient_type = 'buyer' or nullif(btrim(recipient_cnic), '') is not null)
);

create table if not exists public.document_handover_items (
  id uuid primary key default gen_random_uuid(),
  handover_id uuid not null references public.document_handovers(id) on delete restrict,
  document_file_id uuid not null references public.sale_document_files(id) on delete restrict,
  file_name_snapshot text not null,
  created_at timestamptz not null default now(),
  unique(handover_id, document_file_id)
);

create index if not exists sale_document_files_sale_idx on public.sale_document_files(sale_id, created_at);
create index if not exists sale_document_pages_file_idx on public.sale_document_pages(document_file_id, sequence_number);
create index if not exists document_handovers_sale_idx on public.document_handovers(sale_id, handed_over_at desc);
create index if not exists document_handover_items_file_idx on public.document_handover_items(document_file_id);

drop trigger if exists set_updated_at on public.sale_document_files;
create trigger set_updated_at before update on public.sale_document_files
for each row execute function private.set_updated_at();

alter table public.sale_document_files enable row level security;
alter table public.sale_document_pages enable row level security;
alter table public.document_handovers enable row level security;
alter table public.document_handover_items enable row level security;

-- Application mutations are performed by authenticated server actions after
-- role and sale-visibility checks. Direct clients receive read-only access.
drop policy if exists sale_document_files_staff_read on public.sale_document_files;
create policy sale_document_files_staff_read on public.sale_document_files for select to authenticated
using (exists (
  select 1 from public.profiles p join public.sales s on s.id = sale_document_files.sale_id
  where p.id = auth.uid() and p.is_active
    and (p.role in ('developer','admin') or (p.role = 'manager' and s.requested_by = auth.uid()))
));
drop policy if exists sale_document_pages_staff_read on public.sale_document_pages;
create policy sale_document_pages_staff_read on public.sale_document_pages for select to authenticated
using (exists (
  select 1 from public.profiles p
  join public.sale_document_files f on f.id = sale_document_pages.document_file_id
  join public.sales s on s.id = f.sale_id
  where p.id = auth.uid() and p.is_active
    and (p.role in ('developer','admin') or (p.role = 'manager' and s.requested_by = auth.uid()))
));
drop policy if exists document_handovers_staff_read on public.document_handovers;
create policy document_handovers_staff_read on public.document_handovers for select to authenticated
using (exists (
  select 1 from public.profiles p join public.sales s on s.id = document_handovers.sale_id
  where p.id = auth.uid() and p.is_active
    and (p.role in ('developer','admin') or (p.role = 'manager' and s.requested_by = auth.uid()))
));
drop policy if exists document_handover_items_staff_read on public.document_handover_items;
create policy document_handover_items_staff_read on public.document_handover_items for select to authenticated
using (exists (
  select 1 from public.profiles p
  join public.document_handovers h on h.id = document_handover_items.handover_id
  join public.sales s on s.id = h.sale_id
  where p.id = auth.uid() and p.is_active
    and (p.role in ('developer','admin') or (p.role = 'manager' and s.requested_by = auth.uid()))
));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sale-documents', 'sale-documents', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

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
  p_signature_storage_path text,
  p_actor_id uuid
) returns uuid
language plpgsql security definer set search_path = public, pg_temp as $$
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

  select count(distinct id) into v_expected from sale_document_files
  where id = any(p_document_file_ids) and sale_id = p_sale_id and archived_at is null;
  select count(distinct f.id) into v_ready
  from sale_document_files f
  where f.id = any(p_document_file_ids) and f.sale_id = p_sale_id and f.archived_at is null
    and exists (select 1 from sale_document_pages p where p.document_file_id = f.id)
    and not exists (
      select 1 from document_handover_items i join document_handovers h on h.id = i.handover_id
      where i.document_file_id = f.id and h.status = 'completed'
    );
  if v_expected <> array_length(p_document_file_ids, 1) or v_ready <> v_expected then raise exception 'One or more files are unavailable, empty, or already handed over.'; end if;

  v_number := 'OWM-HO-' || lpad(nextval('document_handover_number_seq')::text, 6, '0');
  insert into document_handovers (id, handover_number, sale_id, recipient_type, recipient_name, recipient_cnic, recipient_phone, notes, acknowledgement_text, recipient_photo_storage_path, signature_storage_path, handed_over_by)
  values (v_handover_id, v_number, p_sale_id, p_recipient_type, btrim(p_recipient_name), nullif(btrim(p_recipient_cnic), ''), nullif(btrim(p_recipient_phone), ''), nullif(btrim(p_notes), ''), p_acknowledgement_text, p_recipient_photo_storage_path, nullif(btrim(p_signature_storage_path), ''), p_actor_id);
  insert into document_handover_items (handover_id, document_file_id, file_name_snapshot)
  select v_handover_id, id, name from sale_document_files where id = any(p_document_file_ids);
  return v_handover_id;
end $$;

revoke all on function public.finalize_document_handover(uuid,uuid[],text,text,text,text,text,text,text,text,uuid) from public, anon, authenticated;
grant execute on function public.finalize_document_handover(uuid,uuid[],text,text,text,text,text,text,text,text,uuid) to service_role;
