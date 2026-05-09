import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/addresses");
  return (
    <section className="container-page py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Addresses</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Manage delivery addresses for fast checkout.
      </p>
      <div className="mt-10 rounded-3xl border border-dashed border-border p-12 text-center">
        <p className="font-display text-2xl text-brand-deep">No saved addresses yet</p>
        <p className="mt-2 text-sm text-brand-ink/70">
          Addresses you use at checkout will be saved here automatically.
        </p>
      </div>
    </section>
  );
}
