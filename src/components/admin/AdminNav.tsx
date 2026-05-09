"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminNavProps {
  links: Array<{ href: string; label: string }>;
}

export function AdminNav({ links }: AdminNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside>
      <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Admin</p>
      <h2 className="mt-2 font-display text-2xl text-brand-deep">Phool Studio</h2>

      {/* Mobile: horizontal scrollable pills */}
      <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
              isActive(l.href)
                ? "border-brand-deep bg-brand-deep text-white"
                : "border-border bg-white text-brand-ink/80 hover:bg-brand-cream",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Desktop: vertical sidebar */}
      <nav className="mt-6 hidden flex-col gap-1 text-sm lg:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-xl px-3 py-2 transition",
              isActive(l.href)
                ? "bg-brand-deep text-white"
                : "text-brand-ink/80 hover:bg-white",
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
