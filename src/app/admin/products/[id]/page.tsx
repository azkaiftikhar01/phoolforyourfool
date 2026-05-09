import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  if (!isDatabaseConfigured()) notFound();
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Edit product</h1>
      <p className="mt-1 text-sm text-brand-ink/70">{product.name}</p>
      <div className="mt-6">
        <ProductForm
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            basePrice: product.basePrice,
            imageId: product.imageId,
            imageIds: product.imageIds,
            stock: product.stock,
            type: product.type,
            categoryId: product.categoryId,
            featured: product.featured,
            active: product.active,
          }}
        />
      </div>
    </div>
  );
}
