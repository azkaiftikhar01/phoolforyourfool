import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/flowers", label: "Builder Flowers" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/bulk-orders", label: "Bulk Orders" },
  { href: "/admin/site-settings", label: "Site Settings" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="container-page py-6 sm:py-10 lg:py-12">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-8">
        <AdminNav links={ADMIN_LINKS} />
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
