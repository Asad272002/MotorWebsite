begin;

create table if not exists public.storefront_bike_variants (
  id uuid primary key default gen_random_uuid(),
  storefront_bike_id uuid not null references public.storefront_bikes(id) on delete cascade,
  cc integer not null check (cc > 0),
  has_abs boolean not null default false,
  price_pkr numeric(12, 2) not null check (price_pkr >= 0),
  color_name text not null check (length(trim(color_name)) > 0),
  color_slug text not null check (color_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  color_hex text null check (color_hex is null or color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  specifications text[] not null default '{}',
  is_default boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0 check (display_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storefront_bike_id, id),
  unique (storefront_bike_id, cc, has_abs, color_slug)
);

create table if not exists public.storefront_bike_images (
  id uuid primary key default gen_random_uuid(),
  storefront_bike_id uuid not null references public.storefront_bikes(id) on delete cascade,
  variant_id uuid null references public.storefront_bike_variants(id) on delete cascade,
  storage_path text not null check (length(trim(storage_path)) > 0),
  alt_text text not null check (length(trim(alt_text)) >= 3),
  image_type text not null default 'gallery'
    check (image_type in ('gallery', 'hero', 'thumbnail', 'color', 'overview', 'open_graph')),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storefront_bike_id, storage_path),
  constraint storefront_bike_images_variant_belongs_to_bike
    foreign key (storefront_bike_id, variant_id)
    references public.storefront_bike_variants(storefront_bike_id, id)
    on delete cascade
);

create index if not exists storefront_bike_variants_public_idx
  on public.storefront_bike_variants (storefront_bike_id, is_active, display_order);
create index if not exists storefront_bike_images_bike_idx
  on public.storefront_bike_images (storefront_bike_id, variant_id, sort_order);
create unique index if not exists storefront_bike_variants_one_default_idx
  on public.storefront_bike_variants (storefront_bike_id)
  where is_default and is_active;
create unique index if not exists storefront_bike_images_one_variant_primary_idx
  on public.storefront_bike_images (variant_id)
  where is_primary and variant_id is not null;
create unique index if not exists storefront_bike_images_one_shared_primary_idx
  on public.storefront_bike_images (storefront_bike_id)
  where is_primary and variant_id is null;

drop trigger if exists set_storefront_bike_variants_updated_at on public.storefront_bike_variants;
create trigger set_storefront_bike_variants_updated_at
before update on public.storefront_bike_variants
for each row execute function private.set_updated_at();

drop trigger if exists set_storefront_bike_images_updated_at on public.storefront_bike_images;
create trigger set_storefront_bike_images_updated_at
before update on public.storefront_bike_images
for each row execute function private.set_updated_at();

alter table public.storefront_bike_variants enable row level security;
alter table public.storefront_bike_images enable row level security;

drop policy if exists "Public can read active storefront bike variants" on public.storefront_bike_variants;
create policy "Public can read active storefront bike variants"
on public.storefront_bike_variants for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.storefront_bikes bike
    where bike.id = storefront_bike_id and bike.is_published
  )
);

drop policy if exists "Staff can manage storefront bike variants" on public.storefront_bike_variants;
create policy "Staff can manage storefront bike variants"
on public.storefront_bike_variants for all to authenticated
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

drop policy if exists "Public can read storefront bike images" on public.storefront_bike_images;
create policy "Public can read storefront bike images"
on public.storefront_bike_images for select to anon, authenticated
using (
  exists (
    select 1 from public.storefront_bikes bike
    where bike.id = storefront_bike_id and bike.is_published
  )
  and (
    variant_id is null or exists (
      select 1 from public.storefront_bike_variants variant
      where variant.id = variant_id and variant.is_active
    )
  )
);

drop policy if exists "Staff can manage storefront bike images" on public.storefront_bike_images;
create policy "Staff can manage storefront bike images"
on public.storefront_bike_images for all to authenticated
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

with expanded as (
  select
    bike.id as storefront_bike_id,
    (configuration.ordinality - 1)::integer as configuration_order,
    (color.ordinality - 1)::integer as color_order,
    (configuration.value ->> 'cc')::integer as cc,
    coalesce((configuration.value ->> 'abs')::boolean, false) as has_abs,
    (configuration.value ->> 'price_pkr')::numeric as price_pkr,
    color.value as color_name,
    trim(both '-' from regexp_replace(lower(color.value), '[^a-z0-9]+', '-', 'g')) as color_slug,
    array(
      select jsonb_array_elements_text(coalesce(configuration.value -> 'specifications', '[]'::jsonb))
    ) as specifications,
    row_number() over (
      partition by bike.id
      order by configuration.ordinality, color.ordinality
    ) = 1 as is_default
  from public.storefront_bikes bike
  cross join lateral jsonb_array_elements(bike.variants) with ordinality as configuration(value, ordinality)
  cross join lateral jsonb_array_elements_text(
    coalesce(configuration.value -> 'available_colors', '[]'::jsonb)
  ) with ordinality as color(value, ordinality)
)
insert into public.storefront_bike_variants (
  storefront_bike_id, cc, has_abs, price_pkr, color_name, color_slug,
  specifications, is_default, is_active, display_order
)
select
  storefront_bike_id, cc, has_abs, price_pkr, color_name, color_slug,
  specifications, is_default, true,
  configuration_order * 100 + color_order
from expanded
where color_slug <> ''
on conflict (storefront_bike_id, cc, has_abs, color_slug) do update set
  price_pkr = excluded.price_pkr,
  color_name = excluded.color_name,
  specifications = excluded.specifications,
  display_order = excluded.display_order,
  updated_at = now();

insert into public.storefront_bike_images (
  storefront_bike_id, variant_id, storage_path, alt_text, image_type, sort_order, is_primary
)
select id, null, primary_image_path, model_name || ' motorcycle', 'hero', 0, true
from public.storefront_bikes
where nullif(trim(primary_image_path), '') is not null
on conflict (storefront_bike_id, storage_path) do nothing;

insert into public.storefront_bike_images (
  storefront_bike_id, variant_id, storage_path, alt_text, image_type, sort_order, is_primary
)
select bike.id, null, gallery.value, bike.model_name || ' view ' || gallery.ordinality,
  'gallery', gallery.ordinality::integer, false
from public.storefront_bikes bike
cross join lateral unnest(bike.gallery_image_paths) with ordinality as gallery(value, ordinality)
where nullif(trim(gallery.value), '') is not null
on conflict (storefront_bike_id, storage_path) do nothing;

commit;
