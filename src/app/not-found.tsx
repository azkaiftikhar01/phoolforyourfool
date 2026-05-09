import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">404</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
          We couldn't find that bloom
        </h1>
        <p className="mt-3 max-w-md text-sm text-brand-ink/70">
          The page you're looking for might have moved or wilted. Try our latest collection.
        </p>
        <Link href="/products" className="btn-primary mt-6 inline-flex">
          Browse flowers
        </Link>
      </div>
    </section>
  );
}
