begin;
with bike as (select id from public.storefront_bikes where brand_slug='lifan' and slug='lifan-kpt'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','249 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, 4-valve, liquid-cooled EFI',1),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 29.0 HP @ 9,000 RPM',2),
('engine-performance','Engine & Performance',0,'Torque','25.0 Nm @ 7,000 RPM',3),
('engine-performance','Engine & Performance',0,'Transmission','6-speed manual with assist and slipper clutch',4),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 130 km/h',5),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','13 L; estimated 35–40 km/L',6),
('body-dimensions','Body & Dimensions',1,'Body Type','Adventure / dual-sport tourer',0),
('body-dimensions','Body & Dimensions',1,'Dry / Curb Weight','Approx. 160 kg',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','180 mm',2),
('body-dimensions','Body & Dimensions',1,'Dimensions (L × W × H)','2,000 × 785 × 1,255 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','17-inch alloy wheels with 60% road / 40% off-road tires',4),
('key-features','Key Features',2,'Display','Full-color TFT digital instrument display',0),
('key-features','Key Features',2,'Suspension','Inverted front forks and rear three-stage adjustable preload mono-shock',1),
('key-features','Key Features',2,'Brakes','Front and rear hydraulic disc brakes with dual-channel ABS',2),
('key-features','Key Features',2,'Safety Tech','Switchable traction control system (TCS)',3),
('key-features','Key Features',2,'Frame','High-strength diamond engine cradle frame',4),
('key-features','Key Features',2,'Lighting','Full LED headlight assembly with integrated DRLs and hazard lights',5),
('key-features','Key Features',2,'Touring Equipment','Tinted windscreen, integrated crash guards, engine bars, and rear tire splash guard',6))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,250,true,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;