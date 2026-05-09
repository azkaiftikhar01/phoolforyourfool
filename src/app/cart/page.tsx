"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { formatPKR } from "@/lib/utils";
import { Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, update, remove, subtotal } = useCartStore();
  const total = subtotal();
  const shipping = total > 0 ? 350 : 0;

  return (
    <section className="container-page py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Your bouquet</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Review your selection before checkout. Free delivery on orders above PKR 8,000.
      </p>

      {items.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-2xl text-brand-deep">Your cart is empty</p>
          <p className="mt-2 text-sm text-brand-ink/70">
            Browse our bouquets or build a custom one.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/products" className="btn-primary">
              Shop flowers
            </Link>
            <Link href="/builder" className="btn-secondary">
              Build your own
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="grid grid-cols-[80px_1fr] gap-3 rounded-2xl border border-border/60 bg-white p-3 sm:grid-cols-[96px_1fr_auto] sm:gap-4 sm:p-4"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-brand-pink/30">
                  <CloudinaryImage
                    publicId={item.imageId}
                    alt={item.name}
                    width={200}
                    height={200}
                    transform={{ width: 200, height: 200, crop: "fill", gravity: "auto" }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-base text-brand-deep sm:text-lg">{item.name}</p>
                  <p className="text-sm text-brand-ink/70">{formatPKR(item.price)}</p>
                  {item.meta?.summary ? (
                    <p className="mt-1 text-xs text-brand-ink/60">{String(item.meta.summary)}</p>
                  ) : null}
                  {item.meta?.cardBody || item.meta?.cardRecipient || item.meta?.cardSender ? (
                    <details className="mt-1 text-xs text-brand-ink/70">
                      <summary className="cursor-pointer text-brand-coral hover:underline">
                        View card message
                      </summary>
                      <div className="mt-1 rounded-md border border-border/60 bg-brand-cream/40 p-2 font-mono leading-relaxed">
                        {item.meta?.cardRecipient ? (
                          <p>
                            <span className="font-semibold">Dear</span>{" "}
                            <em>{String(item.meta.cardRecipient)}</em>,
                          </p>
                        ) : null}
                        {item.meta?.cardBody ? <p className="mt-1 whitespace-pre-wrap">{String(item.meta.cardBody)}</p> : null}
                        {item.meta?.cardSender ? (
                          <p className="mt-1 text-right">
                            <span className="font-semibold">Sincerely,</span>{" "}
                            <em>{String(item.meta.cardSender)}</em>
                          </p>
                        ) : null}
                      </div>
                    </details>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => update(item.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-full text-brand-deep transition hover:bg-brand-cream"
                        aria-label="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="min-w-[2ch] text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => update(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-full text-brand-deep transition hover:bg-brand-cream"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-brand-ink/60 hover:text-brand-coral"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between border-t border-border/60 pt-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:pt-0 sm:text-right">
                  <span className="text-xs text-brand-ink/60 sm:hidden">Line total</span>
                  <p className="font-display text-base text-brand-deep sm:text-lg">
                    {formatPKR(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="card-soft h-fit">
            <h3 className="font-display text-2xl text-brand-deep">Order summary</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-ink/70">Subtotal</dt>
                <dd>{formatPKR(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-ink/70">Delivery</dt>
                <dd>{shipping ? formatPKR(shipping) : "Free"}</dd>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold text-brand-deep">
                <dt>Total</dt>
                <dd>{formatPKR(total + shipping)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
