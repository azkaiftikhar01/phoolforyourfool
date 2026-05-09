"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { STEM_COLOR } from "./flower-svgs";
import { FlowerArt } from "./FlowerArt";
import type { FlowerSummary } from "@/types";

interface AnimatedBouquetProps {
  /** Map of flowerId → quantity (matches builder state). */
  qtyById: Record<string, number>;
  /** Catalog of flowers to look up shape/color. */
  flowers: FlowerSummary[];
  /** Selected palette ribbon color. */
  palette: string;
}

const PALETTE_RIBBON: Record<string, string> = {
  blush: "#F08A92",
  peach: "#F5C396",
  coral: "#E2615A",
  sunset: "#F0A04E",
  ivory: "#E8DCC2",
};

/**
 * Pre-defined positions in a "bouquet shape" — heads cluster up top, slots
 * fan outward and upward from the wrap. r = radial distance from center,
 * a = angle (270° = top, 180° = left, 0° = right), scale = relative size,
 * tilt = rotation, depth = z-order hint (higher = front).
 *
 * Slots are ordered front → back so the FIRST stem becomes the prominent
 * front-center flower, with subsequent stems filling outward.
 */
const SLOTS: Array<{ r: number; a: number; scale: number; tilt: number; depth: number }> = [
  // Front-and-center hero
  { r: 0, a: 270, scale: 1.0, tilt: -2, depth: 9 },
  // Two flanking the hero, slightly higher
  { r: 0.45, a: 245, scale: 0.9, tilt: -14, depth: 8 },
  { r: 0.45, a: 295, scale: 0.9, tilt: 12, depth: 8 },
  // Behind & above the hero
  { r: 0.55, a: 270, scale: 0.85, tilt: 0, depth: 7 },
  // Mid ring (broad lateral spread)
  { r: 0.7, a: 215, scale: 0.8, tilt: -22, depth: 6 },
  { r: 0.7, a: 325, scale: 0.8, tilt: 20, depth: 6 },
  { r: 0.7, a: 250, scale: 0.78, tilt: -8, depth: 5 },
  { r: 0.7, a: 290, scale: 0.78, tilt: 8, depth: 5 },
  // Outer ring — wider, smaller (filler greenery feel)
  { r: 0.9, a: 195, scale: 0.7, tilt: -32, depth: 4 },
  { r: 0.9, a: 345, scale: 0.7, tilt: 30, depth: 4 },
  { r: 0.95, a: 230, scale: 0.65, tilt: -22, depth: 3 },
  { r: 0.95, a: 310, scale: 0.65, tilt: 22, depth: 3 },
  // Stretching out laterally
  { r: 1.05, a: 180, scale: 0.6, tilt: -50, depth: 2 },
  { r: 1.05, a: 0, scale: 0.6, tilt: 50, depth: 2 },
  // Final back fillers
  { r: 1.0, a: 270, scale: 0.7, tilt: 4, depth: 1 },
  { r: 1.1, a: 205, scale: 0.55, tilt: -42, depth: 1 },
  { r: 1.1, a: 335, scale: 0.55, tilt: 40, depth: 1 },
];

interface Stem {
  key: string;
  flowerId: string;
  index: number;
}

