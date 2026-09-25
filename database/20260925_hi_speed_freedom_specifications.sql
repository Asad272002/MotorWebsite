begin;
with bike as (select id from public.storefront_bikes where brand_slug='hi-speed' and slug='hi-speed-freedom'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','198.8 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, air-cooled SOHC with internal balancer shaft',1),
('engine-performance','Engine & Performance',0,'Fuel System','Carburetor',2),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 14.5 HP (10.8 kW) @ 7,500 RPM',3),
('engine-performance','Engine & Performance',0,'Torque','15.0 Nm @ 6,000 RPM',4),
('engine-performance','Engine & Performance',0,'Transmission','5-speed manual constant mesh',5),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 100–110 km/h',6),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','13.5 L; estimated 20–30 km/L',7),
('body-dimensions','Body & Dimensions',1,'Body Type','Chopper / cruiser',0),
('body-dimensions','Body & Dimensions',1,'Dry Weight','Approx. 140–145 kg',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','140 mm',2),
('body-dimensions','Body & Dimensions',1,'Dimensions (L × W × H)','2,100 × 875 × 1,165 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','18-inch 90/90 front and 15-inch 130/90 rear alloy wheels',4),
('key-features','Key Features',2,'Display','Side-mounted round digital instrument console with odometer, tachometer, fuel gauge, and gear indicator',0),
('key-features','Key Features',2,'Suspension','Telescopic hydraulic front forks and adjustable twin rear spring shocks',1),
('key-features','Key Features',2,'Brakes','Hydraulic front disc brake and rear mechanical drum brake',2),
('key-features','Key Features',2,'Frame','Reinforced low-slung cradle cruiser frame with engine guard bars',3),
('key-features','Key Features',2,'Lighting','Multi-element LED projector headlamp with circular DRLs, LED rear light strip, and bullet-style indicators',4))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,200,false,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;