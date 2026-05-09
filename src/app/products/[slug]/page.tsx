import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { formatPKR } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = (await getProducts({ category: product.categorySlug }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "demo"}/image/upload/${product.imageId}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.basePrice,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="container-page py-8 sm:py-12">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-brand-pink/30 aspect-square sm:rounded-3xl">
            <CloudinaryImage
              publicId={product.imageId}
              alt={product.name}
              width={1200}
              height={1200}
              priority
              transform={{ width: 1200, height: 1200, crop: "fill", gravity: "auto" }}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">
              {product.categorySlug ?? product.type}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-brand-deep sm:text-4xl md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-brand-ink/80">
              {product.description}
            </p>
            <p className="mt-6 font-display text-3xl text-brand-deep">
              {formatPKR(product.basePrice)}
            </p>
            <div className="mt-2 text-xs text-brand-ink/60">
              {product.stock > 0 ? `In stock — ${product.stock} available` : "Out of stock"}
              {" · "}Same-day delivery available in Karachi & Lahore
            </div>
            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-10 grid gap-3 text-sm text-brand-ink/80">
              <p>
                <strong className="text-brand-deep">Care:</strong> Trim stems daily and refresh
                water for up to 7 days of bloom life.
              </p>
              <p>
                <strong className="text-brand-deep">Delivery:</strong> Karachi, Lahore, Islamabad
                (same-day before 4pm). Other cities: 1–2 days.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20">
            <h2 className="font-display text-3xl font-semibold text-brand-deep">
              You might also love
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </>
  );
}
