begin;
update public.brands
set logo_path='images/home/Fuego.png', mega_menu_logo_path='images/home/Fuego.png', show_mega_menu_logo=true, updated_at=now()
where slug='fuego';
commit;