begin;
with bike as (select id from public.storefront_bikes where brand_slug='lifan' and slug='lifan-ss-2'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','223 cc (250cc class)',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, air-cooled SOHC with balancer shaft',1),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 17.0–17.5 HP @ 7,500 RPM',2),
('engine-performance','Engine & Performance',0,'Torque','16.5–17.0 Nm @ 6,500 RPM',3),
('engine-performance','Engine & Performance',0,'Transmission','6-speed manual',4),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 110–130 km/h',5),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','13 L; estimated 33–40 km/L',6),
('body-dimensions','Body & Dimensions',1,'Body Type','Street sport / standard hybrid',0),
('body-dimensions','Body & Dimensions',1,'Dry / Curb Weight','Approx. 136 kg dry / 145 kg net',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','160 mm',2),
('body-dimensions','Body & Dimensions',1,'Dimensions (L × W × H)','2,005 × 750 × 1,065 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','17-inch alloy wheels; 100/80-17 front and 120/80-17 rear',4),
('key-features','Key Features',2,'Display','Fully digital LCD instrument cluster',0),
('key-features','Key Features',2,'Suspension','Hydraulic telescopic front forks and rear mono-shock',1),
('key-features','Key Features',2,'Brakes','Hydraulic front disc brake and rear drum brake',2),
('key-features','Key Features',2,'Frame','High-strength steel diamond frame',3),
('key-features','Key Features',2,'Lighting','Diamond-shaped multi-element LED headlamp with LED indicators',4))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,250,false,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;