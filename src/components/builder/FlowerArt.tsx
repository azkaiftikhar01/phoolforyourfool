"use client";

import Image from "next/image";
import { cldUrl } from "@/lib/cloudinary";
import { FLOWER_COMPONENTS, visualFor } from "./flower-svgs";
import { FlowerSprite, hasSprite } from "./FlowerSprite";

interface FlowerArtProps {
  /** Cloudinary public ID. Empty string falls back to sprite or SVG. */
  imageId?: string;
  /** Seed slug used to pick the sprite slot or SVG fallback. */
  slug: string;
  /** Alt text. */
  name: string;
  /** Tailwind classes for sizing — e.g. "h-full w-full" or "h-auto w-full". */
  className?: string;
  /**
   * Pixel hint for Cloudinary delivery width. The image is resized to fit
   * inside this box (no cropping or padding) so the artwork stays intact.
   */
  size?: number;
}

/**
 * Resolves the artwork for a flower in this priority order:
 *   1. Admin-uploaded Cloudinary image (per-flower `imageId`)
 *   2. Cell from the shared watercolor sprite sheet at /images/flowers-sheet.png
 *   3. Inline watercolor SVG fallback
 */
export function FlowerArt({
  imageId,
  slug,
  name,
  className,
  size = 600,
}: FlowerArtProps) {
  const url = imageId ? cldUrl(imageId, { width: size, crop: "fit" }) : null;

  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={size}
        height={size}
        sizes={`${size}px`}
        className={className}
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
      />
    );
  }

  if (hasSprite(slug)) {
    return (
      <FlowerSprite
        slug={slug}
        role="img"
        aria-label={name}
        className={className}
      />
    );
  }

  const visual = visualFor(slug);
  const Shape = FLOWER_COMPONENTS[visual.shape];
  return (
    <Shape color={visual.color} accent={visual.accent} className={className} />
  );
}
