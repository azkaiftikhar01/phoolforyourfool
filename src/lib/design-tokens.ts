/**
 * Brand design tokens for Phool For Your Fool.
 * Sourced from the provided pastel pink → orange palette and floral inspiration board.
 */

export const colors = {
  pink: "#FFB3BA",
  peach: "#FFCBA4",
  coral: "#FF9999",
  orange: "#FFD4A3",
  cream: "#F8F6F3",
  ink: "#4A4A4A",
  rose: "#F47B89",
  deep: "#2E2A26",
} as const;

export const typography = {
  display: {
    family: "Playfair Display, Georgia, serif",
    weights: [400, 600, 700] as const,
  },
  body: {
    family: "Poppins, system-ui, sans-serif",
    weights: [300, 400, 500, 600] as const,
  },
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  pill: "9999px",
} as const;

export const spacing = {
  pageMaxWidth: "1280px",
  sectionY: "5rem",
} as const;

export type ColorToken = keyof typeof colors;
