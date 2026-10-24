import { NextResponse } from "next/server";

const LEGACY_PRODUCT_DESTINATIONS: Readonly<Record<string, string>> = {
  "lifan-k19": "/motorcycles/lifan/lifan-k19",
  "taro-c6": "/motorcycles/taro/taro-c6",
  "lifan-ss2": "/motorcycles/lifan/lifan-ss-2",
};

type LegacyRouteContext = { params: Promise<{ slug: string }> };

async function redirectLegacyProduct(request: Request, { params }: LegacyRouteContext) {
  const destination = LEGACY_PRODUCT_DESTINATIONS[(await params).slug];
  if (!destination) return new NextResponse(null, { status: 404 });

  // Build a fresh URL so obsolete catalogue query parameters are not carried
  // into the canonical product route.
  return NextResponse.redirect(new URL(destination, request.url), 308);
}

export const GET = redirectLegacyProduct;
export const HEAD = redirectLegacyProduct;