export function AnimatedBouquet({ qtyById, flowers, palette }: AnimatedBouquetProps) {
  const stems = useMemo<Stem[]>(() => {
    const out: Stem[] = [];
    let i = 0;
    for (const f of flowers) {
      const q = qtyById[f.id] ?? 0;
      for (let k = 0; k < q; k++) {
        out.push({ key: `${f.id}-${k}`, flowerId: f.id, index: i++ });
      }
    }
    return out;
  }, [qtyById, flowers]);

  const ribbonColor = PALETTE_RIBBON[palette] ?? PALETTE_RIBBON.coral!;
  const totalStems = stems.length;

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-[#F8F4E8]">
      {/* paper-tone backdrop with subtle wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(240,138,146,0.18), transparent 60%)",
        }}
        aria-hidden
      />

      {/* Flower heads layer */}
      <div className="absolute inset-x-0 top-0 mx-auto h-[68%] w-full">
        <AnimatePresence>
          {stems.map((stem) => {
            const slot = SLOTS[stem.index % SLOTS.length]!;
            const f = flowers.find((x) => x.id === stem.flowerId);
            if (!f) return null;

            const rad = (slot.a * Math.PI) / 180;
            // Fan out generously so 6+ stems don't clump at center.
            // x is horizontal spread; y skews upward (sin is negative for top angles).
            const cx = 50 + Math.cos(rad) * slot.r * 32;
            const cy = 56 + Math.sin(rad) * slot.r * 34;
            // Each flower head is ~22% wide → roughly 38% tall (portrait aspect).
            const sizePct = 22 * slot.scale;

            return (
              <motion.div
                key={stem.key}
                initial={{ opacity: 0, scale: 0.2, rotate: slot.tilt - 30, y: 12 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: [slot.tilt - 1.5, slot.tilt + 1.5, slot.tilt - 1.5],
                  y: [0, -2, 0, 2, 0],
                }}
                exit={{ opacity: 0, scale: 0, rotate: slot.tilt + 30 }}
                transition={{
                  scale: { type: "spring", stiffness: 220, damping: 15 },
                  opacity: { duration: 0.25 },
                  rotate: {
                    duration: 5 + (stem.index % 4),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 6 + (stem.index % 5),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                style={{
                  position: "absolute",
                  left: `${cx}%`,
                  top: `${cy}%`,
                  width: `${sizePct}%`,
                  // Portrait aspect — matches the watercolor sprite cells so
                  // tall flowers (eucalyptus, jasmine) keep their proportions.
                  aspectRatio: "100 / 175",
                  transform: "translate(-50%, -50%)",
                  zIndex: slot.depth,
                  filter: `drop-shadow(0 5px 10px rgba(27,26,23,${0.08 + slot.depth * 0.04}))`,
                }}
              >
                <FlowerArt
                  imageId={f.imageId}
                  slug={f.slug}
                  name={f.name}
                  size={400}
                  className="h-full w-full"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {totalStems === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-xl text-brand-deep/70">Compose your bouquet</p>
              <p className="mt-1 text-xs text-brand-ink/50">Tap + on any flower to start</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Stems converging into the neck of the wrap */}
      <svg
        viewBox="0 0 200 280"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {stems.slice(0, 17).map((stem, i) => {
          const slot = SLOTS[i]!;
          const rad = (slot.a * Math.PI) / 180;
          const headX = 100 + Math.cos(rad) * slot.r * 50;
          const headY = 150 + Math.sin(rad) * slot.r * 28;
          // Converge at y=178 (just above ribbon, top of wrap neck)
          return (
            <path
              key={stem.key}
              d={`M ${headX} ${headY} Q ${100 + (headX - 100) * 0.25} 170 100 178`}
              stroke={STEM_COLOR}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              opacity={0.5}
            />
          );
        })}
      </svg>

      {/* Bouquet wrap — kraft paper cone with twine + ribbon */}
      <div className="absolute inset-x-0 bottom-0 h-[40%]">
        <svg
          viewBox="0 0 200 130"
          className="absolute inset-x-0 bottom-0 h-full w-full"
          preserveAspectRatio="xMidYEnd meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="bq-paper" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F2E3CA" />
              <stop offset="100%" stopColor="#E2CFAA" />
            </linearGradient>
          </defs>

          {/* Soft watercolor wash behind the wrap for warmth */}
          <ellipse cx="100" cy="90" rx="82" ry="35" fill="#F5E6D0" opacity="0.4" />

          {/* Back paper layer (slightly larger, peeking out) */}
          <path
            d="M 46 22 Q 64 18 100 18 Q 136 18 154 22 L 178 126 Q 100 132 22 126 Z"
            fill="#DBC9A7"
            opacity="0.75"
            stroke="#1B1A17"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />

          {/* Front paper wrap (the main cone) */}
          <path
            d="M 58 18
               Q 74 14 92 14
               L 108 14
               Q 126 14 142 18
               L 165 126
               Q 100 131 35 126
               Z"
            fill="url(#bq-paper)"
            stroke="#1B1A17"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Vertical paper folds — subtle creases */}
          <path
            d="M 76 16 Q 79 70 76 126"
            stroke="#1B1A17"
            strokeWidth="0.5"
            opacity="0.32"
            fill="none"
          />
          <path
            d="M 100 14 L 100 128"
            stroke="#1B1A17"
            strokeWidth="0.4"
            opacity="0.2"
            fill="none"
          />
          <path
            d="M 124 16 Q 121 70 124 126"
            stroke="#1B1A17"
            strokeWidth="0.5"
            opacity="0.32"
            fill="none"
          />
          {/* Small diagonal crease on each side, suggesting paper bend */}
          <path
            d="M 50 38 Q 58 50 62 60"
            stroke="#1B1A17"
            strokeWidth="0.4"
            opacity="0.22"
            fill="none"
          />
          <path
            d="M 150 38 Q 142 50 138 60"
            stroke="#1B1A17"
            strokeWidth="0.4"
            opacity="0.22"
            fill="none"
          />

          {/* Twine wraps just under the paper opening */}
          <path
            d="M 60 24 Q 100 28 140 24"
            stroke="#8B6F47"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 60 30 Q 100 34 140 30"
            stroke="#8B6F47"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Ribbon — elegant bow tied over the twine */}
          {/* Left loop */}
          <path
            d="M 84 25
               Q 66 12 56 24
               Q 60 36 86 31
               Z"
            fill={ribbonColor}
            stroke="#1B1A17"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M 70 18 Q 74 26 72 32"
            stroke="#1B1A17"
            strokeWidth="0.5"
            fill="none"
            opacity="0.45"
          />

          {/* Right loop */}
          <path
            d="M 116 25
               Q 134 12 144 24
               Q 140 36 114 31
               Z"
            fill={ribbonColor}
            stroke="#1B1A17"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M 130 18 Q 126 26 128 32"
            stroke="#1B1A17"
            strokeWidth="0.5"
            fill="none"
            opacity="0.45"
          />

          {/* Center knot */}
          <ellipse
            cx="100"
            cy="27"
            rx="7"
            ry="5"
            fill={ribbonColor}
            stroke="#1B1A17"
            strokeWidth="0.9"
          />
          <line
            x1="94"
            y1="22"
            x2="94"
            y2="32"
            stroke="#1B1A17"
            strokeWidth="0.4"
            opacity="0.5"
          />
          <line
            x1="106"
            y1="22"
            x2="106"
            y2="32"
            stroke="#1B1A17"
            strokeWidth="0.4"
            opacity="0.5"
          />

          {/* Ribbon tails — natural drape with V-cut ends */}
          {/* Left tail */}
          <path
            d="M 96 32
               Q 91 55 87 78
               Q 83 100 84 116
               L 80 124
               L 90 120
               L 88 116"
            fill={ribbonColor}
            stroke="#1B1A17"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />

          {/* Right tail */}
          <path
            d="M 104 32
               Q 109 55 113 78
               Q 117 100 116 116
               L 120 124
               L 110 120
               L 112 116"
            fill={ribbonColor}
            stroke="#1B1A17"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />

          {/* Subtle highlight stripes along tails */}
          <path
            d="M 95 35 Q 90 60 86 90"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 105 35 Q 110 60 114 90"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Live count chip */}
      <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-brand-deep shadow-soft backdrop-blur">
        {totalStems} stem{totalStems === 1 ? "" : "s"}
      </div>
    </div>
  );
}
