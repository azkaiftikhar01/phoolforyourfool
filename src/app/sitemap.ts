import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data/products";

const STATIC_PATHS = [
  "/",
  "/products",
  "/builder",
  "/gift-cards",
  "/bulk-orders",
  "/about",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://phoolforyourfool.com";
  const products = await getProducts();
  const now = new Date();

  return [
    ...STATIC_PATHS.map((p) => ({ url: `${base}${p}`, lastModified: now })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: now,
    })),
  ];
}
