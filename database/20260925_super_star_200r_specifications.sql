begin;
with bike as (select id from public.storefront_bikes where brand_slug='super-star' and slug='super-star'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','200 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, air-cooled with internal balancer shaft',1),
('engine-performance','Engine & Performance',0,'Fuel System','Carburetor',2),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 17.0–21.0 HP @ 8,000 RPM',3),
('engine-performance','Engine & Performance',0,'Torque','16.0 Nm @ 6,500 RPM',4),
('engine-performance','Engine & Performance',0,'Transmission','5-speed manual constant mesh',5),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 120–130 km/h',6),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','12–13 L; estimated 35–40 km/L',7),
('body-dimensions','Body & Dimensions',1,'Body Type','Naked street bike',0),
('body-dimensions','Body & Dimensions',1,'Dry Weight','Approx. 140 kg',1),
('body-dimensions','Body & Dimensions',1,'Ground Clearance','150 mm',2),
('body-dimensions','Body & Dimensions',1,'Dimensions (L × W × H)','1,900 × 700 × 1,150 mm',3),
('body-dimensions','Body & Dimensions',1,'Wheel Size','17-inch alloy wheels; 110/70 front and 140/70 rear tubeless tires',4),
('key-features','Key Features',2,'Display','Digital LCD instrument display with speedometer, odometer, fuel gauge, and gear indicator',0),
('key-features','Key Features',2,'Suspension','Hydraulic telescopic front forks and rear mono-shock',1),
('key-features','Key Features',2,'Brakes','Front and rear hydraulic wave disc brakes',2),
('key-features','Key Features',2,'Frame','Lightweight diamond-cradle steel frame',3))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,200,false,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;