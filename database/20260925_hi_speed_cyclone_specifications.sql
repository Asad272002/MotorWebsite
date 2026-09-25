begin;
with bike as (select id from public.storefront_bikes where brand_slug='hi-speed' and slug='hi-speed-cyclone'), configs(has_abs) as (values (true),(false)), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','249 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, air-cooled SOHC with internal balancer shaft',1),
('engine-performance','Engine & Performance',0,'Fuel System','Electronic Fuel Injection (EFI)',2),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 19.0 HP @ 8,000 RPM',3),
('engine-performance','Engine & Performance',0,'Torque','18.0 Nm @ 6,000 RPM',4),
('engine-performance','Engine & Performance',0,'Transmission','6-speed manual',5),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 130–140 km/h',6),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','13–14 L; estimated 35–40 km/L',7),
('body-dimensions','Body & Dimensions',1,'Body Type','Chopper / cruiser',0),
('body-dimensions','Body & Dimensions',1,'Weight Layout','Low-slung metal frame with minimal plastic fairings',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','Approx. 140–150 mm',2),
('body-dimensions','Body & Dimensions',1,'Wheel Size','18-inch 110/80 front and 15-inch 140/90 tubeless rear',3),
('key-features','Key Features',2,'Display','Circular digital LCD cluster with speed, odometer, fuel gauge, and engine warning indicators',0),
('key-features','Key Features',2,'Suspension','Hydraulic telescopic front forks and adjustable nitrogen-charged twin rear shocks',1),
('key-features','Key Features',2,'Brakes','VARIANT_BRAKES',2),
('key-features','Key Features',2,'Frame','Reinforced low-slung cradle / diamond cruiser frame',3),
('key-features','Key Features',2,'Lighting','Halogen / LED hybrid setup with halogen headlamp, LED rear light, and LED indicators',4))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,250,configs.has_abs,specs.group_key,specs.group_name,specs.group_order,specs.label,case when specs.label='Brakes' then case when configs.has_abs then 'Front and rear hydraulic disc brakes with dual-channel ABS' else 'Front and rear hydraulic disc brakes' end else specs.value end,specs.sort_order,true from bike cross join configs cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;