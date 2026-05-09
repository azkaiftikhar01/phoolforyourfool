import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateOrderNumber, formatPKR } from "@/lib/utils";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { EMAIL_TEMPLATES, notifyShop, sendEmail } from "@/lib/email";

const Schema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        productId: z.string().optional(),
        variantId: z.string().optional(),
        customBouquetId: z.string().optional(),
        name: z.string(),
        imageId: z.string().optional(),
        price: z.number().int().nonnegative(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
  }),
  address: z.object({
    recipient: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    zipCode: z.string().min(1),
  }),
  deliveryDate: z.string(),
  deliveryWindow: z.string().optional(),
  giftMessage: z.string().optional(),
  paymentMethod: z.literal("cod").optional(),
  total: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;
  const orderNumber = generateOrderNumber();
  const subtotal = data.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 350 : 0;
  const total = subtotal + shipping;

  // Customer + shop notifications run in parallel and don't block the response.
  const sendNotifications = async () => {
    const tpl = EMAIL_TEMPLATES.orderConfirmation(orderNumber, data.contact.name, formatPKR(total));
    const shop = EMAIL_TEMPLATES.shopOrderAlert(orderNumber, data.contact.name, formatPKR(total));
    await Promise.all([
      sendEmail({ to: data.contact.email, ...tpl }),
      notifyShop(shop),
    ]);
  };

  // If DB not configured, return a mock-confirmed order so the frontend flow still works.
  if (!isDatabaseConfigured()) {
    sendNotifications().catch(() => null);
    return NextResponse.json({
      orderNumber,
      mock: true,
      message: "Database not configured — mock order created.",
    });
  }

  const user = await getCurrentUser();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user?.id,
      guestEmail: user ? null : data.contact.email,
      guestName: user ? null : data.contact.name,
      guestPhone: user ? null : data.contact.phone,
      subtotal,
      shippingCost: shipping,
      total,
      paymentMethod: "cod",
      paymentStatus: "UNPAID",
      status: "CONFIRMED",
      deliveryDate: new Date(data.deliveryDate),
      deliveryWindow: data.deliveryWindow,
      giftMessage: data.giftMessage,
      items: {
        create: data.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          customBouquetId: i.customBouquetId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          imageId: i.imageId,
        })),
      },
    },
  });

  sendNotifications().catch(() => null);

  return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
}
