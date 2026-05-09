import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/account/LogoutButton";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  return (
    <section className="container-page py-8 sm:py-12">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
        Hi, {user.name}
      </h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Manage your orders, addresses and wishlist.
      </p>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/account/orders" className="card-soft block transition hover:shadow-soft">
          <h3 className="font-display text-2xl text-brand-deep">Orders</h3>
          <p className="mt-1 text-sm text-brand-ink/70">Track recent and past orders.</p>
        </Link>
        <Link href="/account/wishlist" className="card-soft block transition hover:shadow-soft">
          <h3 className="font-display text-2xl text-brand-deep">Wishlist</h3>
          <p className="mt-1 text-sm text-brand-ink/70">Bouquets you saved for later.</p>
        </Link>
        <Link href="/account/addresses" className="card-soft block transition hover:shadow-soft">
          <h3 className="font-display text-2xl text-brand-deep">Addresses</h3>
          <p className="mt-1 text-sm text-brand-ink/70">Manage delivery addresses.</p>
        </Link>
      </div>

      <div className="mt-10">
        <LogoutButton />
      </div>
    </section>
  );
}
