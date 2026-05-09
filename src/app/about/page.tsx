export const metadata = {
  title: "About Phool",
  description:
    "Phool For Your Fool is a Pakistan-based studio crafting bouquets, gajra and crochet flowers for every emotion.",
};

export default function AboutPage() {
  return (
    <section className="container-page py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Our story</p>
      <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
        Crafting moments, one bloom at a time
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-ink/80">
        Phool For Your Fool was born from a love of soft pastels, traditional gajra and
        modern arrangements. Every bouquet is sourced from local growers, hand-tied in our
        Karachi studio, and delivered with care across Pakistan.
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-ink/80">
        We believe in sustainable practices, recyclable wrapping, and partnering with
        farmers who treat their land with the same care as we treat your moments.
      </p>
    </section>
  );
}
