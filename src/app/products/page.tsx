import type { Metadata } from "next";
import { ProductCard } from "@/components/products/ProductCard";
import { getCategories, getProducts } from "@/lib/data/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Flowers & Bouquets",
  description:
    "Explore handpicked bouquets, gajra and crochet flowers from Phool For Your Fool.",
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const category = (searchParams.category as string) ?? undefined;
  const search = (searchParams.search as string) ?? undefined;
  const sort = (searchParams.sort as
    | "newest"
    | "price-asc"
    | "price-desc"
    | "rating"
    | undefined) ?? "newest";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ category, search, sort }),
  ]);

  return (
    <section className="container-page py-8 sm:py-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
            Discover our finest selection
          </h1>
        </div>
        <p className="max-w-md text-sm text-brand-ink/70">
          Explore curated bouquets, gajra and crochet creations — fresh arrivals every week.
        </p>
      </header>

      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mt-8 sm:flex-wrap sm:overflow-visible">
        <Link
          href="/products"
          className={`pill shrink-0 ${!category ? "bg-brand-deep text-white" : ""}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products?category=${c.slug}`}
            className={`pill shrink-0 ${category === c.slug ? "bg-brand-deep text-white" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-brand-ink/60">
        <span>Sort:</span>
          {(
            [
              ["newest", "Newest"],
              ["price-asc", "Price ↑"],
              ["price-desc", "Price ↓"],
              ["rating", "Rating"],
            ] as const
          ).map(([value, label]) => {
            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (search) params.set("search", search);
            params.set("sort", value);
            return (
              <Link
                key={value}
                href={`/products?${params.toString()}`}
                className={`underline-offset-4 hover:underline ${
                  sort === value ? "text-brand-deep underline" : ""
                }`}
              >
                {label}
              </Link>
            );
          })}
      </div>

      {products.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-2xl text-brand-deep">No flowers found</p>
          <p className="mt-2 text-sm text-brand-ink/70">
            Try a different category or search term.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
