import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const Schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(2),
  basePrice: z.number().int().nonnegative(),
  imageId: z.string().min(1),
  imageIds: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(0),
  type: z.enum(["BOUQUET", "CROCHET", "GAJRA", "CUSTOM", "SEASONAL", "PREMIUM"]),
  categoryId: z.string(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
  const product = await prisma.product.create({
    data: { ...parsed.data, slug },
  });
  return NextResponse.json({ product });
}
