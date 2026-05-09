import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/data/fixtures";
import { FlowerManager } from "@/components/admin/FlowerManager";

export default async function AdminFlowersPage() {
  const flowers = isDatabaseConfigured()
    ? await prisma.flower.findMany({ orderBy: { name: "asc" } })
    : [];
  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Builder flowers</h1>
      <p className="mt-1 text-sm text-brand-ink/70">
        Manage the per-stem flowers shown in the custom bouquet builder.
      </p>
      <div className="mt-6">
        <FlowerManager
          initial={flowers.map((f) => ({
            id: f.id,
            name: f.name,
            slug: f.slug,
            imageId: f.imageId,
            basePrice: f.basePrice,
            colors: f.colors,
          }))}
        />
      </div>
    </div>
  );
}
