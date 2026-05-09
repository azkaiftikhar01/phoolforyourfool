"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          phone: data.get("phone"),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Registration failed");
      setUser(j.user);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-12">
      <div className="w-full max-w-md card-soft">
        <h1 className="font-display text-3xl text-brand-deep">Create your account</h1>
        <p className="mt-1 text-sm text-brand-ink/70">
          Save addresses, track deliveries and unlock loyalty perks.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input className="input" name="name" placeholder="Full name" required />
          <input className="input" name="email" type="email" placeholder="Email" required />
          <input className="input" name="phone" placeholder="Phone (optional)" />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
          />
          {error ? (
            <p className="rounded-xl bg-brand-coral/10 px-3 py-2 text-sm text-brand-coral">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-brand-ink/70">
          Already with us?{" "}
          <Link href="/login" className="font-medium text-brand-deep underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
