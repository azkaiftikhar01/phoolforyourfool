import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const Schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  imageId: z.string().min(1),
  basePrice: z.number().int().nonnegative(),
  colors: z.array(z.string()).default([]),
  stock: z.number().int().nonnegative().default(100),
});

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const flowers = await prisma.flower.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ flowers });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
  const flower = await prisma.flower.create({ data: { ...parsed.data, slug } });
  return NextResponse.json({ flower });
}
