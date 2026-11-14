# OW Motorsport Vercel CPU and Performance Optimization Report

Date: 15 November 2026  
Branch: `perf/vercel-cpu-optimization`

## Scope and behavior guarantee

This work preserves the existing UI, routes, product data, variants, prices, images, filtering, search, admin workflows, authentication, authorization, SEO metadata, structured data, sitemap URLs, and inventory behavior. No production database records or schema were changed, and the branch was not pushed or deployed.

Cache Components were deliberately not enabled. The application continues to use its existing rendering model, with Next.js Data Cache added around anonymous public reads.

## A. Root cause analysis

### 1. Product detail requests loaded the complete catalogue

Location: `src/lib/storefront/bike-catalog.ts`

`getStorefrontProduct()` called `getStorefrontBikeRows()`, which loaded every published motorcycle plus every active variant, image, and specification, then searched the resulting array for one product.

A read-only production measurement using `taro/taro-gp1` showed:

| Fetch strategy | Rows returned | Approximate JSON payload |
|---|---:|---:|
| Previous full-catalogue lookup | 484 | 219,912 bytes |
| Direct product lookup | 59 | 25,803 bytes |

The direct query reduced returned data by approximately 88% for this sample. It still performs four parallel logical reads, but each child read is restricted to the requested motorcycle.

### 2. Catalogue relationship mapping repeatedly scanned whole arrays

Location: `src/lib/storefront/bike-catalog.ts`

For every motorcycle, the code filtered the complete variant, image, and specification arrays. This produced repeated O(products × related rows) work. Related rows are now grouped once into `Map` objects keyed by motorcycle ID.

### 3. Public reads only had request-level memoization

Locations:

- `src/lib/storefront/bike-catalog.ts`
- `src/lib/supabase/public-queries.ts`
- `src/lib/blog/queries.ts`

React `cache()` deduplicated calls only within one server render. Subsequent requests repeated Supabase reads and transformations. Next.js Data Cache now persists safe anonymous public results between requests.

### 4. Supabase authentication ran for anonymous storefront traffic

Locations:

- `src/proxy.ts`
- `src/lib/supabase/proxy.ts`

The prior matcher covered almost every HTML/RSC route, causing `supabase.auth.getClaims()` to run for public catalogue, product, blog, and contact traffic. No public route reads authenticated session state. Proxy matching is now limited to `/admin/:path*`, preserving login, logout, protected rendering, role authorization, and session refresh.

### 5. Product and blog detail pages rendered on demand

Locations:

- `src/app/(site)/motorcycles/[brand]/[slug]/page.tsx`
- `src/app/(site)/blog/[slug]/page.tsx`

Published product and article paths were known from public data but had no `generateStaticParams()`. The production build now prerenders 21 motorcycle pages and 6 blog articles while leaving dynamic fallback enabled for newly published paths.

### 6. Metadata and page rendering repeated catalogue transformations

Location: `src/lib/supabase/public-queries.ts`

Metadata and page functions independently created equivalent filter objects, so object-identity memoization could not share `getCatalogPageData()` work. A stable serialized key now provides request-level deduplication without globally caching arbitrary visitor filter combinations.

### 7. Public invalidation evicted broad route trees

Locations:

- `src/lib/admin/action-helpers.ts`
- `src/app/api/revalidate/supabase/route.ts`

Every public content mutation invalidated several individual routes and the full motorcycle layout. Public dependencies are genuinely cross-linked, so they now share one storefront data tag. Mutations immediately expire that tag and explicitly refresh the sitemap, avoiding broad route-tree eviction.

### 8. Sitemap update calculations repeatedly filtered products

Location: `src/app/sitemap.ts`

Brand and category `lastModified` calculations repeatedly filtered the complete motorcycle list. Updates are now grouped once by brand and category.

## B. Files modified

- `src/lib/cache/public-cache.ts`: central public cache tags and five-minute fallback lifetime.
- `src/lib/storefront/bike-catalog.ts`: direct product loading, relationship maps, and persistent cache wrappers.
- `src/lib/supabase/public-queries.ts`: persistent anonymous caching and request-level catalogue calculation deduplication.
- `src/lib/blog/queries.ts`: anonymous public client and persistent blog caching; admin queries remain authenticated and uncached.
- `src/proxy.ts`: restrict session refresh to the admin application.
- `src/lib/admin/action-helpers.ts`: tag-based storefront invalidation instead of broad public path invalidation.
- `src/app/admin/blog-actions.ts`: immediate blog cache invalidation after mutations.
- `src/app/api/revalidate/supabase/route.ts`: tag invalidation for external Supabase changes.
- `src/app/(site)/motorcycles/[brand]/[slug]/page.tsx`: prerender published product paths.
- `src/app/(site)/blog/[slug]/page.tsx`: prerender published article paths.
- `src/app/sitemap.ts`: lookup-map based timestamp aggregation.

