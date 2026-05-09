"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { slugify } from "@/lib/utils";

type ProductType = "BOUQUET" | "CROCHET" | "GAJRA" | "CUSTOM" | "SEASONAL" | "PREMIUM";

interface ProductFormProps {
  categories: Array<{ id: string; name: string }>;
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    imageId: string;
    imageIds: string[];
    stock: number;
    type: ProductType;
    categoryId: string;
    featured: boolean;
    active: boolean;
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(product?.basePrice ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [type, setType] = useState<ProductType>(product?.type ?? "BOUQUET");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [imageId, setImageId] = useState(product?.imageId ?? "");
  const [imageIds, setImageIds] = useState<string[]>(product?.imageIds ?? []);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [active, setActive] = useState(product?.active ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageId) {
      setError("Please upload a primary image.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      slug: slug || slugify(name),
      description,
      basePrice: Number(basePrice),
      stock: Number(stock),
      type,
      categoryId,
      imageId,
      imageIds,
      featured,
      active,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Save failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!product) return;
    if (!confirm(`Delete ${product.name}?`)) return;
    setSubmitting(true);
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="card-soft">
        <ImageUploader
          label="Primary image"
          folder="phoolforyourfool/products"
          value={imageId}
          onChange={setImageId}
          aspect="aspect-[4/5]"
        />
      </div>

      <div className="card-soft">
        <ImageUploader
          label="Gallery (optional)"
          folder="phoolforyourfool/products"
          values={imageIds}
          onChangeMulti={setImageIds}
          multiple
          aspect="aspect-[4/5]"
        />
      </div>

      <div className="card-soft grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            className="input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!isEdit) setSlug(slugify(e.target.value));
            }}
            required
          />
        </Field>
        <Field label="Slug">
          <input
            className="input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated"
          />
        </Field>
        <Field label="Category">
          <select
            className="input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.length === 0 ? (
              <option value="">No categories — create one first</option>
            ) : (
              categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </Field>
        <Field label="Type">
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value as ProductType)}
          >
            {(["BOUQUET", "CROCHET", "GAJRA", "CUSTOM", "SEASONAL", "PREMIUM"] as const).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Price (PKR)">
          <input
            className="input"
            type="number"
            min={0}
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Stock">
          <input
            className="input"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              className="input min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured (homepage)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active (visible on shop)
        </label>
      </div>

      {error ? (
        <p className="rounded-xl bg-brand-coral/10 px-3 py-2 text-sm text-brand-coral">{error}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
        {isEdit ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={submitting}
            className="btn-ghost text-brand-coral"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-widest text-brand-ink/70">
        {label}
      </span>
      {children}
    </label>
  );
}
