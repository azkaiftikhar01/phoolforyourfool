import { getFlowers } from "@/lib/data/products";
import { BouquetBuilder } from "@/components/builder/BouquetBuilder";

export const metadata = {
  title: "Custom Bouquet Builder",
  description:
    "Build your own bouquet, flower by flower. Pick your blooms, colors and size — we craft it fresh.",
};

export default async function BuilderPage() {
  const flowers = await getFlowers();
  return (
    <section className="container-page py-8 sm:py-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Build your own</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
          Compose your wonderland
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-brand-ink/70">
          Mix and match handpicked flowers, choose your colors and quantities. We'll arrange and
          deliver your custom bouquet within 24 hours.
        </p>
      </header>
      <div className="mt-8 sm:mt-10">
        <BouquetBuilder flowers={flowers} />
      </div>
    </section>
  );
}
