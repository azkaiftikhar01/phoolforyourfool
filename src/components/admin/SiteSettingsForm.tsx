"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./ImageUploader";
import type { SiteSettings } from "@/lib/data/settings";

interface SiteSettingsFormProps {
  initial: SiteSettings;
}

export function SiteSettingsForm({ initial }: SiteSettingsFormProps) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      setSaved(true);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="card-soft space-y-4">
        <h2 className="font-display text-xl text-brand-deep">Hero section</h2>
        <ImageUploader
          label="Hero image"
          folder="phoolforyourfool/hero"
          value={s["hero.image"]}
          onChange={(v) => set("hero.image", v)}
          aspect="aspect-[3/4]"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow text">
            <input
              className="input"
              value={s["hero.eyebrow"]}
              onChange={(e) => set("hero.eyebrow", e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              className="input"
              value={s["hero.title"]}
              onChange={(e) => set("hero.title", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea
            className="input min-h-[100px]"
            value={s["hero.subtitle"]}
            onChange={(e) => set("hero.subtitle", e.target.value)}
          />
        </Field>
      </section>

      <section className="card-soft space-y-4">
        <h2 className="font-display text-xl text-brand-deep">Testimonial</h2>
        <Field label="Quote">
          <textarea
            className="input min-h-[100px]"
            value={s["testimonial.quote"]}
            onChange={(e) => set("testimonial.quote", e.target.value)}
          />
        </Field>
        <Field label="Author">
          <input
            className="input"
            value={s["testimonial.author"]}
            onChange={(e) => set("testimonial.author", e.target.value)}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          {([1, 2, 3, 4] as const).map((i) => {
            const key = `testimonial.image.${i}` as const;
            return (
              <ImageUploader
                key={key}
                label={`Testimonial image ${i}`}
                folder="phoolforyourfool/testimonials"
                value={s[key]}
                onChange={(v) => set(key, v)}
                aspect="aspect-square"
              />
            );
          })}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : "Save settings"}
        </button>
        {saved ? <span className="text-sm text-brand-coral">Saved.</span> : null}
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