## C. Caching architecture

### Storefront tag

Tag: `ow-public-storefront`

Cached data includes:

- Normalized storefront motorcycle rows
- Catalogue motorcycle models
- Navigation motorcycle summaries
- Brand summaries and active public brands
- Public categories
- Storefront settings
- Homepage brands, display sections, and campaign images
- Individual product detail results keyed by brand and product slug

### Blog tag

Tag: `ow-public-blog`

Cached data includes active blog categories and published articles. Private/admin blog queries are not cached.

### Lifetime and freshness

- Fallback time revalidation: 300 seconds
- Admin mutations: immediate tag expiration
- Supabase storefront webhook: immediate storefront tag expiration
- Blog mutations: immediate blog tag expiration
- Sitemap: explicitly revalidated after relevant mutations

The five-minute lifetime is a recovery mechanism for missed webhooks or out-of-band writes. Normal admin changes invalidate immediately. Authentication state, user data, admin data, mutations, sales, and document handovers never enter the shared cache.

Official Next.js guidance used:

- `unstable_cache`: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
- Previous-model caching without Cache Components: https://nextjs.org/docs/app/guides/caching-without-cache-components
- Proxy matchers: https://nextjs.org/docs/app/api-reference/file-conventions/proxy

## D. Database improvements

The production index catalogue was inspected read-only. Required indexes already exist:

- Unique `(brand_slug, slug)` on `storefront_bikes`
- Public ordering index on `storefront_bikes`
- `(storefront_bike_id, is_active, display_order)` on variants
- `(storefront_bike_id, variant_id, sort_order)` on images
- `(storefront_bike_id, cc, has_abs, is_active, group_order, sort_order)` on specifications

No migration is required or proposed. No production schema or data was modified.

## E. Validation results

### Required commands

- `npm run lint`: passed with 0 errors and 7 pre-existing warnings.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.

### Build/rendering result

- 41 static pages generated.
- 21 motorcycle detail pages are SSG with five-minute data revalidation.
- 6 blog detail pages are SSG with five-minute data revalidation.
- Homepage, brands, about, sitemap, product pages, and article pages show cached revalidation in build output.
- Catalogue, brand/category filters, contact query handling, admin, and API routes remain dynamic.

### Local production smoke test

All representative routes returned expected statuses:

- `/`: 200
- `/motorcycles`: 200
- `/motorcycles/taro/taro-gp1`: 200
- `/motorcycles/brand/taro`: 200
- `/motorcycles/category/sport-bikes`: 200
- `/blog`: 200
- Representative blog article: 200
- `/contact`: 200
- `/sitemap.xml`: 200
- `/admin`: 307 redirect without a session, preserving protection

The product HTML retained its title, canonical, Open Graph data, JSON-LD, variants, specifications, images, related products, and FAQ content.

## F. Deployment considerations

- No new environment variables.
- No database migration.
- No dependency changes.
- Deploy the optimization branch to a Vercel preview first.
- Verify admin login/session refresh and one create/update/publish workflow in preview.
- Confirm the Supabase revalidation webhook still points to `/api/revalidate/supabase` with `SUPABASE_REVALIDATION_SECRET`.
- Merge only after preview verification; this branch has not been pushed or deployed.

## G. Remaining risks

- A direct database change that bypasses both admin actions and the webhook can remain cached for up to five minutes.
- Brand/category/filter routes remain dynamic because their query-string behavior and indexability rules must be preserved.
- Contact remains dynamic because metadata intentionally changes to `noindex` when query parameters are present.
- Vercel CPU improvements must be confirmed after deployment using comparable traffic; local timings do not predict Fluid Active CPU exactly.
- The seven existing lint warnings are unrelated to this optimization.

## H. Expected performance impact

Evidence-backed changes:

- The measured sample product query payload fell from 219,912 bytes to 25,803 bytes (about 88%).
- Warm public Data Cache reads avoid repeated Supabase queries for cached datasets until invalidation/revalidation.
- Anonymous public routes no longer execute Supabase claim validation in Proxy.
- 27 dynamic detail paths are now prerendered at build time.
- Catalogue relationship mapping changed from repeated whole-array filtering to single-pass grouping.

These changes should materially reduce server invocations, database transfer, and per-request transformations on the routes identified in Vercel Observability. No production CPU percentage is claimed until post-deployment telemetry is collected under comparable traffic.
