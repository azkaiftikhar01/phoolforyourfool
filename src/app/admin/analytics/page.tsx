import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { formatPKR } from "@/lib/utils";

export default async function AdminAnalyticsPage() {
  const data = isDatabaseConfigured() ? await loadAnalytics() : null;

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Analytics</h1>
      {!data ? (
        <p className="mt-4 text-sm text-brand-ink/70">
          Connect a database to see analytics. The schema and queries are wired and ready.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Orders this month" value={data.monthlyOrders} />
          <Stat label="Revenue this month" value={formatPKR(data.monthlyRevenue)} />
          <Stat label="Avg. order value" value={formatPKR(data.avgOrder)} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-soft">
      <p className="text-xs uppercase tracking-widest text-brand-ink/60">{label}</p>
      <p className="mt-2 font-display text-2xl text-brand-deep">{value}</p>
    </div>
  );
}

async function loadAnalytics() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const [orders, revenueAgg, avgAgg] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: start }, paymentStatus: "PAID" },
    }),
    prisma.order.aggregate({ _avg: { total: true } }),
  ]);

  return {
    monthlyOrders: orders,
    monthlyRevenue: revenueAgg._sum.total ?? 0,
    avgOrder: Math.round(avgAgg._avg.total ?? 0),
  };
}
