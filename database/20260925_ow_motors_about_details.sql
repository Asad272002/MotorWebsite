begin;
update public.site_settings
set setting_value = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(setting_value::jsonb, '{description}', to_jsonb('Since 2016, OW Motors has brought Taro, Lifan, Hi-Speed, Super Star, and Fuego together in one rider-focused motorcycle experience.'::text), true),
            '{points,0}', to_jsonb('Motorcycles from five distinct brands'::text), true
          ),
          '{primaryStatValue}', to_jsonb('10+'::text), true
        ),
        '{primaryStatLabel}', to_jsonb('Years serving riders'::text), true
      ),
      '{secondaryStatValue}', to_jsonb('5'::text), true
    ),
    updated_at = now()
where setting_key = 'storefront.home.about_preview';
commit;