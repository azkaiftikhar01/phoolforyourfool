"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPKR, isFutureDate } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = subtotal();
  const shipping = total > 0 ? 350 : 0;
  const grandTotal = total + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const data = new FormData(e.currentTarget);
    const deliveryDate = String(data.get("deliveryDate") ?? "");
    if (!isFutureDate(deliveryDate)) {
      setError("Delivery date must be today or later.");
      setSubmitting(false);
      return;
    }

    const payload = {
      items: items.map((i) => ({
        id: i.id,
        productId: i.productId,
        variantId: i.variantId,
        customBouquetId: i.customBouquetId,
        name: i.name,
        imageId: i.imageId,
        price: i.price,
        quantity: i.quantity,
      })),
      contact: {
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
      },
      address: {
        recipient: data.get("recipient"),
        line1: data.get("line1"),
        line2: data.get("line2") || undefined,
        city: data.get("city"),
        zipCode: data.get("zipCode"),
      },
      deliveryDate,
      deliveryWindow: data.get("deliveryWindow"),
      giftMessage: data.get("giftMessage"),
      paymentMethod: "cod",
      total: grandTotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Could not place order");
      }
      const { orderNumber } = (await res.json()) as { orderNumber: string };
      clear();
      router.push(`/account/orders?placed=${orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="container-page py-16">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-sm text-brand-ink/70">Add a bouquet to continue.</p>
      </section>
    );
  }

  return (
    <section className="container-page py-8 sm:py-12">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl md:text-5xl">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-8 sm:mt-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-10"
      >
        <div className="space-y-8">
          <fieldset className="space-y-3">
            <legend className="font-display text-2xl text-brand-deep">Contact</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" name="name" placeholder="Full name" required />
              <input className="input" name="email" type="email" placeholder="Email" required />
            </div>
            <input className="input" name="phone" placeholder="Phone (e.g. +92 300 1234567)" required />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-2xl text-brand-deep">Delivery address</legend>
            <input className="input" name="recipient" placeholder="Recipient name" required />
            <input className="input" name="line1" placeholder="Address line 1" required />
            <input className="input" name="line2" placeholder="Address line 2 (optional)" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" name="city" placeholder="City" required />
              <input className="input" name="zipCode" placeholder="Zip / Postal code" required />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-2xl text-brand-deep">Delivery time</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="input"
                name="deliveryDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <select className="input" name="deliveryWindow" defaultValue="10am-2pm" required>
                <option value="10am-2pm">10:00 AM – 2:00 PM</option>
                <option value="2pm-6pm">2:00 PM – 6:00 PM</option>
                <option value="6pm-9pm">6:00 PM – 9:00 PM</option>
              </select>
            </div>
            <textarea
              className="input min-h-[100px]"
              name="giftMessage"
              placeholder="Add a gift message (optional)"
              maxLength={300}
            />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-2xl text-brand-deep">Payment</legend>
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="font-medium text-brand-deep">Cash on Delivery</p>
              <p className="mt-1 text-sm text-brand-ink/70">
                Pay your courier in cash when your bouquet arrives. Online payments are
                coming soon.
              </p>
            </div>
          </fieldset>

          {error ? (
            <p className="rounded-xl bg-brand-coral/10 px-4 py-3 text-sm text-brand-coral">
              {error}
            </p>
          ) : null}
        </div>

        <aside className="card-soft order-first h-fit lg:order-last lg:sticky lg:top-24">
          <h3 className="font-display text-2xl text-brand-deep">Summary</h3>
          <ul className="mt-4 divide-y divide-border/60 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between py-2">
                <span className="text-brand-ink/80">
                  {i.name} × {i.quantity}
                </span>
                <span>{formatPKR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPKR(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatPKR(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-2 text-base font-semibold text-brand-deep">
              <dt>Total</dt>
              <dd>{formatPKR(grandTotal)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </aside>
      </form>
    </section>
  );
}
