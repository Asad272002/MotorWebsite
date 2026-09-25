begin;

with c6 as (
  select id from public.storefront_bikes
  where brand_slug = 'taro' and slug = 'taro-c6'
), specs(group_key, group_name, group_order, label, value, sort_order) as (
  values
    ('engine-performance', 'Engine & Performance', 0, 'Displacement', '249.2 cc', 0),
    ('engine-performance', 'Engine & Performance', 0, 'Engine Type', 'Single-cylinder, 4-stroke, 4-valve EFI, water/oil-cooled', 1),
    ('engine-performance', 'Engine & Performance', 0, 'Horsepower', 'Approx. 25.0 HP @ 9,000 RPM', 2),
    ('engine-performance', 'Engine & Performance', 0, 'Torque', '21.0 Nm @ 7,000 RPM', 3),
    ('engine-performance', 'Engine & Performance', 0, 'Transmission', '6-speed manual', 4),
    ('engine-performance', 'Engine & Performance', 0, 'Top Speed', 'Approx. 140–160 km/h', 5),
    ('engine-performance', 'Engine & Performance', 0, 'Fuel Capacity & Average', '14.5 L; estimated 30–35 km/L', 6),
    ('body-dimensions', 'Body & Dimensions', 1, 'Body Type', 'Naked street bike / sports bike hybrid', 0),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dry Weight', 'Approx. 170 kg', 1),
    ('body-dimensions', 'Body & Dimensions', 1, 'Ground Clearance', '160 mm', 2),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dimensions (L × W × H)', '2,070 × 770 × 1,173 mm', 3),
    ('body-dimensions', 'Body & Dimensions', 1, 'Wheel Size', '17-inch; 110/70 front and 140/70 rear tires', 4),
    ('key-features', 'Key Features', 2, 'Display', 'Fully digital LCD / TFT instrument cluster with clock, gear indicator, and trip details', 0),
    ('key-features', 'Key Features', 2, 'Suspension', 'Inverted front forks and rear adjustable preload mono-shock', 1),
    ('key-features', 'Key Features', 2, 'Brakes', 'Dual front wave discs and rear wave disc', 2),
    ('key-features', 'Key Features', 2, 'Frame', 'Diamond / trellis hybrid frame', 3),
    ('key-features', 'Key Features', 2, 'Lighting', 'Full LED setup with signature DRL light bars', 4)
)
insert into public.storefront_bike_specifications (
  storefront_bike_id, cc, has_abs, group_key, group_name,
  group_order, label, value, sort_order, is_active
)
select c6.id, 250, false, specs.group_key, specs.group_name,
  specs.group_order, specs.label, specs.value, specs.sort_order, true
from c6 cross join specs
on conflict (storefront_bike_id, cc, has_abs, group_key, label) do update set
  group_name = excluded.group_name,
  group_order = excluded.group_order,
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;