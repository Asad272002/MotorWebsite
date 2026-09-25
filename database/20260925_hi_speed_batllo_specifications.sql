begin;
with bike as (select id from public.storefront_bikes where brand_slug='hi-speed' and slug='hi-speed-batllo'), specs(group_key,group_name,group_order,label,value,sort_order) as (values
('engine-performance','Engine & Performance',0,'Displacement','198.8 cc',0),
('engine-performance','Engine & Performance',0,'Engine Type','Single-cylinder, 4-stroke, air-cooled SOHC',1),
('engine-performance','Engine & Performance',0,'Fuel System','Carburetor',2),
('engine-performance','Engine & Performance',0,'Horsepower','Approx. 17.4 HP @ 8,500 RPM',3),
('engine-performance','Engine & Performance',0,'Torque','15.0 Nm @ 6,500 RPM',4),
('engine-performance','Engine & Performance',0,'Transmission','5-speed manual',5),
('engine-performance','Engine & Performance',0,'Top Speed','Approx. 110–130 km/h',6),
('engine-performance','Engine & Performance',0,'Fuel Capacity & Average','13 L; estimated 30–35 km/L',7),
('body-dimensions','Body & Dimensions',1,'Body Type','Naked street bike',0),
('body-dimensions','Body & Dimensions',1,'Curb Weight','Approx. 140 kg',1),
('body-dimensions','Body & Dimensions',1,'Wheelbase','1,380 mm',2),
('body-dimensions','Body & Dimensions',1,'Wheel Size','17-inch alloy wheels with tubeless street tires',3),
('key-features','Key Features',2,'Display','Fully digital LCD instrument console',0),
('key-features','Key Features',2,'Suspension','Hydraulic telescopic front forks and rear mono-shock',1),
('key-features','Key Features',2,'Brakes','Front and rear hydraulic wave disc brakes',2),
('key-features','Key Features',2,'Frame','Lightweight diamond frame with integrated fuel-tank knee pads',3),
('key-features','Key Features',2,'Lighting','Multi-element LED headlamp with integrated DRL accents',4))
insert into public.storefront_bike_specifications(storefront_bike_id,cc,has_abs,group_key,group_name,group_order,label,value,sort_order,is_active)
select bike.id,200,false,specs.group_key,specs.group_name,specs.group_order,specs.label,specs.value,specs.sort_order,true from bike cross join specs
on conflict(storefront_bike_id,cc,has_abs,group_key,label) do update set group_name=excluded.group_name,group_order=excluded.group_order,value=excluded.value,sort_order=excluded.sort_order,is_active=true,updated_at=now();
commit;