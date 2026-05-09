"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";

interface Flower {
  id: string;
  name: string;
  slug: string;
  imageId: string;
  basePrice: number;
  colors: string[];
}

interface FlowerManagerProps {
  initial: Flower[];
}

export function FlowerManager({ initial }: FlowerManagerProps) {
  const router = useRouter();
  const [list, setList] = useState<Flower[]>(initial);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(250);
  const [colors, setColors] = useState("pink, blush");
  const [imageId, setImageId] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!name.trim() || !imageId) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          imageId,
          basePrice: Number(price),
          colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
        }),
      });
      const j = await res.json();
      if (j.flower) {
        setList((prev) => [...prev, j.flower]);
        setName("");
        setImageId("");
        setColors("pink, blush");
        setPrice(250);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this flower from the builder?")) return;
    await fetch(`/api/admin/flowers/${id}`, { method: "DELETE" });
    setList((prev) => prev.filter((f) => f.id !== id));
    router.refresh();
  }

  async function updateImage(id: string, newImageId: string) {
    await fetch(`/api/admin/flowers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: newImageId }),
    });
    setList((prev) => prev.map((f) => (f.id === id ? { ...f, imageId: newImageId } : f)));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card-soft">
        <h3 className="font-display text-lg text-brand-deep">Add a flower</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            className="input"
            placeholder="Flower name (e.g. Pink Rose)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Price per stem (PKR)"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <input
          className="input mt-3"
          placeholder="Colors (comma separated)"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        />
        <div className="mt-4">
          <ImageUploader
            label="Image"
            folder="phoolforyourfool/flowers"
            value={imageId}
            onChange={setImageId}
            aspect="aspect-square"
          />
        </div>
        <button
          type="button"
          onClick={add}
          disabled={busy || !name || !imageId}
          className="btn-primary mt-4"
        >
          <Plus className="h-4 w-4" /> Add flower
        </button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <li key={f.id} className="card-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-brand-deep">{f.name}</p>
                <p className="text-xs text-brand-ink/60">PKR {f.basePrice} · {f.colors.join(", ")}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(f.id)}
                className="rounded-full p-2 text-brand-ink/60 hover:bg-brand-coral/10 hover:text-brand-coral"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3">
              <ImageUploader
                folder="phoolforyourfool/flowers"
                value={f.imageId}
                onChange={(v) => updateImage(f.id, v)}
                aspect="aspect-square"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
