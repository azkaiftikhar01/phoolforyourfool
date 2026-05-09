import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/data/fixtures";

const Schema = z.object({
  templateId: z.string(),
  recipientName: z.string().min(1),
  recipientEmail: z.string().email(),
  customMessage: z.string().max(500).optional(),
  amount: z.number().int().min(500),
});

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ templates: [] });
  }
  const templates = await prisma.giftCardTemplate.findMany({ where: { active: true } });
  return NextResponse.json({ templates });
}

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const user = await getCurrentUser();
  const code = `PFYF-GC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  const card = await prisma.giftCard.create({
    data: {
      ...parsed.data,
      balance: parsed.data.amount,
      code,
      userId: user?.id,
      qrCodeData: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/gift-cards/redeem?code=${code}`,
    },
  });
  return NextResponse.json({ giftCard: card });
}
