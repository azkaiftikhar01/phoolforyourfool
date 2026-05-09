import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/data/fixtures";

const Schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2).max(120),
  content: z.string().min(2).max(2000),
});

export async function GET(req: Request) {
  if (!isDatabaseConfigured()) return NextResponse.json({ reviews: [] });
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const reviews = await prisma.review.findMany({
    where: productId ? { productId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const review = await prisma.review.upsert({
    where: { productId_userId: { productId: parsed.data.productId, userId: user.id } },
    create: { ...parsed.data, userId: user.id },
    update: parsed.data,
  });
  return NextResponse.json({ review });
}
