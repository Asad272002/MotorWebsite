begin;

with kpm as (
  select id from public.storefront_bikes
  where brand_slug = 'lifan' and slug = 'lifan-kpm'
), specs(group_key, group_name, group_order, label, value, sort_order) as (
  values
    ('engine-performance', 'Engine & Performance', 0, 'Displacement', '198 cc', 0),
    ('engine-performance', 'Engine & Performance', 0, 'Engine Type', 'Single-cylinder, 4-stroke, liquid-cooled NBF II with EFI', 1),
    ('engine-performance', 'Engine & Performance', 0, 'Horsepower', 'Approx. 17.0 HP @ 8,000 RPM', 2),
    ('engine-performance', 'Engine & Performance', 0, 'Torque', '16.9 Nm @ 6,500 RPM', 3),
    ('engine-performance', 'Engine & Performance', 0, 'Transmission', '6-speed manual', 4),
    ('engine-performance', 'Engine & Performance', 0, 'Top Speed', 'Approx. 120–130 km/h', 5),
    ('engine-performance', 'Engine & Performance', 0, 'Fuel Capacity & Average', '13 L; estimated 35–43 km/L', 6),
    ('body-dimensions', 'Body & Dimensions', 1, 'Body Type', 'Cafe racer / modern retro sports bike', 0),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dry / Curb Weight', 'Approx. 150 kg', 1),
    ('body-dimensions', 'Body & Dimensions', 1, 'Ground Clearance', '160 mm', 2),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dimensions (L × W × H)', '2,025 × 760 × 1,080 mm', 3),
    ('body-dimensions', 'Body & Dimensions', 1, 'Wheel Size', '17-inch alloy wheels with tubeless street tires', 4),
    ('key-features', 'Key Features', 2, 'Display', 'Circular digital instrument cluster with selectable backlighting, speedometer, gear indicator, fuel gauge, and clock', 0),
    ('key-features', 'Key Features', 2, 'Suspension', 'Inverted front forks and rear mono-shock', 1),
    ('key-features', 'Key Features', 2, 'Brakes', 'Front and rear disc brakes with ABS and dual-piston front caliper', 2),
    ('key-features', 'Key Features', 2, 'Frame', 'Steel cradle / diamond frame', 3),
    ('key-features', 'Key Features', 2, 'Lighting', 'Full LED round headlamp with DRL ring, LED tail lamp, and indicators', 4),
    ('key-features', 'Key Features', 2, 'USB Charging', 'Built-in smartphone charging port near the instrument cluster', 5)
)
insert into public.storefront_bike_specifications (
  storefront_bike_id, cc, has_abs, group_key, group_name,
  group_order, label, value, sort_order, is_active
)
select kpm.id, 200, true, specs.group_key, specs.group_name,
  specs.group_order, specs.label, specs.value, specs.sort_order, true
from kpm cross join specs
on conflict (storefront_bike_id, cc, has_abs, group_key, label) do update set
  group_name = excluded.group_name,
  group_order = excluded.group_order,
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;