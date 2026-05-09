import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { EMAIL_TEMPLATES, notifyShop, sendEmail } from "@/lib/email";

const Schema = z.object({
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(7),
  eventType: z.string(),
  eventDate: z.string(),
  quantity: z.number().int().min(1),
  budget: z.number().int().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const ack = EMAIL_TEMPLATES.bulkQuoteAck(parsed.data.contactName);
  const shop = EMAIL_TEMPLATES.shopBulkAlert(
    parsed.data.contactName,
    parsed.data.eventType,
    new Date(parsed.data.eventDate).toLocaleDateString(),
  );

  if (!isDatabaseConfigured()) {
    await Promise.all([
      sendEmail({ to: parsed.data.contactEmail, ...ack }),
      notifyShop(shop),
    ]);
    return NextResponse.json({ ok: true, mock: true });
  }

  const user = await getCurrentUser();
  const order = await prisma.bulkOrder.create({
    data: {
      ...parsed.data,
      eventDate: new Date(parsed.data.eventDate),
      userId: user?.id,
    },
  });
  await Promise.all([
    sendEmail({ to: parsed.data.contactEmail, ...ack }),
    notifyShop(shop),
  ]);
  return NextResponse.json({ ok: true, id: order.id });
}
