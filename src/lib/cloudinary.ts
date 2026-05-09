/**
 * Browser-safe Cloudinary helpers.
 *
 * - `cldUrl()` builds optimized delivery URLs with smart cropping defaults.
 * - `cldSrcSet()` produces a `srcSet` string for responsive `<img>` use.
 *
 * Default optimization: every URL ends with `/f_auto/q_auto`.
 * Smart cropping defaults: `c_fill,g_auto` when both width + height are given.
 *
 * NOTE: For server-only operations (signed uploads, asset management) import
 * from `@/lib/cloudinary-server` instead — that module pulls in the Node SDK
 * which can't be bundled for the browser.
 */

export type CloudinaryCrop =
  | "fill"
  | "fit"
  | "scale"
  | "pad"
  | "limit"
  | "thumb"
  | "auto";

export type CloudinaryGravity =
  | "auto"
  | "face"
  | "faces"
  | "center"
  | "north"
  | "south"
  | "east"
  | "west";

export interface CloudinaryTransform {
  width?: number;
  height?: number;
  crop?: CloudinaryCrop;
  gravity?: CloudinaryGravity;
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "png" | "jpg" | "webp" | "avif";
  radius?: number | "max";
  blur?: number;
  effect?: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Build a Cloudinary delivery URL. Returns `null` if the cloud name isn't
 * configured (so callers can fall back to a placeholder/local image during dev).
 */
export function cldUrl(
  publicId: string,
  transform: CloudinaryTransform = {},
): string | null {
  if (!CLOUD_NAME) return null;
  if (!publicId) return null;

  const t = buildTransformString(transform);
  const path = t ? `${t}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}${publicId}`;
}

/**
 * Build a `srcSet` string for responsive image delivery.
 */
export function cldSrcSet(
  publicId: string,
  widths: number[],
  base: CloudinaryTransform = {},
): string {
  return widths
    .map((w) => {
      const url = cldUrl(publicId, { ...base, width: w });
      return url ? `${url} ${w}w` : "";
    })
    .filter(Boolean)
    .join(", ");
}

function buildTransformString(t: CloudinaryTransform): string {
  const components: string[] = [];

  // Resize / crop component
  const dim: string[] = [];
  const hasW = typeof t.width === "number";
  const hasH = typeof t.height === "number";
  const crop = t.crop ?? (hasW && hasH ? "fill" : "scale");
  dim.push(`c_${crop}`);
  if ((crop === "fill" || crop === "thumb" || crop === "auto") && (t.gravity ?? "auto")) {
    dim.push(`g_${t.gravity ?? "auto"}`);
  }
  if (hasW) dim.push(`w_${t.width}`);
  if (hasH) dim.push(`h_${t.height}`);

  if (dim.length > 1) components.push(dim.join(","));

  if (t.radius != null) components.push(`r_${t.radius}`);
  if (t.blur != null) components.push(`e_blur:${t.blur}`);
  if (t.effect) components.push(`e_${t.effect}`);

  // Optimization tail (always last unless caller opts out via specific format)
  const format = t.format ?? "auto";
  const quality = t.quality ?? "auto";
  components.push(`f_${format}`);
  components.push(`q_${quality}`);

  return components.join("/");
}
