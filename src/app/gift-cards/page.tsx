import Link from "next/link";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { getGiftCardTemplates } from "@/lib/data/products";
import { formatPKR } from "@/lib/utils";

export const metadata = {
  title: "Gift Cards",
  description: "Send the gift of flowers — digital gift cards for any occasion.",
};

export default async function GiftCardsPage() {
  const templates = await getGiftCardTemplates();

  return (
    <section className="container-page py-8 sm:py-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Gift cards</p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
          Give a wonderland
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-brand-ink/70">
          Choose a design, write a message and we'll deliver a beautiful digital card with a QR
          code redeemable across our entire collection.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((g) => (
          <Link
            key={g.id}
            href={`/gift-cards/${g.id}`}
            className="card-soft group block transition hover:shadow-soft"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-pink/30">
              <CloudinaryImage
                publicId={g.imageId}
                fallbackSrc="/images/placeholder.svg"
                alt={g.name}
                width={800}
                height={600}
                transform={{ width: 800, height: 600, crop: "fill", gravity: "auto" }}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-display text-xl text-brand-deep">{g.name}</h3>
              <p className="font-display text-lg">
                {g.price === 0 ? "Custom" : formatPKR(g.price)}
              </p>
            </div>
            {g.description ? (
              <p className="mt-1 text-sm text-brand-ink/70">{g.description}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
