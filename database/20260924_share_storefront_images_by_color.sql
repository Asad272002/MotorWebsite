begin;

create table if not exists public.storefront_bike_colors (
  id uuid primary key default gen_random_uuid(),
  storefront_bike_id uuid not null references public.storefront_bikes(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  hex text null check (hex is null or hex ~ '^#[0-9A-Fa-f]{6}$'),
  is_active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storefront_bike_id, id),
  unique (storefront_bike_id, slug)
);

create index if not exists storefront_bike_colors_public_idx
  on public.storefront_bike_colors (storefront_bike_id, is_active, display_order);

create trigger set_storefront_bike_colors_updated_at
before update on public.storefront_bike_colors
for each row execute function private.set_updated_at();

alter table public.storefront_bike_colors enable row level security;

create policy "Public can read active storefront bike colors"
on public.storefront_bike_colors for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.storefront_bikes bike
    where bike.id = storefront_bike_id and bike.is_published
  )
);

create policy "Staff can manage storefront bike colors"
on public.storefront_bike_colors for all to authenticated
using (
  exists (
    select 1 from public.profiles profile
    where profile.id = auth.uid() and profile.is_active
      and profile.role in ('developer', 'admin')
  )
)
with check (
  exists (
    select 1 from public.profiles profile
    where profile.id = auth.uid() and profile.is_active
      and profile.role in ('developer', 'admin')
  )
);

insert into public.storefront_bike_colors (
  storefront_bike_id, name, slug, hex, is_active, display_order
)
select storefront_bike_id, min(color_name), color_slug, min(color_hex),
  bool_or(is_active), min(display_order)
from public.storefront_bike_variants
group by storefront_bike_id, color_slug
on conflict (storefront_bike_id, slug) do update set
  name = excluded.name,
  hex = coalesce(public.storefront_bike_colors.hex, excluded.hex),
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  updated_at = now();

alter table public.storefront_bike_variants add column if not exists color_id uuid;

update public.storefront_bike_variants variant
set color_id = color.id
from public.storefront_bike_colors color
where color.storefront_bike_id = variant.storefront_bike_id
  and color.slug = variant.color_slug
  and variant.color_id is distinct from color.id;

alter table public.storefront_bike_variants alter column color_id set not null;
alter table public.storefront_bike_variants drop constraint if exists storefront_bike_variants_color_id_fkey;
alter table public.storefront_bike_variants
  add constraint storefront_bike_variants_color_id_fkey
  foreign key (storefront_bike_id, color_id)
  references public.storefront_bike_colors(storefront_bike_id, id)
  on delete restrict;

create index if not exists storefront_bike_variants_color_idx
  on public.storefront_bike_variants (color_id);

alter table public.storefront_bike_images add column if not exists color_id uuid;
alter table public.storefront_bike_images drop constraint if exists storefront_bike_images_color_id_fkey;
alter table public.storefront_bike_images
  add constraint storefront_bike_images_color_id_fkey
  foreign key (storefront_bike_id, color_id)
  references public.storefront_bike_colors(storefront_bike_id, id)
  on delete cascade;

create index if not exists storefront_bike_images_color_idx
  on public.storefront_bike_images (color_id, sort_order);
drop index if exists public.storefront_bike_images_one_shared_primary_idx;
create unique index storefront_bike_images_one_shared_primary_idx
  on public.storefront_bike_images (storefront_bike_id)
  where is_primary and variant_id is null and color_id is null;

create unique index if not exists storefront_bike_images_one_color_primary_idx
  on public.storefront_bike_images (color_id)
  where is_primary and color_id is not null and variant_id is null;

drop policy if exists "Public can read storefront bike images" on public.storefront_bike_images;
create policy "Public can read storefront bike images"
on public.storefront_bike_images for select to anon, authenticated
using (
  exists (
    select 1 from public.storefront_bikes bike
    where bike.id = storefront_bike_id and bike.is_published
  )
  and (
    color_id is null or exists (
      select 1 from public.storefront_bike_colors color
      where color.id = color_id and color.is_active
    )
  )
  and (
    variant_id is null or exists (
      select 1 from public.storefront_bike_variants variant
      where variant.id = variant_id and variant.is_active
    )
  )
);

commit;