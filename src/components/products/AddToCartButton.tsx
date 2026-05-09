"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { ProductSummary } from "@/types";

interface AddToCartButtonProps {
  product: ProductSummary;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({
      id: product.id,
      productId: product.id,
      name: product.name,
      imageId: product.imageId,
      price: product.basePrice,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-1.5">
        <button
          type="button"
          className="h-8 w-8 rounded-full text-lg leading-none text-brand-deep transition hover:bg-brand-cream"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
        >
          –
        </button>
        <span className="min-w-[2ch] text-center text-sm font-medium">{qty}</span>
        <button
          type="button"
          className="h-8 w-8 rounded-full text-lg leading-none text-brand-deep transition hover:bg-brand-cream"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        disabled={product.stock <= 0}
        className="btn-primary"
      >
        {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
        {added ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
}
