import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";

/**
 * Generates a PNG QR code for a gift card. PDF rendering is left for the
 * extended phase (use a server-side PDF generator like @react-pdf/renderer).
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const card = await prisma.giftCard.findUnique({ where: { id: params.id } });
  if (!card?.qrCodeData) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const png = await QRCode.toBuffer(card.qrCodeData, { type: "png", margin: 1, width: 256 });
  return new NextResponse(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
