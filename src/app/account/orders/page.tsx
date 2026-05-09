import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { formatPKR } from "@/lib/utils";

interface PageProps {
  searchParams: { placed?: string };
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/orders");

  const orders = isDatabaseConfigured()
    ? await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      })
    : [];

  return (
    <section className="container-page py-8 sm:py-12">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl md:text-5xl">Your orders</h1>
      {searchParams.placed ? (
        <p className="mt-3 rounded-xl bg-brand-pink/30 px-4 py-3 text-sm text-brand-deep">
          Order <strong>{searchParams.placed}</strong> placed successfully. We'll be in touch shortly.
        </p>
      ) : null}

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-2xl text-brand-deep">No orders yet</p>
          <p className="mt-2 text-sm text-brand-ink/70">
            Browse our flowers and place your first order.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Shop flowers
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="card-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-brand-deep">{o.orderNumber}</p>
                  <p className="text-xs text-brand-ink/60">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="pill">{o.status}</span>
                <p className="font-display text-lg">{formatPKR(o.total)}</p>
              </div>
              <ul className="mt-3 text-sm text-brand-ink/80">
                {o.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
