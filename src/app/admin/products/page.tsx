import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { formatPKR } from "@/lib/utils";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  const products = isDatabaseConfigured()
    ? await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      })
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand-deep">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-display text-xl text-brand-deep">No products yet</p>
          <p className="mt-2 text-sm text-brand-ink/70">
            Create your first product and upload its imagery.
          </p>
          <Link href="/admin/products/new" className="btn-primary mt-4 inline-flex">
            Add product
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="card-soft">
              <div className="flex gap-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-pink/30">
                  <CloudinaryImage
                    publicId={p.imageId}
                    fallbackSrc="/images/placeholder.svg"
                    alt={p.name}
                    width={200}
                    height={200}
                    transform={{ width: 200, height: 200, crop: "fill", gravity: "auto" }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg text-brand-deep">{p.name}</p>
                  <p className="text-xs text-brand-ink/60">{p.category?.name ?? "—"}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="font-medium text-brand-deep">{formatPKR(p.basePrice)}</span>
                    <span className="text-brand-ink/50">·</span>
                    <span className="text-brand-ink/70">stock {p.stock}</span>
                    {p.featured ? <span className="pill text-[10px]">Featured</span> : null}
                    {!p.active ? <span className="pill text-[10px]">Hidden</span> : null}
                  </div>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="mt-2 inline-block text-xs font-medium text-brand-coral underline-offset-4 hover:underline"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
