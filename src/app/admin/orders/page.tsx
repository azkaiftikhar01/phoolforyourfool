import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { formatPKR } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = isDatabaseConfigured()
    ? await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-cream text-left text-xs uppercase tracking-wider text-brand-ink/70">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-ink/60">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium text-brand-deep">{o.orderNumber}</td>
                  <td className="px-4 py-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{formatPKR(o.total)}</td>
                  <td className="px-4 py-3">{o.paymentStatus}</td>
                  <td className="px-4 py-3">{o.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
