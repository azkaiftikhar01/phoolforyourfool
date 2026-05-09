/**
 * Sample pixels from flowers-sheet.png to calibrate the transparency
 * thresholds. Picks coordinates known to be background card vs watercolor
 * vs ink, prints their RGB values.
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../public/images/flowers-sheet.png");

const img = sharp(SRC).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const W = info.width;

function px(x, y) {
  const i = (y * W + x) * info.channels;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

console.log(`Image: ${info.width} × ${info.height}, ${info.channels} channels`);
console.log("Sampling card-bg corners (expect near-white):");
console.log("  (1, 1) =", px(1, 1));
console.log("  (60, 5) =", px(60, 5));
console.log("  (5, 80) =", px(5, 80));
console.log("Sampling between cells (expect very white gutter):");
console.log("  (122, 100) =", px(122, 100));
console.log("Sampling watercolor centers:");
console.log("  Carnation head (~150, 70) =", px(150, 70));
console.log("  Coral Rose head (~275, 70) =", px(275, 70));
console.log("  Marigold head (~150, 380) =", px(150, 380));
console.log("Sampling ink:");
console.log("  Carnation outline (~135, 110) =", px(135, 110));
