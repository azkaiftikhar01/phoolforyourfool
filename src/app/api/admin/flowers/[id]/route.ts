import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const PatchSchema = z.object({
  name: z.string().min(2).optional(),
  imageId: z.string().optional(),
  basePrice: z.number().int().nonnegative().optional(),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const flower = await prisma.flower.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ flower });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.flower.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
