import { BulkOrderForm } from "@/components/forms/BulkOrderForm";

export const metadata = {
  title: "Bulk & Event Orders",
  description:
    "Custom floral packages for weddings, mehendi, corporate events and birthdays. Get a tailored quote in 24 hours.",
};

export default function BulkOrdersPage() {
  return (
    <section className="container-page py-8 sm:py-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Events</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
          Bulk & event orders
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-brand-ink/70">
          Tell us about your event. Our team curates a tailored quote with floral palettes,
          arrangements and decor — usually within 24 hours.
        </p>
      </header>
      <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-[1fr_360px] lg:gap-10">
        <BulkOrderForm />
        <aside className="card-soft h-fit">
          <h3 className="font-display text-2xl text-brand-deep">What you can expect</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-ink/80">
            <li>• Tiered pricing for 50+ stems</li>
            <li>• Custom palettes & arrangement styles</li>
            <li>• On-site setup options</li>
            <li>• Mehendi marigolds, gajra, table centrepieces</li>
            <li>• Dedicated event coordinator</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
