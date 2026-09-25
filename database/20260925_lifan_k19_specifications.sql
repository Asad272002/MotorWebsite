begin;
with bike as (select id from public.storefront_bikes where brand_slug='lifan' and slug='lifan-k19'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','198 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, liquid-cooled EFI',1),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 17.0 HP @ 8,000 RPM',2),
('engine-performance','Engine & Performance',0,'Torque','17.0 Nm @ 6,500 RPM',3),
('engine-performance','Engine & Performance',0,'Transmission','6-speed manual',4),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 110–120 km/h',5),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','14 L; estimated 35–40 km/L',6),
('body-dimensions','Body & Dimensions',1,'Body Type','Cruiser',0),
('body-dimensions','Body & Dimensions',1,'Dry / Curb Weight','Approx. 150–160 kg',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','145 mm',2),
('body-dimensions','Body & Dimensions',1,'Dimensions (L × W × H)','2,230 × 910 × 1,090 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','16-inch front and 15-inch rear alloy wheels',4),
('key-features','Key Features',2,'Display','Fuel-tank-mounted multifunction digital LCD instrument cluster',0),
('key-features','Key Features',2,'Suspension','Telescopic front forks and twin adjustable preload rear shock absorbers',1),
('key-features','Key Features',2,'Brakes','Front disc brake and rear drum brake',2),
('key-features','Key Features',2,'Frame','Reinforced diamond-type engine cradle frame',3),
('key-features','Key Features',2,'Lighting','Full LED headlamp with DRL strips, LED turn signals, and tail light',4))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,200,false,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;