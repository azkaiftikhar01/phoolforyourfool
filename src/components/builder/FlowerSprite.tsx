/**
 * Renders a single flower extracted from the shared sprite sheet at
 * `/images/flowers-sheet.png`.
 *
 * The sheet is a 5×2 grid (611×612 px) of hand-painted watercolor flowers.
 * Each cell is laid out as: flower (top ~70%) + label (bottom ~30%).
 * We display only the flower portion by giving an SVG a tight `viewBox`
 * around that cell's flower region, then embedding the full sheet inside.
 *
 * Because everything is vector-cropped, the output stays crisp at any
 * rendered size and the entire sheet is downloaded once and cached.
 */

import type { SVGProps } from "react";

const SHEET_URL = "/images/flowers-sheet.png";

// Internal SVG units. We pick clean numbers — what matters is the *ratio*
// to the cell size, not the literal source pixels. Source is 611×612 px,
// 5 columns × 2 rows. So 1 column ≈ 122 px and 1 row ≈ 306 px. We model
// it as 500 wide × 500 tall and crop just the upper ~70% of each cell.
const SHEET_W = 500;
const SHEET_H = 500;
const CELL_W = SHEET_W / 5; // 100
const ROW_H = SHEET_H / 2; // 250
const FLOWER_H = 175; // ~70% of ROW_H — keeps labels out of frame
/**
 * Trim a few units from each cell edge to skip the dark hairline border
 * around the original image (the very leftmost and topmost pixel rows of
 * the source sheet are not white but contain stray dark ink).
 */
const EDGE_INSET = 3;

/** Slug → grid coordinate (col, row) in the sheet. */
export const SPRITE_SLOTS: Record<string, { col: number; row: number }> = {
  "babys-breath": { col: 0, row: 0 },
  carnation: { col: 1, row: 0 },
  "coral-rose": { col: 2, row: 0 },
  eucalyptus: { col: 3, row: 0 },
  jasmine: { col: 4, row: 0 },
  lisianthus: { col: 0, row: 1 },
  marigold: { col: 1, row: 1 },
  "pink-rose": { col: 2, row: 1 },
  ranunculus: { col: 3, row: 1 },
  "white-rose": { col: 4, row: 1 },
};

/** Whether we have a sprite cell mapped for the given slug. */
export function hasSprite(slug: string): boolean {
  return slug in SPRITE_SLOTS;
}

interface FlowerSpriteProps extends SVGProps<SVGSVGElement> {
  slug: string;
}

export function FlowerSprite({ slug, style, ...props }: FlowerSpriteProps) {
  const slot = SPRITE_SLOTS[slug];
  if (!slot) return null;
  const x = slot.col * CELL_W + EDGE_INSET;
  const y = slot.row * ROW_H + EDGE_INSET;
  const w = CELL_W - EDGE_INSET * 2;
  const h = FLOWER_H - EDGE_INSET * 2;
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      // High-quality resampling — keeps watercolor + ink crisp when the
      // sprite is scaled up beyond its native ~122px cell width.
      style={{ imageRendering: "auto", ...style }}
      {...props}
    >
      <image
        href={SHEET_URL}
        x="0"
        y="0"
        width={SHEET_W}
        height={SHEET_H}
        preserveAspectRatio="none"
        style={{ imageRendering: "-webkit-optimize-contrast" }}
      />
    </svg>
  );
}

/** Aspect ratio (width / height) of a single sprite cell — useful for
 *  sizing containers without distortion. */
export const SPRITE_ASPECT = `${CELL_W} / ${FLOWER_H}`;
