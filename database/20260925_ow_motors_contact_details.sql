begin;
update public.site_settings
set setting_value = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(setting_value::jsonb, '{phone}', to_jsonb('0322 2033399 (Primary) · 0336 0415607 (Secondary)'::text), true),
          '{location}', to_jsonb('Shop 61-A, Main Maulana Shaukat Ali Road, Township, Lahore 54000'::text), true
        ),
        '{openingHours}', to_jsonb('Monday–Saturday: 11:00 AM–8:00 PM · Sunday: Closed'::text), true
      ),
      '{mapMessage}', to_jsonb('Visit the OW Motors showroom in Township, Lahore'::text), true
    ),
    updated_at = now()
where setting_key = 'storefront.home.contact_preview';
commit;