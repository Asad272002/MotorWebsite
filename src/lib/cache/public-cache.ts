export const PUBLIC_STOREFRONT_CACHE_TAG = "ow-public-storefront";
export const PUBLIC_BLOG_CACHE_TAG = "ow-public-blog";

// Public mutations and Supabase webhooks invalidate these tags immediately.
// The short fallback lifetime also recovers from a missed webhook without
// allowing database-backed public content to remain stale indefinitely.
export const PUBLIC_CACHE_REVALIDATE_SECONDS = 300;
