begin;

with gp1 as (
  select id from public.storefront_bikes
  where brand_slug = 'taro' and slug = 'taro-gp1'
), specs(cc, has_abs, group_key, group_name, group_order, label, value, sort_order) as (
  values
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Displacement', '401 cc', 0),
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Engine Type', '8 Valve Engine', 1),
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Horsepower', 'Approx. 43.0 HP @ 9,000 RPM', 2),
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Torque', '38.5 Nm @ 6,500 RPM', 3),
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Transmission', '6-speed manual', 4),
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Top Speed', 'Approx. 180 km/h', 5),
    (401, true, 'engine-performance', 'Engine & Performance', 0, 'Fuel Capacity & Average', '14 L; estimated 20–30 km/L', 6),
    (401, true, 'body-dimensions', 'Body & Dimensions', 1, 'Body Type', 'Sports bike', 0),
    (401, true, 'body-dimensions', 'Body & Dimensions', 1, 'Dry Weight', 'Approx. 190 kg', 1),
    (401, true, 'body-dimensions', 'Body & Dimensions', 1, 'Ground Clearance', '150 mm', 2),
    (401, true, 'body-dimensions', 'Body & Dimensions', 1, 'Dimensions (L × W × H)', '2,060 × 712 × 1,155 mm', 3),
    (401, true, 'body-dimensions', 'Body & Dimensions', 1, 'Wheel Size', '17-inch', 4),
    (401, true, 'key-features', 'Key Features', 2, 'Display', 'Color TFT digital instrument cluster with gear position, fuel level, temperature, and voltage', 0),
    (401, true, 'key-features', 'Key Features', 2, 'Suspension', 'Inverted front forks and rear mono-shock', 1),
    (401, true, 'key-features', 'Key Features', 2, 'Brakes', 'Front and rear disc brakes with ABS', 2),
    (401, true, 'key-features', 'Key Features', 2, 'Frame', 'Trellis / backbone style frame', 3),
    (401, true, 'key-features', 'Key Features', 2, 'Lighting', 'LED setup', 4),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Displacement', 'Approx. 272 cc (300cc class)', 0),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Engine Type', 'Single-cylinder, 4-stroke, 4-valve EFI, liquid-cooled', 1),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Horsepower', 'Approx. 26.0 HP @ 9,000 RPM', 2),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Torque', '24.0 Nm @ 7,000 RPM', 3),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Transmission', '6-speed manual', 4),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Top Speed', 'Approx. 150 km/h', 5),
    (300, false, 'engine-performance', 'Engine & Performance', 0, 'Fuel Capacity & Average', '13.5–14 L; estimated 30–35 km/L', 6),
    (300, false, 'body-dimensions', 'Body & Dimensions', 1, 'Body Type', 'Sports bike', 0),
    (300, false, 'body-dimensions', 'Body & Dimensions', 1, 'Dry Weight', 'Approx. 165–170 kg', 1),
    (300, false, 'body-dimensions', 'Body & Dimensions', 1, 'Ground Clearance', '150 mm', 2),
    (300, false, 'body-dimensions', 'Body & Dimensions', 1, 'Dimensions (L × W × H)', '2,050 × 720 × 1,155 mm', 3),
    (300, false, 'body-dimensions', 'Body & Dimensions', 1, 'Wheel Size', '17-inch', 4),
    (300, false, 'key-features', 'Key Features', 2, 'Display', 'Color TFT digital instrument cluster with gear position, fuel level, temperature, and voltage', 0),
    (300, false, 'key-features', 'Key Features', 2, 'Suspension', 'Inverted front forks and rear adjustable mono-shock', 1),
    (300, false, 'key-features', 'Key Features', 2, 'Brakes', 'Front and rear disc brakes with CBS', 2),
    (300, false, 'key-features', 'Key Features', 2, 'Frame', 'Trellis / backbone style frame', 3),
    (300, false, 'key-features', 'Key Features', 2, 'Lighting', 'LED setup', 4)
)
insert into public.storefront_bike_specifications (
  storefront_bike_id, cc, has_abs, group_key, group_name,
  group_order, label, value, sort_order, is_active
)
select gp1.id, specs.cc, specs.has_abs, specs.group_key, specs.group_name,
  specs.group_order, specs.label, specs.value, specs.sort_order, true
from gp1 cross join specs
on conflict (storefront_bike_id, cc, has_abs, group_key, label) do update set
  group_name = excluded.group_name,
  group_order = excluded.group_order,
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;