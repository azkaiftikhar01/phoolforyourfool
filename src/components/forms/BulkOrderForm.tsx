"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Wedding",
  "Mehendi",
  "Birthday",
  "Corporate",
  "Engagement",
  "Funeral",
  "Other",
] as const;

export function BulkOrderForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/bulk-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          quantity: Number(data.quantity),
          budget: data.budget ? Number(data.budget) : undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Could not submit request");
      }
      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card-soft">
        <h2 className="font-display text-2xl text-brand-deep">Request received</h2>
        <p className="mt-2 text-sm text-brand-ink/80">
          Thank you — our event team will reach out within 24 hours with a tailored quote.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-soft space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className="input" name="contactName" placeholder="Your name" required />
        <input className="input" name="contactEmail" type="email" placeholder="Email" required />
      </div>
      <input className="input" name="contactPhone" placeholder="Phone" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="input" name="eventType" defaultValue="Wedding" required>
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          className="input"
          name="eventDate"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="input"
          name="quantity"
          type="number"
          min={50}
          placeholder="Estimated quantity (50+)"
          required
        />
        <input className="input" name="budget" type="number" placeholder="Budget in PKR (optional)" />
      </div>
      <textarea
        className="input min-h-[120px]"
        name="notes"
        placeholder="Tell us about your vision — palettes, arrangements, on-site setup..."
      />
      {error ? (
        <p className="rounded-xl bg-brand-coral/10 px-3 py-2 text-sm text-brand-coral">{error}</p>
      ) : null}
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Submitting..." : "Request a quote"}
      </button>
    </form>
  );
}
