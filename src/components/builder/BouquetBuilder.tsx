"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";
import { AnimatedBouquet } from "./AnimatedBouquet";
import { CardWriter, type CardMessage } from "./CardWriter";
import { FlowerArt } from "./FlowerArt";
import type { FlowerSummary } from "@/types";

const PALETTE = [
  { id: "blush", label: "Blush", color: "#F08A92" },
  { id: "peach", label: "Peach", color: "#F5C396" },
  { id: "coral", label: "Coral", color: "#E2615A" },
  { id: "sunset", label: "Sunset", color: "#F0A04E" },
  { id: "ivory", label: "Ivory", color: "#E8DCC2" },
];

const ASSEMBLY_FEE = 500;

interface BouquetBuilderProps {
  flowers: FlowerSummary[];
}

export function BouquetBuilder({ flowers }: BouquetBuilderProps) {
  const [palette, setPalette] = useState<string>("blush");
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [card, setCard] = useState<CardMessage>({
    recipient: "",
    body: "",
    sender: "",
  });
  const add = useCartStore((s) => s.add);

  const total = useMemo(() => {
    const flowersTotal = flowers.reduce((acc, f) => {
      const qty = qtyById[f.id] ?? 0;
      return acc + qty * f.basePrice;
    }, 0);
    return flowersTotal === 0 ? 0 : flowersTotal + ASSEMBLY_FEE;
  }, [qtyById, flowers]);

  const totalStems = Object.values(qtyById).reduce((a, b) => a + b, 0);

  function bump(id: string, delta: number) {
    setQtyById((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });
  }

  function reset() {
    setQtyById({});
  }

  function handleAddToCart() {
    if (totalStems === 0) return;
    const summary = Object.entries(qtyById)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const f = flowers.find((x) => x.id === id);
        return f ? `${qty} × ${f.name}` : "";
      })
      .filter(Boolean)
      .join(", ");

    const id = `custom-${Date.now()}`;
    add({
      id,
      customBouquetId: id,
      name: `Custom Bouquet (${palette})`,
      imageId: "",
      price: total,
      quantity: 1,
      meta: {
        palette,
        stems: totalStems,
        summary,
        cardRecipient: card.recipient || "",
        cardBody: card.body || "",
        cardSender: card.sender || "",
      },
    });
    setQtyById({});
    setCard({ recipient: "", body: "", sender: "" });
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Palette selector */}
          <div className="card-soft">
            <h3 className="font-display text-xl text-brand-deep">Pick a palette</h3>
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              {PALETTE.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                    palette === p.id
                      ? "border-brand-deep bg-brand-deep text-white"
                      : "border-border bg-white text-brand-deep hover:bg-brand-cream"
                  }`}
                >
                  <span
                    aria-hidden
                    className="inline-block h-4 w-4 rounded-full border border-white/40"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flower selector grid with watercolor previews (PNG if uploaded, SVG fallback) */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {flowers.map((f) => {
              const qty = qtyById[f.id] ?? 0;
              return (
                <div
                  key={f.id}
                  className={`card-soft transition ${
                    qty > 0 ? "ring-2 ring-brand-coral/40" : ""
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F8F4E8]">
                    <div className="absolute inset-[8%] flex items-center justify-center">
                      <FlowerArt
                        imageId={f.imageId}
                        slug={f.slug}
                        name={f.name}
                        size={400}
                      />
                    </div>
                    {qty > 0 ? (
                      <span className="absolute right-2 top-2 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-brand-deep px-1.5 text-[11px] font-semibold text-white">
                        ×{qty}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-base text-brand-deep">{f.name}</p>
                      <p className="text-xs text-brand-ink/70">
                        {formatPKR(f.basePrice)} / stem
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => bump(f.id, -1)}
                        disabled={qty === 0}
                        className="rounded-full bg-brand-cream p-1.5 text-brand-deep transition hover:bg-brand-peach disabled:opacity-40"
                        aria-label={`Remove a ${f.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => bump(f.id, 1)}
                        className="rounded-full bg-brand-deep p-1.5 text-white transition hover:scale-105"
                        aria-label={`Add a ${f.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky animated preview */}
        <aside className="card-soft h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-brand-deep">Your bouquet</h3>
            {totalStems > 0 ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 text-xs text-brand-ink/60 hover:text-brand-coral"
              >
                <Trash2 className="h-3 w-3" /> Reset
              </button>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-brand-ink/70">
            {totalStems} stem{totalStems === 1 ? "" : "s"} · Palette: {palette}
          </p>

          <div className="mt-4">
            <AnimatedBouquet qtyById={qtyById} flowers={flowers} palette={palette} />
          </div>

          <ul className="mt-4 max-h-32 space-y-1 overflow-auto text-sm text-brand-ink/80">
            {Object.entries(qtyById)
              .filter(([, q]) => q > 0)
              .map(([id, q]) => {
                const f = flowers.find((x) => x.id === id);
                if (!f) return null;
                return (
                  <li key={id} className="flex justify-between">
                    <span>
                      {q} × {f.name}
                    </span>
                    <span>{formatPKR(q * f.basePrice)}</span>
                  </li>
                );
              })}
            {totalStems > 0 ? (
              <li className="flex justify-between text-brand-ink/60">
                <span>Assembly</span>
                <span>{formatPKR(ASSEMBLY_FEE)}</span>
              </li>
            ) : null}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-base font-semibold text-brand-deep">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={totalStems === 0}
            className="btn-primary mt-5 w-full"
          >
            <ShoppingBag className="h-4 w-4" /> Add bouquet to cart
          </button>
        </aside>
      </div>

      {/* Card writer (reveal once at least one stem is chosen) */}
      <CardWriter value={card} onChange={setCard} flowers={flowers} />
    </div>
  );
}
