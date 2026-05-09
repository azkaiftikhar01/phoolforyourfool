"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { FlowerArt } from "./FlowerArt";
import type { FlowerSummary } from "@/types";

export interface CardMessage {
  recipient: string;
  body: string;
  sender: string;
}

interface CardWriterProps {
  value: CardMessage;
  onChange: (next: CardMessage) => void;
  /** Catalog flowers used to decorate the sides of the card. */
  flowers?: FlowerSummary[];
}

/** Layout slots for the flowers flanking the card. */
const FLANK_SLOTS = [
  { side: "left", top: "8%", offset: 8, size: "120px" },
  { side: "left", top: "32%", offset: 30, size: "150px" },
  { side: "left", top: "62%", offset: 12, size: "120px" },
  { side: "right", top: "8%", offset: 30, size: "150px" },
  { side: "right", top: "34%", offset: 8, size: "140px" },
  { side: "right", top: "62%", offset: 28, size: "130px" },
] as const;

export function CardWriter({ value, onChange, flowers = [] }: CardWriterProps) {
  // Pick 6 flowers (cycle if fewer) for flanking. Stable order based on slug.
  const flank = useMemo(() => {
    if (flowers.length === 0) return [];
    const sorted = [...flowers].sort((a, b) => a.slug.localeCompare(b.slug));
    return FLANK_SLOTS.map((slot, i) => ({
      ...slot,
      flower: sorted[i % sorted.length]!,
    }));
  }, [flowers]);

  const left = flank.filter((f) => f.side === "left");
  const right = flank.filter((f) => f.side === "right");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#F8F4E8] px-4 py-8 sm:py-12">
      <p className="text-center text-[11px] font-medium uppercase tracking-[0.4em] text-brand-deep">
        Write the Card
      </p>

      <div className="relative mx-auto mt-6 grid max-w-5xl grid-cols-1 items-start gap-6 sm:grid-cols-[1fr_minmax(0,420px)_1fr] sm:gap-8">
        {/* Left flanking flowers */}
        <div className="relative hidden h-[360px] sm:block">
          {left.map((slot, i) => (
            <motion.div
              key={`L-${i}`}
              className="absolute"
              style={{ top: slot.top, left: `${slot.offset}%`, width: slot.size }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -4, 0, 4, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: i * 0.15 },
                y: { duration: 7 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <FlowerArt
                imageId={slot.flower.imageId}
                slug={slot.flower.slug}
                name={slot.flower.name}
                size={400}
                className="h-auto w-full"
              />
            </motion.div>
          ))}
        </div>

        {/* The card itself */}
        <div
          className="relative mx-auto w-full max-w-[440px] bg-[#FBF7EB] p-6 shadow-[0_2px_0_#1B1A17,0_8px_24px_-12px_rgba(27,26,23,0.4)] sm:p-8"
          style={{ border: "1.5px solid #1B1A17" }}
        >
          <div className="font-mono text-[15px] leading-relaxed text-brand-deep">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">Dear</span>
              <input
                type="text"
                value={value.recipient}
                onChange={(e) => onChange({ ...value, recipient: e.target.value })}
                placeholder="Beloved"
                className="flex-1 border-0 bg-transparent italic outline-none placeholder:text-brand-ink/40"
              />
              <span>,</span>
            </div>

            <textarea
              value={value.body}
              onChange={(e) => onChange({ ...value, body: e.target.value })}
              placeholder="I have so much to tell you, but only this much space on this card! Still, you must know…"
              rows={5}
              className="mt-3 w-full resize-none border-0 bg-transparent outline-none placeholder:text-brand-ink/40"
              style={{ fontFamily: "inherit" }}
            />

            <div className="mt-4 text-right">
              <p className="font-semibold">Sincerely,</p>
              <input
                type="text"
                value={value.sender}
                onChange={(e) => onChange({ ...value, sender: e.target.value })}
                placeholder="Secret Admirer"
                className="w-full border-0 bg-transparent text-right italic outline-none placeholder:text-brand-ink/40"
              />
            </div>
          </div>

          {/* Hand-drawn corner ticks */}
          <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-[#1B1A17]" aria-hidden />
          <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-[#1B1A17]" aria-hidden />
          <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-[#1B1A17]" aria-hidden />
          <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-[#1B1A17]" aria-hidden />
        </div>

        {/* Right flanking flowers */}
        <div className="relative hidden h-[360px] sm:block">
          {right.map((slot, i) => (
            <motion.div
              key={`R-${i}`}
              className="absolute"
              style={{ top: slot.top, right: `${slot.offset}%`, width: slot.size }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, 4, 0, -4, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: i * 0.15 + 0.3 },
                y: { duration: 7 + i, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <FlowerArt
                imageId={slot.flower.imageId}
                slug={slot.flower.slug}
                name={slot.flower.name}
                size={400}
                className="h-auto w-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile: small inline strip below the card */}
        {flank.length > 0 ? (
          <div className="-mt-2 flex items-center justify-center gap-3 sm:hidden">
            {flank.slice(0, 3).map((slot, i) => (
              <motion.div
                key={`M-${i}`}
                className="w-16"
                animate={{ y: [0, -3, 0, 3, 0] }}
                transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <FlowerArt
                  imageId={slot.flower.imageId}
                  slug={slot.flower.slug}
                  name={slot.flower.name}
                  size={300}
                  className="h-auto w-full"
                />
              </motion.div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
