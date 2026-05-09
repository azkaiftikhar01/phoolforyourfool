import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, HeartHandshake, Smile, Image as ImageIcon } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { getFeaturedProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";

const FEATURE_HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Freshness Guaranteed",
    body: "Our flowers are handpicked daily to ensure the highest quality and ultimate freshness.",
  },
  {
    icon: Leaf,
    title: "Sustainability Matters",
    body: "We're committed to eco-friendly practices, from sourcing to packaging the flowers.",
  },
  {
    icon: HeartHandshake,
    title: "Artistic Arrangements",
    body: "We create unique, stunning artsy bouquets that make every occasion special.",
  },
  {
    icon: Smile,
    title: "Customer Delight",
    body: "Your satisfaction is our top priority — we go the extra mile to make you smile.",
  },
];

export default async function HomePage() {
  const [featured, settings] = await Promise.all([getFeaturedProducts(4), getSiteSettings()]);
  const testimonialIds = (
    ["testimonial.image.1", "testimonial.image.2", "testimonial.image.3", "testimonial.image.4"] as const
  )
    .map((k) => settings[k])
    .filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[400px] bg-hero-soft sm:h-[520px]" />

        <div className="container-page grid items-center gap-8 pt-8 pb-12 sm:pt-10 sm:pb-16 lg:grid-cols-12 lg:gap-6 lg:pt-16">
          {/* Headline */}
          <div className="text-center lg:col-span-5 lg:text-left">
            <p className="font-display text-2xl text-brand-ink/80 sm:text-3xl md:text-4xl">
              {settings["hero.eyebrow"]}
            </p>
            <h1 className="mt-1 font-display text-5xl font-bold leading-[0.95] text-brand-deep text-balance sm:text-7xl lg:text-[7rem]">
              {settings["hero.title"]}
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm text-brand-ink/80 sm:mt-6 sm:text-base lg:mx-0">
              {settings["hero.subtitle"]}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 lg:justify-start">
              <Link href="/products" className="btn-primary">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/builder" className="btn-secondary">
                Build Your Bouquet
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative lg:col-span-4">
            <div className="absolute inset-x-0 top-6 -z-10 mx-auto h-[80%] w-[78%] rounded-[3rem] bg-brand-pink/30" />
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem]">
              {settings["hero.image"] ? (
                <CloudinaryImage
                  publicId={settings["hero.image"]}
                  alt="Phool For Your Fool hero bouquet"
                  width={900}
                  height={1200}
                  priority
                  transform={{ width: 900, height: 1200, crop: "fill", gravity: "auto" }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <HeroPlaceholder />
              )}
            </div>
          </div>

          {/* Side copy */}
          <div className="hidden lg:col-span-3 lg:block">
            <p className="max-w-xs text-sm text-brand-ink/80">
              Our exquisite bouquets create moments of beauty and joy for every moment.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="container-page grid gap-3 pb-12 sm:gap-4 sm:pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card-soft animate-fade-up">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream text-brand-deep">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-brand-ink/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DISCOVER OUR FINEST SELECTION */}
      <section className="container-page py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Selection</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-brand-deep sm:text-4xl md:text-5xl">
              Discover Our<br /> Finest Selection
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-deep underline-offset-4 hover:underline"
          >
            View all flowers →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center text-sm text-brand-ink/60">
            No featured products yet — add some from the admin dashboard.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* TESTIMONIAL */}
      <section className="container-page pb-16 sm:pb-24">
        <div className="grid gap-8 rounded-3xl bg-white/70 p-6 shadow-card backdrop-blur sm:p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Loved by you</p>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-brand-deep sm:text-3xl md:text-4xl">
              "{settings["testimonial.quote"]}"
            </h3>
            <p className="mt-6 text-sm text-brand-ink/70">{settings["testimonial.author"]}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {testimonialIds.length === 0
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-2xl bg-brand-pink/30"
                  >
                    <HeroPlaceholder />
                  </div>
                ))
              : testimonialIds.map((id, i) => (
                  <div
                    key={`${id}-${i}`}
                    className="aspect-square overflow-hidden rounded-2xl bg-brand-pink/30"
                  >
                    <CloudinaryImage
                      publicId={id}
                      alt="Floral arrangement gifted by a customer"
                      width={600}
                      height={600}
                      transform={{ width: 600, height: 600, crop: "fill", gravity: "auto" }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
}

function HeroPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-pink via-brand-peach to-brand-orange">
      <div className="text-center text-brand-deep/60">
        <ImageIcon className="mx-auto h-10 w-10" />
        <p className="mt-2 text-xs">Upload from admin</p>
      </div>
    </div>
  );
}
