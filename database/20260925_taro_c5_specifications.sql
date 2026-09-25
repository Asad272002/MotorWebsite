begin;

with c5 as (
  select id from public.storefront_bikes
  where brand_slug = 'taro' and slug = 'taro-c5'
), specs(group_key, group_name, group_order, label, value, sort_order) as (
  values
    ('engine-performance', 'Engine & Performance', 0, 'Displacement', '400.9 cc', 0),
    ('engine-performance', 'Engine & Performance', 0, 'Engine Type', '8-valve parallel-twin, 4-stroke EFI, water-cooled engine', 1),
    ('engine-performance', 'Engine & Performance', 0, 'Horsepower', 'Approx. 43.0 HP', 2),
    ('engine-performance', 'Engine & Performance', 0, 'Torque', '41.0 Nm', 3),
    ('engine-performance', 'Engine & Performance', 0, 'Transmission', '6-speed manual', 4),
    ('engine-performance', 'Engine & Performance', 0, 'Top Speed', 'Approx. 160 km/h', 5),
    ('engine-performance', 'Engine & Performance', 0, 'Fuel Capacity & Average', '14.5 L; estimated 35–40 km/L', 6),
    ('body-dimensions', 'Body & Dimensions', 1, 'Body Type', 'Neo-retro scrambler / naked cruiser hybrid', 0),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dry / Curb Weight', 'Approx. 170 kg dry / 183 kg with fuel', 1),
    ('body-dimensions', 'Body & Dimensions', 1, 'Ground Clearance', '160 mm', 2),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dimensions (L × W × H)', '2,070 × 818 × 1,130 mm', 3),
    ('body-dimensions', 'Body & Dimensions', 1, 'Wheel Size', '17-inch tubeless tires', 4),
    ('key-features', 'Key Features', 2, 'Display', '5-inch color TFT digital instrument display', 0),
    ('key-features', 'Key Features', 2, 'Suspension', 'Inverted front forks and rear adjustable preload mono-shock', 1),
    ('key-features', 'Key Features', 2, 'Brakes', 'Dual front discs and single rear disc with dual-channel ABS', 2),
    ('key-features', 'Key Features', 2, 'Frame', 'Reinforced trellis / backbone structure with integrated crash bars', 3),
    ('key-features', 'Key Features', 2, 'Lighting', 'Retro-style circular LED lens headlamp with three LED projectors, flowing indicators, and DRLs', 4)
)
insert into public.storefront_bike_specifications (
  storefront_bike_id, cc, has_abs, group_key, group_name,
  group_order, label, value, sort_order, is_active
)
select c5.id, 400, true, specs.group_key, specs.group_name,
  specs.group_order, specs.label, specs.value, specs.sort_order, true
from c5 cross join specs
on conflict (storefront_bike_id, cc, has_abs, group_key, label) do update set
  group_name = excluded.group_name,
  group_order = excluded.group_order,
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;