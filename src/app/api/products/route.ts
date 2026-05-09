import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data/products";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const products = await getProducts({
    category: url.searchParams.get("category") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
    minPrice: numberParam(url, "minPrice"),
    maxPrice: numberParam(url, "maxPrice"),
    sort: (url.searchParams.get("sort") ?? undefined) as
      | "newest"
      | "price-asc"
      | "price-desc"
      | "rating"
      | undefined,
  });
  return NextResponse.json({ products });
}

function numberParam(url: URL, key: string): number | undefined {
  const v = url.searchParams.get(key);
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
