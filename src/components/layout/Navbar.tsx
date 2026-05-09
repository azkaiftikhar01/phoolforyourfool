"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/products", label: "Flowers" },
  { href: "/products?category=bouquets", label: "Catalog" },
  { href: "/builder", label: "Build Your Own" },
  { href: "/gift-cards", label: "Gift Cards" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "border-b border-border/60 bg-white/80 backdrop-blur"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-14 items-center justify-between gap-2 sm:h-16 lg:h-20 lg:gap-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-brand-deep sm:text-xl lg:text-2xl"
        >
          Phool<span className="text-brand-coral">.</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-ink/80 transition hover:text-brand-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-brand-deep hover:bg-white/70 sm:inline-flex"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-brand-deep hover:bg-white/70"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-coral px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="rounded-full p-2 text-brand-deep hover:bg-white/70"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
            className="rounded-full p-2 text-brand-deep hover:bg-white/70 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-white/95 lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-brand-ink hover:bg-brand-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
