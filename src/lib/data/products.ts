import {
  FIXTURE_CATEGORIES,
  FIXTURE_FLOWERS,
  FIXTURE_GIFT_CARDS,
  FIXTURE_PRODUCTS,
  isDatabaseConfigured,
} from "./fixtures";
import type {
  CategorySummary,
  FlowerSummary,
  GiftCardTemplateSummary,
  ProductSummary,
} from "@/types";

interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
}

async function withPrisma<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
  if (!isDatabaseConfigured()) return fallback();
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

export async function getCategories(): Promise<CategorySummary[]> {
  return withPrisma(
    async () => {
      const { prisma } = await import("@/lib/prisma");
      const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        imageId: r.imageId,
      }));
    },
    () => FIXTURE_CATEGORIES,
  );
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductSummary[]> {
  const { category, search, minPrice, maxPrice, sort } = filters;

  return withPrisma(
    async () => {
      const { prisma } = await import("@/lib/prisma");
      const where: Record<string, unknown> = { active: true };
      if (category) where.category = { slug: category };
      if (search) where.name = { contains: search, mode: "insensitive" };
      if (minPrice != null || maxPrice != null) {
        where.basePrice = {
          gte: minPrice ?? undefined,
          lte: maxPrice ?? undefined,
        };
      }

      const orderBy =
        sort === "price-asc"
          ? { basePrice: "asc" as const }
          : sort === "price-desc"
            ? { basePrice: "desc" as const }
            : sort === "rating"
              ? { rating: "desc" as const }
              : { createdAt: "desc" as const };

      const rows = await prisma.product.findMany({
        where,
        orderBy,
        include: { category: true },
      });
      return rows.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        imageId: p.imageId,
        imageIds: p.imageIds,
        type: p.type as ProductSummary["type"],
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        categoryId: p.categoryId,
        categorySlug: p.category?.slug,
        featured: p.featured,
      }));
    },
    () => filterFixtures(FIXTURE_PRODUCTS, filters),
  );
}

export async function getProductBySlug(slug: string): Promise<ProductSummary | null> {
  return withPrisma(
    async () => {
      const { prisma } = await import("@/lib/prisma");
      const p = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        imageId: p.imageId,
        imageIds: p.imageIds,
        type: p.type as ProductSummary["type"],
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        categoryId: p.categoryId,
        categorySlug: p.category?.slug,
        featured: p.featured,
      };
    },
    () => FIXTURE_PRODUCTS.find((p) => p.slug === slug) ?? null,
  );
}

export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  const all = await getProducts({});
  const featured = all.filter((p) => p.featured);
  const list = featured.length > 0 ? featured : all;
  return list.slice(0, limit);
}

export async function getFlowers(): Promise<FlowerSummary[]> {
  return withPrisma(
    async () => {
      const { prisma } = await import("@/lib/prisma");
      const rows = await prisma.flower.findMany({ orderBy: { name: "asc" } });
      return rows.map((f) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        imageId: f.imageId,
        basePrice: f.basePrice,
        colors: f.colors,
      }));
    },
    () => FIXTURE_FLOWERS,
  );
}

export async function getGiftCardTemplates(): Promise<GiftCardTemplateSummary[]> {
  return withPrisma(
    async () => {
      const { prisma } = await import("@/lib/prisma");
      const rows = await prisma.giftCardTemplate.findMany({
        where: { active: true },
        orderBy: { price: "asc" },
      });
      return rows.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        imageId: g.imageId,
        price: g.price,
      }));
    },
    () => FIXTURE_GIFT_CARDS,
  );
}

function filterFixtures(items: ProductSummary[], filters: ProductFilters): ProductSummary[] {
  let list = [...items];
  if (filters.category) list = list.filter((p) => p.categorySlug === filters.category);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }
  if (filters.minPrice != null) list = list.filter((p) => p.basePrice >= filters.minPrice!);
  if (filters.maxPrice != null) list = list.filter((p) => p.basePrice <= filters.maxPrice!);

  switch (filters.sort) {
    case "price-asc":
      list.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price-desc":
      list.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }
  return list;
}
