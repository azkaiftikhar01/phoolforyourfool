import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/data/fixtures";

const Schema = z.object({
  name: z.string().optional(),
  totalPrice: z.number().int().nonnegative(),
  notes: z.string().max(1000).optional(),
  flowers: z
    .array(
      z.object({
        flowerId: z.string(),
        quantity: z.number().int().min(1),
        color: z.string().optional(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const user = await getCurrentUser();

  const bouquet = await prisma.customBouquet.create({
    data: {
      name: parsed.data.name,
      totalPrice: parsed.data.totalPrice,
      notes: parsed.data.notes,
      userId: user?.id,
      flowers: {
        create: parsed.data.flowers,
      },
    },
    include: { flowers: true },
  });
  return NextResponse.json({ bouquet });
}
