"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account";
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "Login failed");
      setUser(j.user);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md card-soft">
      <h1 className="font-display text-3xl text-brand-deep">Welcome back</h1>
      <p className="mt-1 text-sm text-brand-ink/70">
        Sign in to track orders and save your favourites.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input className="input" name="email" type="email" placeholder="Email" required />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
        />
        {error ? (
          <p className="rounded-xl bg-brand-coral/10 px-3 py-2 text-sm text-brand-coral">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-brand-ink/70">
        New to Phool?{" "}
        <Link href="/register" className="font-medium text-brand-deep underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-12">
      <Suspense fallback={<div className="card-soft w-full max-w-md text-sm text-brand-ink/60">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
