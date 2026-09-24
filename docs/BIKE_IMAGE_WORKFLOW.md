# Storefront bike image workflow

The public catalog uses four normalized tables:

- `storefront_bikes`: one row per motorcycle model.
- `storefront_bike_colors`: one reusable gallery target per model/color.
- `storefront_bike_variants`: separate CC, ABS, price, and specification combinations that reference a color.
- `storefront_bike_images`: ordered images linked to a color.

ABS and non-ABS variants may therefore have different prices and specifications while sharing the same color images.

## Local public-folder workflow

The complete folder structure is generated under:

```text
public/images/bikes/{brand-slug}/{bike-slug}/{color-slug}/
```

Example:

```text
public/images/bikes/taro/taro-gp1/red/01-front.webp
public/images/bikes/taro/taro-gp1/red/02-left.webp
public/images/bikes/taro/taro-gp1/red/03-rear.webp
```

Store the root-relative path in `storefront_bike_images.storage_path`:

```text
/images/bikes/taro/taro-gp1/red/01-front.webp
```

Each empty color directory contains `.gitkeep`. Delete or leave that placeholder when adding photos; it is ignored by the image importer.

## Supabase Storage alternative

Use the public `motorcycles` bucket with the same logical layout:

```text
storefront/{brand-slug}/{bike-slug}/{color-slug}/{order}-{view}.webp
```

Store only the object key—not the bucket name or full URL—in `storage_path`.

## Registering images

Locate the color row:

```sql
select color.id as color_id, bike.id as bike_id, bike.brand, bike.model_name,
  color.name, color.slug
from public.storefront_bike_colors color
join public.storefront_bikes bike on bike.id = color.storefront_bike_id
order by bike.brand, bike.model_name, color.display_order;
```

Then register a photo:

```sql
insert into public.storefront_bike_images (
  storefront_bike_id, color_id, variant_id, storage_path,
  alt_text, image_type, sort_order, is_primary
)
values (
  '<bike UUID>', '<color UUID>', null,
  '/images/bikes/taro/taro-gp1/red/01-front.webp',
  'Red Taro GP1 front view', 'color', 0, true
);
```

Use one primary image per color. Additional views use `is_primary = false` with increasing `sort_order` values. Keep `variant_id` null for normal color galleries.

## Image preparation

- Prefer WebP or AVIF.
- Use consistent dimensions, background, scale, and positioning across colors.
- Name files `01-front.webp`, `02-side.webp`, `03-rear.webp`, and so on.
- Use descriptive alt text containing the color, model, and view.
- Avoid spaces and uppercase characters in folder and file names.

Selecting ABS or non-ABS changes price/specifications. Selecting a color changes the gallery shared by all configurations using that color.