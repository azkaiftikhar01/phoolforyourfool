import { notFound } from "next/navigation";
import { getGiftCardTemplates } from "@/lib/data/products";
import { GiftCardEditor } from "@/components/gift-cards/GiftCardEditor";

interface PageProps {
  params: { id: string };
}

export default async function GiftCardEditorPage({ params }: PageProps) {
  const templates = await getGiftCardTemplates();
  const template = templates.find((t) => t.id === params.id);
  if (!template) notFound();

  return (
    <section className="container-page py-12">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">{template.name}</h1>
      <p className="mt-2 text-sm text-brand-ink/70">
        Personalize your gift card. We'll deliver it to the recipient by email with a QR code.
      </p>
      <div className="mt-10">
        <GiftCardEditor template={template} />
      </div>
    </section>
  );
}
