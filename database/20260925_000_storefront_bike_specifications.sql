begin;

create table if not exists public.storefront_bike_specifications (
  id uuid primary key default gen_random_uuid(),
  storefront_bike_id uuid not null references public.storefront_bikes(id) on delete cascade,
  cc integer null check (cc is null or cc > 0),
  has_abs boolean null,
  group_key text not null check (group_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  group_name text not null check (length(trim(group_name)) > 0),
  group_order integer not null default 0 check (group_order >= 0),
  label text not null check (length(trim(label)) > 0),
  value text not null check (length(trim(value)) > 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storefront_bike_id, cc, has_abs, group_key, label)
);

create index if not exists storefront_bike_specifications_lookup_idx
  on public.storefront_bike_specifications
  (storefront_bike_id, cc, has_abs, is_active, group_order, sort_order);

drop trigger if exists set_storefront_bike_specifications_updated_at on public.storefront_bike_specifications;
create trigger set_storefront_bike_specifications_updated_at
before update on public.storefront_bike_specifications
for each row execute function private.set_updated_at();

alter table public.storefront_bike_specifications enable row level security;

drop policy if exists "Public can read storefront bike specifications" on public.storefront_bike_specifications;
create policy "Public can read storefront bike specifications"
on public.storefront_bike_specifications for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.storefront_bikes bike
    where bike.id = storefront_bike_id and bike.is_published
  )
);

drop policy if exists "Staff can manage storefront bike specifications" on public.storefront_bike_specifications;
create policy "Staff can manage storefront bike specifications"
on public.storefront_bike_specifications for all to authenticated
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

with tekken as (
  select id from public.storefront_bikes
  where brand_slug = 'fuego' and slug = 'tekken'
), specs(group_key, group_name, group_order, label, value, sort_order) as (
  values
    ('engine-performance', 'Engine & Performance', 0, 'Engine Type', 'Single Cylinder, 4-Stroke', 0),
    ('engine-performance', 'Engine & Performance', 0, 'Displacement', '250 cc', 1),
    ('engine-performance', 'Engine & Performance', 0, 'Cooling System', 'Oil Cooled', 2),
    ('engine-performance', 'Engine & Performance', 0, 'Transmission', '6-Speed', 3),
    ('engine-performance', 'Engine & Performance', 0, 'Max Power', '12 kW @ 7,500 RPM', 4),
    ('engine-performance', 'Engine & Performance', 0, 'Max Power (HP)', 'Approx. 17.5 HP', 5),
    ('engine-performance', 'Engine & Performance', 0, 'Max Torque', '17 Nm @ 6,000 RPM', 6),
    ('engine-performance', 'Engine & Performance', 0, 'Fuel Capacity', '15.5 L', 7),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Weight', '139 kg', 0),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Wheelbase', '1,380 mm', 1),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Length', '2,060 mm', 2),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Width', '820 mm', 3),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Seat Height', '830 mm', 4),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Ground Clearance', '240 mm', 5),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Front Tire', '110/90-17', 6),
    ('dimensions-chassis', 'Dimensions & Chassis', 1, 'Rear Tire', '130/80-17', 7)
)
insert into public.storefront_bike_specifications (
  storefront_bike_id, cc, has_abs, group_key, group_name,
  group_order, label, value, sort_order, is_active
)
select tekken.id, 250, false, specs.group_key, specs.group_name,
  specs.group_order, specs.label, specs.value, specs.sort_order, true
from tekken cross join specs
on conflict (storefront_bike_id, cc, has_abs, group_key, label) do update set
  group_name = excluded.group_name,
  group_order = excluded.group_order,
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;