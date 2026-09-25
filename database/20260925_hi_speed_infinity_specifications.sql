begin;
with bike as (select id from public.storefront_bikes where brand_slug='hi-speed' and slug='hi-speed-infinity'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','149.5 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, air-cooled OHV with internal balancer shaft',1),
('engine-performance','Engine & Performance',0,'Fuel System','Carburetor with dual-spark ignition',2),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 11.4 HP @ 8,000 RPM',3),
('engine-performance','Engine & Performance',0,'Torque','10.0 Nm @ 7,500 RPM',4),
('engine-performance','Engine & Performance',0,'Transmission','5-speed manual constant mesh',5),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 110 km/h',6),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','15 L; estimated 30–35 km/L',7),
('body-dimensions','Body & Dimensions',1,'Body Type','Cafe racer / vintage retro',0),
('body-dimensions','Body & Dimensions',1,'Dry / Curb Weight','Approx. 120 kg',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','132 mm',2),
('body-dimensions','Body & Dimensions',1,'Dimensions (L × W × H)','1,920 × 770 × 1,080 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','17-inch alloy wheels; 90/70-17 front and 120/70-17 rear',4),
('key-features','Key Features',2,'Display','Circular analog speedometer and tachometer with fuel gauge and gear indicator',0),
('key-features','Key Features',2,'Suspension','Telescopic hydraulic front forks and adjustable gas-filled twin rear shocks',1),
('key-features','Key Features',2,'Brakes','Hydraulic front disc brake and rear mechanical drum brake',2),
('key-features','Key Features',2,'Frame','Low-profile frame with low clip-on handlebars',3),
('key-features','Key Features',2,'Lighting','Round halogen headlamp with bullet-style indicators and LED rear light strip',4),
('key-features','Key Features',2,'Starting System','Electronic self-start',5))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,150,false,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;