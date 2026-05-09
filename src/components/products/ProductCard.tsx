"use client";

import Link from "next/link";
import { Heart, Plus, Star, Image as ImageIcon } from "lucide-react";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";
import type { ProductSummary } from "@/types";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const add = useCartStore((s) => s.add);

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-2xl bg-brand-pink/30 aspect-[4/5] sm:rounded-3xl">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {product.imageId ? (
            <CloudinaryImage
              publicId={product.imageId}
              alt={product.name}
              width={800}
              height={1000}
              transform={{ width: 800, height: 1000, crop: "fill", gravity: "auto" }}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-pink via-brand-peach to-brand-orange text-brand-deep/60">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </Link>

        <button
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-brand-deep shadow-soft transition hover:bg-white sm:right-3 sm:top-3"
        >
          <Heart className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            add({
              id: product.id,
              productId: product.id,
              name: product.name,
              imageId: product.imageId,
              price: product.basePrice,
              quantity: 1,
            })
          }
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-brand-deep px-3 py-1.5 text-xs font-semibold text-white shadow-soft transition group-hover:opacity-100 sm:bottom-3 sm:right-3 sm:opacity-0"
        >
          <Plus className="h-3 w-3" /> Cart
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="font-display text-base text-brand-deep transition hover:text-brand-coral"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-center gap-1 text-xs text-brand-ink/70">
            <Star className="h-3 w-3 fill-current text-brand-coral" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-brand-ink/40">({product.reviewCount})</span>
          </div>
        </div>
        <p className="font-display text-lg text-brand-deep">{formatPKR(product.basePrice)}</p>
      </div>
    </article>
  );
}
