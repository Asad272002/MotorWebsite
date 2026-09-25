begin;
with bike as (select id from public.storefront_bikes where brand_slug='lifan' and slug='lifan-v16s'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','249 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','V-twin cylinder, 4-stroke, water-cooled SOHC EFI',1),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 19.4–20.0 HP @ 8,000 RPM',2),
('engine-performance','Engine & Performance',0,'Torque','18.5 Nm @ 6,500 RPM',3),
('engine-performance','Engine & Performance',0,'Transmission','6-speed manual',4),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 130 km/h',5),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','14 L; estimated 30–34 km/L',6),
('body-dimensions','Body & Dimensions',1,'Body Type','Sport cruiser / chopper',0),
('body-dimensions','Body & Dimensions',1,'Dry / Curb Weight','Approx. 185 kg',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','140–150 mm',2),
('body-dimensions','Body & Dimensions',1,'Wheelbase','1,540 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','Staggered alloy cruiser wheels',4),
('key-features','Key Features',2,'Display','Compact multifunction negative-display digital instrument cluster',0),
('key-features','Key Features',2,'Suspension','Telescopic front forks and twin adjustable rear spring shock absorbers',1),
('key-features','Key Features',2,'Brakes','Front and rear wave disc brakes with dual-channel ABS',2),
('key-features','Key Features',2,'Frame','Reinforced double-cradle steel cruiser frame',3),
('key-features','Key Features',2,'Lighting','Projector-style LED headlamp with side DRL accents and integrated LED turn signals',4),
('key-features','Key Features',2,'Exhaust','Dual straight chrome-cut side exhaust pipes',5))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,250,true,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;