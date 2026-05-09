import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = isDatabaseConfigured()
    ? await prisma.category.findMany({ orderBy: { name: "asc" } })
    : [];
  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">New product</h1>
      <p className="mt-1 text-sm text-brand-ink/70">
        Upload a primary image, optional gallery, and fill in the details. Images are stored in
        your Cloudinary account.
      </p>
      <div className="mt-6">
        <ProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
    </div>
  );
}
