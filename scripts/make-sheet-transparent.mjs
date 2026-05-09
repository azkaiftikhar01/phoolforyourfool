/**
 * One-off script: read public/images/flowers-sheet.png, make near-white card
 * backgrounds transparent, leave watercolor + ink fully intact. Run with:
 *   node scripts/make-sheet-transparent.mjs
 *
 * Tuned to the actual sheet (sampled with scripts/inspect-sheet.mjs):
 *   - Card-bg pixels:    (254,254,251) (243,243,238) — chroma < 0.03
 *   - Coral Rose head:   (246,149,127) — chroma 0.47
 *   - Carnation head:    (132,94,88)   — chroma 0.17
 *   - Marigold head:     (102,45,10)   — chroma 0.36
 *
 * Logic:
 *   1. If pixel chroma (max-min) ≥ CHROMA_PROTECT, it has color → keep opaque.
 *   2. Otherwise it is grayscale-ish. If whiteness ≥ HARD_KILL → fully transparent.
 *      Between SOFT_KILL and HARD_KILL we apply a small smooth falloff so
 *      anti-aliased edges of letters / faint smudges fade gracefully.
 *   3. Below SOFT_KILL keep opaque (this preserves dark ink lines).
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "../public/images/flowers-sheet.png");
const DEST = SRC;

const CHROMA_PROTECT = 0.06; // any chroma above this → never knock out
const HARD_KILL = 0.94; // whiteness above this → alpha 0
const SOFT_KILL = 0.88; // whiteness below this → fully opaque

const SQRT3 = Math.sqrt(3);

async function main() {
  const img = sharp(SRC).ensureAlpha();
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(info.width * info.height * 4);
  const channels = info.channels;

  let killed = 0;
  let kept = 0;
  let smoothed = 0;

  for (let p = 0; p < info.width * info.height; p++) {
    const i = p * channels;
    const j = p * 4;
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const a = (data[i + 3] ?? 255) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    let alpha = a;

    if (chroma < CHROMA_PROTECT) {
      const dist = Math.sqrt(
        (1 - r) * (1 - r) + (1 - g) * (1 - g) + (1 - b) * (1 - b),
      );
      const whiteness = 1 - dist / SQRT3;

      if (whiteness >= HARD_KILL) {
        alpha = 0;
        killed++;
      } else if (whiteness > SOFT_KILL) {
        const t = (whiteness - SOFT_KILL) / (HARD_KILL - SOFT_KILL);
        alpha = a * (1 - t);
        smoothed++;
      } else {
        kept++;
      }
    } else {
      kept++;
    }

    out[j] = data[i];
    out[j + 1] = data[i + 1];
    out[j + 2] = data[i + 2];
    out[j + 3] = Math.round(alpha * 255);
  }

  // Upscale 2× with lanczos3 (preserves edges) and mild sharpen so the
  // watercolor + ink stays crisp at display sizes larger than the source
  // 122px-wide cells. Browser's bilinear upscale is much softer than this.
  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(info.width * 2, info.height * 2, { kernel: "lanczos3" })
    .sharpen({ sigma: 0.7 })
    .png({ compressionLevel: 9 })
    .toFile(DEST);

  const total = info.width * info.height;
  console.log(`Source: ${info.width}×${info.height} (${total} pixels)`);
  console.log(
    `  knocked out (alpha=0): ${killed}  (${((killed / total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `  smooth falloff:        ${smoothed}  (${((smoothed / total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `  kept opaque:           ${kept}  (${((kept / total) * 100).toFixed(1)}%)`,
  );
  console.log(`Wrote: ${DEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
