import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { formatPKR } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const stats = isDatabaseConfigured()
    ? await loadStats()
    : { orders: 0, revenue: 0, customers: 0, products: 0, lowStock: 0 };

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total orders" value={stats.orders} />
        <Stat label="Revenue" value={formatPKR(stats.revenue)} />
        <Stat label="Customers" value={stats.customers} />
        <Stat label="Products" value={stats.products} />
      </div>
      <div className="card-soft mt-8">
        <h3 className="font-display text-xl text-brand-deep">Inventory health</h3>
        <p className="mt-1 text-sm text-brand-ink/70">
          {stats.lowStock} product{stats.lowStock === 1 ? "" : "s"} with stock below 10 units.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card-soft">
      <p className="text-xs uppercase tracking-widest text-brand-ink/60">{label}</p>
      <p className="mt-2 font-display text-3xl text-brand-deep">{value}</p>
    </div>
  );
}

async function loadStats() {
  const [orderCount, revenueAgg, customers, productCount, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
  ]);
  return {
    orders: orderCount,
    revenue: revenueAgg._sum.total ?? 0,
    customers,
    products: productCount,
    lowStock,
  };
}
