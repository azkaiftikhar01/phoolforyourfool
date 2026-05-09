import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/wishlist");
  return (
    <section className="container-page py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Wishlist</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Save bouquets to revisit them later. Tap the heart on any product card to add.
      </p>
      <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
        <p className="font-display text-2xl text-brand-deep">Coming soon</p>
        <p className="mt-2 text-sm text-brand-ink/70">
          Wishlist persistence ships in the next phase along with reviews.
        </p>
      </div>
    </section>
  );
}
