import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { href: "/products", label: "All Flowers" },
    { href: "/products?category=bouquets", label: "Bouquets" },
    { href: "/products?category=crochet", label: "Crochet Flowers" },
    { href: "/products?category=gajra", label: "Gajra" },
  ],
  Create: [
    { href: "/builder", label: "Custom Bouquet Builder" },
    { href: "/gift-cards", label: "Gift Cards" },
    { href: "/bulk-orders", label: "Bulk & Event Orders" },
  ],
  Help: [
    { href: "/account/orders", label: "Track an Order" },
    { href: "/about", label: "About Us" },
    { href: "/policies/delivery", label: "Delivery Policy" },
    { href: "/policies/refund", label: "Refund Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-white/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link
            href="/"
            className="font-display text-2xl font-semibold tracking-tight text-brand-deep"
          >
            Phool<span className="text-brand-coral">.</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-brand-ink/70">
            Discover Phool For Your Fool — where the artistry of flowers blends with your
            emotions. Handpicked bouquets and bespoke arrangements delivered across Pakistan.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="rounded-full bg-white p-2 shadow-soft transition hover:bg-brand-cream"
            >
              <Instagram className="h-4 w-4 text-brand-deep" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="rounded-full bg-white p-2 shadow-soft transition hover:bg-brand-cream"
            >
              <Facebook className="h-4 w-4 text-brand-deep" />
            </a>
            <a
              href="mailto:hello@phoolforyourfool.com"
              aria-label="Email"
              className="rounded-full bg-white p-2 shadow-soft transition hover:bg-brand-cream"
            >
              <Mail className="h-4 w-4 text-brand-deep" />
            </a>
            <a
              href="tel:+923000000000"
              aria-label="Phone"
              className="rounded-full bg-white p-2 shadow-soft transition hover:bg-brand-cream"
            >
              <Phone className="h-4 w-4 text-brand-deep" />
            </a>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="font-display text-sm uppercase tracking-widest text-brand-ink/70">
              {heading}
            </h4>
            <ul className="mt-4 space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-ink/80 transition hover:text-brand-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-ink/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Phool For Your Fool. All rights reserved.</p>
          <p>Crafted with care in Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
