/**
 * Hand-illustrated, watercolor-and-ink flower SVGs.
 *
 * Each flower is drawn in three layers:
 *  1. A "wash" of low-opacity colored blobs that intentionally extends past
 *     the ink outline so it looks like watercolor bleed.
 *  2. An "ink" layer of dark, slightly rough strokes for the petals.
 *  3. A center accent (stamen / eye) on top.
 *
 * All shapes use a 120×120 viewBox with the flower-head centered around
 * (60, 55) so they stack and rotate cleanly inside the bouquet.
 */

import type { FC, SVGProps } from "react";

export interface FlowerProps extends SVGProps<SVGSVGElement> {
  color?: string;
  accent?: string;
}

const INK = "#1B1A17";
const STEM = "#3F6B3A";

// ─────────────────────────────────────────────────────────────
// PEONY — layered cabbage rose with visible yellow stamen
// ─────────────────────────────────────────────────────────────
export function Peony({ color = "#F08A92", accent = "#F5B82E", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* watercolor wash — irregular, offset blobs */}
      <g opacity="0.7">
        <path
          d="M 22 50 Q 16 32 30 22 Q 50 14 70 18 Q 92 22 100 40 Q 106 60 96 78 Q 80 96 58 96 Q 32 96 22 78 Q 14 64 22 50 Z"
          fill={color}
        />
        <path
          d="M 30 42 Q 36 28 56 26 Q 78 26 90 40 Q 96 58 86 72 Q 70 84 50 80 Q 30 74 28 60 Q 26 50 30 42 Z"
          fill={color}
          opacity="0.8"
        />
      </g>

      {/* ink — outer cabbage ruffle */}
      <g stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 30 50 Q 26 36 38 28 Q 48 24 58 26 Q 70 22 82 28 Q 94 36 92 50 Q 96 60 90 70 Q 84 82 70 84 Q 58 88 48 84 Q 32 82 28 68 Q 24 60 30 50 Z" />
        {/* mid ring of petals */}
        <path d="M 38 52 Q 36 42 46 38 Q 54 36 60 40 Q 68 36 76 40 Q 84 46 82 56 Q 84 64 78 70 Q 70 76 60 74 Q 50 78 42 72 Q 36 64 38 52 Z" />
        {/* inner cluster */}
        <path d="M 46 56 Q 44 48 50 44 Q 56 44 60 48 Q 66 44 72 48 Q 76 54 72 60 Q 68 66 60 64 Q 52 68 48 64 Q 44 60 46 56 Z" />
        {/* petal vein hints */}
        <path d="M 36 44 Q 42 50 46 56" opacity="0.7" />
        <path d="M 84 44 Q 78 50 74 56" opacity="0.7" />
        <path d="M 42 70 Q 50 64 56 64" opacity="0.7" />
        <path d="M 78 70 Q 70 64 64 64" opacity="0.7" />
        <path d="M 60 32 Q 58 38 58 44" opacity="0.6" />
      </g>

      {/* yellow stamen center */}
      <g>
        <circle cx="60" cy="56" r="6" fill={accent} stroke={INK} strokeWidth="1" />
        <circle cx="60" cy="56" r="2.5" fill="#C99012" />
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <circle
            key={d}
            cx={60 + Math.cos((d * Math.PI) / 180) * 4}
            cy={56 + Math.sin((d * Math.PI) / 180) * 4}
            r="0.9"
            fill={INK}
          />
        ))}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ROSE — top-down spiral
// ─────────────────────────────────────────────────────────────
export function Rose({ color = "#F08A92", accent = "#C04A55", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.7">
        <ellipse cx="56" cy="58" rx="40" ry="38" fill={color} />
        <ellipse cx="64" cy="52" rx="36" ry="32" fill={color} opacity="0.8" />
      </g>

      <g stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* outer 6 petals */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M 60 24 Q 44 28 40 44 Q 48 50 60 50 Q 72 50 80 44 Q 76 28 60 24 Z"
            transform={`rotate(${deg} 60 56)`}
          />
        ))}
        {/* inner spiral */}
        <path d="M 50 56 Q 48 46 58 44 Q 70 44 72 54 Q 70 64 58 64 Q 50 62 50 56 Z" />
        <path d="M 54 56 Q 54 50 60 50 Q 66 52 64 58 Q 60 60 56 58" />
        <path d="M 58 56 Q 58 53 61 53 Q 63 55 61 57" />
        {/* outer petal veins */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={`v-${deg}`}
            d="M 60 28 Q 60 36 60 44"
            opacity="0.6"
            transform={`rotate(${deg} 60 56)`}
          />
        ))}
      </g>

      <circle cx="60" cy="56" r="2" fill={accent} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DAHLIA / CARNATION — many narrow ruffled petals, vivid magenta
