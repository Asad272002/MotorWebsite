import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  // Authentication exists only in the admin application. Keeping anonymous
  // storefront traffic outside Proxy avoids a Supabase JWT validation/refresh
  // round trip for every public page and RSC request.
  matcher: ["/admin/:path*"],
};
