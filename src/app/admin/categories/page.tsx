import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = isDatabaseConfigured()
    ? await prisma.category.findMany({ orderBy: { name: "asc" } })
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Categories</h1>
      <p className="mt-1 text-sm text-brand-ink/70">
        Categories appear as filter pills on the catalog and the navbar.
      </p>
      <div className="mt-6">
        <CategoryManager
          initial={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageId: c.imageId,
          }))}
        />
      </div>
    </div>
  );
}