// ─────────────────────────────────────────────────────────────
export function Dahlia({ color = "#E8377F", accent = "#F5B82E", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.7">
        <ellipse cx="62" cy="56" rx="44" ry="40" fill={color} />
        <ellipse cx="56" cy="58" rx="38" ry="36" fill={color} opacity="0.8" />
      </g>

      <g stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* outer 16 narrow pointed petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const deg = (360 / 16) * i;
          return (
            <path
              key={`o-${i}`}
              d="M 60 18 L 56 32 Q 60 36 64 32 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
        {/* mid 14 petals offset */}
        {Array.from({ length: 14 }).map((_, i) => {
          const deg = (360 / 14) * i + 13;
          return (
            <path
              key={`m-${i}`}
              d="M 60 32 L 57 44 Q 60 47 63 44 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
        {/* inner 12 petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = (360 / 12) * i;
          return (
            <path
              key={`i-${i}`}
              d="M 60 44 L 58 52 Q 60 54 62 52 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
      </g>

      {/* yellow stamen center */}
      <circle cx="60" cy="56" r="5" fill={accent} stroke={INK} strokeWidth="1" />
      <circle cx="60" cy="56" r="2" fill="#C99012" />
      {[30, 90, 150, 210, 270, 330].map((d) => (
        <circle
          key={d}
          cx={60 + Math.cos((d * Math.PI) / 180) * 3.2}
          cy={56 + Math.sin((d * Math.PI) / 180) * 3.2}
          r="0.7"
          fill={INK}
        />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ANEMONE — round wide petals with very dark center
// ─────────────────────────────────────────────────────────────
export function Anemone({ color = "#D7E6E9", accent = "#1B2540", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.7">
        <ellipse cx="58" cy="54" rx="40" ry="40" fill={color} />
        <ellipse cx="64" cy="60" rx="34" ry="30" fill={color} opacity="0.6" />
      </g>

      <g stroke={INK} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* 7 broad round petals */}
        {[0, 51, 103, 154, 206, 257, 309].map((deg) => (
          <path
            key={deg}
            d="M 60 18 Q 44 22 42 38 Q 44 50 60 50 Q 76 50 78 38 Q 76 22 60 18 Z"
            transform={`rotate(${deg} 60 56)`}
          />
        ))}
        {/* center ring */}
        <circle cx="60" cy="56" r="9" fill={accent} stroke={INK} strokeWidth="1.2" />
      </g>

      {/* stamen dots radiating from dark center */}
      {Array.from({ length: 14 }).map((_, i) => {
        const deg = (360 / 14) * i;
        const x = 60 + Math.cos((deg * Math.PI) / 180) * 12;
        const y = 56 + Math.sin((deg * Math.PI) / 180) * 12;
        return <circle key={i} cx={x} cy={y} r="1" fill={INK} />;
      })}
      <circle cx="60" cy="56" r="3" fill="#0A0F1F" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// LILY — six tepals with prominent stamens
// ─────────────────────────────────────────────────────────────
export function Lily({ color = "#9F8AC9", accent = "#F5B82E", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.7">
        <ellipse cx="58" cy="56" rx="40" ry="42" fill={color} />
        <ellipse cx="66" cy="50" rx="32" ry="36" fill={color} opacity="0.7" />
      </g>

      <g stroke={INK} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* 6 long pointed tepals */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M 60 18 Q 50 30 52 50 Q 56 56 60 56 Q 64 56 68 50 Q 70 30 60 18 Z"
            transform={`rotate(${deg} 60 56)`}
          />
        ))}
        {/* tepal veins */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={`v-${deg}`}
            d="M 60 22 L 60 50"
            opacity="0.6"
            transform={`rotate(${deg} 60 56)`}
          />
        ))}
      </g>

      {/* prominent stamens */}
      <g stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round">
        {[20, 70, 110, 160, 200, 250, 290, 340].map((deg) => {
          const x2 = 60 + Math.cos((deg * Math.PI) / 180) * 14;
          const y2 = 56 + Math.sin((deg * Math.PI) / 180) * 14;
          return <line key={deg} x1="60" y1="56" x2={x2} y2={y2} />;
        })}
      </g>
      {[20, 70, 110, 160, 200, 250, 290, 340].map((deg) => {
        const x = 60 + Math.cos((deg * Math.PI) / 180) * 15;
        const y = 56 + Math.sin((deg * Math.PI) / 180) * 15;
        return <ellipse key={deg} cx={x} cy={y} rx="1.6" ry="2.6" fill={accent} stroke={INK} strokeWidth="0.6" />;
      })}
      <circle cx="60" cy="56" r="2" fill={INK} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DAISY — narrow petals around yellow disc
// ─────────────────────────────────────────────────────────────
export function Daisy({ color = "#FFFFFF", accent = "#F5B82E", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.6">
        <ellipse cx="60" cy="56" rx="38" ry="38" fill={color} />
      </g>
      <g stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 14 }).map((_, i) => {
          const deg = (360 / 14) * i;
          return (
            <path
              key={i}
              d="M 60 20 Q 56 24 56 36 Q 60 40 64 36 Q 64 24 60 20 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
      </g>
      <circle cx="60" cy="56" r="9" fill={accent} stroke={INK} strokeWidth="1.2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <circle
          key={d}
          cx={60 + Math.cos((d * Math.PI) / 180) * 4.5}
          cy={56 + Math.sin((d * Math.PI) / 180) * 4.5}
          r="0.8"
          fill={INK}
        />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SUNFLOWER — yellow rays around dark seeded disc
// ─────────────────────────────────────────────────────────────
export function Sunflower({ color = "#F5B82E", accent = "#5C3A14", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.7">
        <ellipse cx="60" cy="56" rx="44" ry="42" fill={color} />
      </g>
      <g stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 18 }).map((_, i) => {
          const deg = (360 / 18) * i;
          return (
            <path
              key={i}
              d="M 60 16 L 56 30 Q 60 36 64 30 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
        {Array.from({ length: 18 }).map((_, i) => {
          const deg = (360 / 18) * i + 10;
          return (
            <path
              key={`b-${i}`}
              d="M 60 26 L 57 38 Q 60 42 63 38 Z"
              transform={`rotate(${deg} 60 56)`}
              opacity="0.85"
            />
          );
        })}
      </g>
      <circle cx="60" cy="56" r="13" fill={accent} stroke={INK} strokeWidth="1.4" />
      {/* seed pattern */}
      {[
        [60, 56], [56, 52], [64, 52], [56, 60], [64, 60], [60, 48], [60, 64],
        [52, 56], [68, 56], [54, 50], [66, 50], [54, 62], [66, 62],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="#1F0F00" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// MARIGOLD — dense pom-pom
// ─────────────────────────────────────────────────────────────
export function Marigold({ color = "#F08A2E", accent = "#C44E13", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.7">
        <ellipse cx="60" cy="56" rx="40" ry="38" fill={color} />
        <ellipse cx="58" cy="58" rx="32" ry="30" fill={accent} opacity="0.6" />
      </g>
      <g stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 24 }).map((_, i) => {
          const deg = (360 / 24) * i;
          return (
            <path
              key={`o-${i}`}
              d="M 60 20 Q 57 26 58 32 Q 60 34 62 32 Q 63 26 60 20 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
        {Array.from({ length: 20 }).map((_, i) => {
          const deg = (360 / 20) * i + 9;
          return (
            <path
              key={`m-${i}`}
              d="M 60 32 Q 57 38 58 44 Q 60 46 62 44 Q 63 38 60 32 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
        {Array.from({ length: 16 }).map((_, i) => {
          const deg = (360 / 16) * i;
          return (
            <path
              key={`i-${i}`}
              d="M 60 44 Q 58 48 59 52 Q 60 53 61 52 Q 62 48 60 44 Z"
              transform={`rotate(${deg} 60 56)`}
            />
          );
        })}
      </g>
      <circle cx="60" cy="56" r="3" fill={accent} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// SPRIG — cluster of small flowers (jasmine / baby's breath)
// ─────────────────────────────────────────────────────────────
export function Sprig({ color = "#FFFFFF", accent = "#3F6B3A", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.5">
        <ellipse cx="60" cy="56" rx="32" ry="36" fill={color} />
      </g>
      {/* stems */}
      <g stroke={accent} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8">
        <path d="M 60 96 Q 58 80 50 60" />
        <path d="M 60 96 Q 62 80 70 60" />
        <path d="M 60 96 Q 60 80 60 50" />
        <path d="M 50 60 Q 44 50 40 38" />
        <path d="M 50 60 Q 56 50 60 42" />
        <path d="M 70 60 Q 76 50 80 38" />
        <path d="M 70 60 Q 64 52 60 42" />
      </g>
      {/* tiny flowers */}
      {[
        [40, 38], [60, 30], [80, 38], [50, 46], [70, 46], [60, 42], [44, 56], [76, 56], [60, 60],
      ].map(([x, y], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((d) => (
            <ellipse
              key={d}
              cx={x + Math.cos((d * Math.PI) / 180) * 2.5}
              cy={y + Math.sin((d * Math.PI) / 180) * 2.5}
              rx="2"
              ry="2.6"
              fill={color}
              stroke={INK}
              strokeWidth="0.7"
              transform={`rotate(${d} ${x} ${y})`}
            />
          ))}
          <circle cx={x} cy={y} r="1.2" fill="#F5B82E" stroke={INK} strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// LEAF SPRIG (eucalyptus) — long stem with paired round leaves
// ─────────────────────────────────────────────────────────────
export function Leaf({ color = "#7AA672", accent = "#3F6B3A", ...props }: FlowerProps) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.6">
        {[18, 32, 46, 60, 74].map((y, i) => (
          <ellipse
            key={`w-${y}`}
            cx={i % 2 === 0 ? 42 : 78}
            cy={y}
            rx="14"
            ry="9"
            fill={color}
          />
        ))}
      </g>
      <g stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <path d="M 60 102 Q 60 60 60 14" />
      </g>
      <g stroke={INK} strokeWidth="1.1" fill={color} strokeLinejoin="round" opacity="0.95">
        {[18, 32, 46, 60, 74, 88].map((y, i) => {
          const left = i % 2 === 0;
          return (
            <g key={y}>
              <ellipse
                cx={left ? 42 : 78}
                cy={y}
                rx="13"
                ry="8"
                transform={`rotate(${left ? -25 : 25} ${left ? 42 : 78} ${y})`}
              />
              {/* central vein */}
              <line
                x1={left ? 30 : 90}
                y1={y + (left ? 5 : 5)}
                x2={left ? 54 : 66}
                y2={y - (left ? 5 : 5)}
                stroke={accent}
                strokeWidth="0.8"
                opacity="0.7"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Registry & seed mapping
// ─────────────────────────────────────────────────────────────
export type FlowerShape =
  | "rose"
  | "peony"
  | "dahlia"
  | "anemone"
  | "lily"
  | "daisy"
  | "sunflower"
  | "marigold"
  | "sprig"
  | "leaf";

export const FLOWER_COMPONENTS: Record<FlowerShape, FC<FlowerProps>> = {
  rose: Rose,
  peony: Peony,
  dahlia: Dahlia,
  anemone: Anemone,
  lily: Lily,
  daisy: Daisy,
  sunflower: Sunflower,
  marigold: Marigold,
  sprig: Sprig,
  leaf: Leaf,
};

/** Slug → shape + watercolor + accent. */
export const FLOWER_VISUALS: Record<
  string,
  { shape: FlowerShape; color: string; accent: string }
> = {
  "pink-rose": { shape: "peony", color: "#F08A92", accent: "#F5B82E" },
  "white-rose": { shape: "rose", color: "#F5DCD8", accent: "#C9A66B" },
  "coral-rose": { shape: "peony", color: "#F0857C", accent: "#F5B82E" },
  lisianthus: { shape: "lily", color: "#9F8AC9", accent: "#F5B82E" },
  ranunculus: { shape: "dahlia", color: "#E8377F", accent: "#F5B82E" },
  carnation: { shape: "dahlia", color: "#F08A92", accent: "#F5B82E" },
  marigold: { shape: "sunflower", color: "#F5B82E", accent: "#5C3A14" },
  jasmine: { shape: "sprig", color: "#FFFFFF", accent: "#3F6B3A" },
  "babys-breath": { shape: "sprig", color: "#FAFAFA", accent: "#3F6B3A" },
  eucalyptus: { shape: "leaf", color: "#7AA672", accent: "#3F6B3A" },
};

export function visualFor(slug: string) {
  return FLOWER_VISUALS[slug] ?? { shape: "peony" as const, color: "#F08A92", accent: "#F5B82E" };
}

export const STEM_COLOR = STEM;
