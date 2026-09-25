begin;

with gp2 as (
  select id from public.storefront_bikes
  where brand_slug = 'taro' and slug = 'taro-gp2'
), specs(group_key, group_name, group_order, label, value, sort_order) as (
  values
    ('engine-performance', 'Engine & Performance', 0, 'Displacement', '198 cc', 0),
    ('engine-performance', 'Engine & Performance', 0, 'Engine Type', 'Single-cylinder, 4-stroke, liquid-cooled OHC with EFI', 1),
    ('engine-performance', 'Engine & Performance', 0, 'Horsepower', 'Approx. 14.0–17.0 HP @ 7,500–8,000 RPM', 2),
    ('engine-performance', 'Engine & Performance', 0, 'Torque', '11.5–17.0 Nm @ 6,000 RPM', 3),
    ('engine-performance', 'Engine & Performance', 0, 'Transmission', '6-speed manual', 4),
    ('engine-performance', 'Engine & Performance', 0, 'Top Speed', 'Approx. 140 km/h', 5),
    ('engine-performance', 'Engine & Performance', 0, 'Fuel Capacity & Average', '10–12 L; estimated 30–35 km/L', 6),
    ('body-dimensions', 'Body & Dimensions', 1, 'Body Type', 'Sports bike', 0),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dry Weight', 'Approx. 155 kg', 1),
    ('body-dimensions', 'Body & Dimensions', 1, 'Ground Clearance', '130 mm', 2),
    ('body-dimensions', 'Body & Dimensions', 1, 'Dimensions (L × W × H)', '2,060 × 712 × 1,155 mm', 3),
    ('body-dimensions', 'Body & Dimensions', 1, 'Wheel Size', '16-inch or 17-inch, depending on variant', 4),
    ('key-features', 'Key Features', 2, 'Display', 'Fully digital LCD / TFT instrument cluster', 0),
    ('key-features', 'Key Features', 2, 'Suspension', 'Inverted front forks and rear mono-shock', 1),
    ('key-features', 'Key Features', 2, 'Brakes', 'Front and rear disc brakes', 2),
    ('key-features', 'Key Features', 2, 'Frame', 'Diamond frame', 3),
    ('key-features', 'Key Features', 2, 'Lighting', 'Full LED setup with LED headlamp, DRLs, and tail lamp', 4)
)
insert into public.storefront_bike_specifications (
  storefront_bike_id, cc, has_abs, group_key, group_name,
  group_order, label, value, sort_order, is_active
)
select gp2.id, 200, false, specs.group_key, specs.group_name,
  specs.group_order, specs.label, specs.value, specs.sort_order, true
from gp2 cross join specs
on conflict (storefront_bike_id, cc, has_abs, group_key, label) do update set
  group_name = excluded.group_name,
  group_order = excluded.group_order,
  value = excluded.value,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;