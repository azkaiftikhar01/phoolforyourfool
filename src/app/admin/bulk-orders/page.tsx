import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";

export default async function AdminBulkOrdersPage() {
  const orders = isDatabaseConfigured()
    ? await prisma.bulkOrder.findMany({ orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Bulk orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-cream text-left text-xs uppercase tracking-wider text-brand-ink/70">
            <tr>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-ink/60">
                  No bulk requests yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-border/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-deep">{o.contactName}</div>
                    <div className="text-xs text-brand-ink/60">{o.contactEmail}</div>
                  </td>
                  <td className="px-4 py-3">{o.eventType}</td>
                  <td className="px-4 py-3">{new Date(o.eventDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{o.quantity}</td>
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
