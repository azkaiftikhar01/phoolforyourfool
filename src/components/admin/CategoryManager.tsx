"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageId?: string | null;
}

interface CategoryManagerProps {
  initial: Category[];
}

export function CategoryManager({ initial }: CategoryManagerProps) {
  const router = useRouter();
  const [list, setList] = useState<Category[]>(initial);
  const [name, setName] = useState("");
  const [imageId, setImageId] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageId: imageId || undefined }),
      });
      const j = await res.json();
      if (j.category) {
        setList((prev) => [...prev, j.category]);
        setName("");
        setImageId("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  async function updateImage(id: string, newImageId: string) {
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: newImageId }),
    });
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, imageId: newImageId } : c)));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card-soft">
        <h3 className="font-display text-lg text-brand-deep">Add a category</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            className="input"
            placeholder="Category name (e.g. Bouquets)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="button" onClick={add} disabled={busy} className="btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        <div className="mt-4">
          <ImageUploader
            label="Optional image"
            folder="phoolforyourfool/categories"
            value={imageId}
            onChange={setImageId}
            aspect="aspect-[4/3]"
          />
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((c) => (
          <li key={c.id} className="card-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-brand-deep">{c.name}</p>
                <p className="text-xs text-brand-ink/60">/{c.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="rounded-full p-2 text-brand-ink/60 hover:bg-brand-coral/10 hover:text-brand-coral"
                aria-label="Delete category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3">
              <ImageUploader
                folder="phoolforyourfool/categories"
                value={c.imageId ?? ""}
                onChange={(v) => updateImage(c.id, v)}
                aspect="aspect-[4/3]"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
