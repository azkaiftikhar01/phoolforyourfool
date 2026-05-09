"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import { useCartStore } from "@/store/cartStore";
import { formatPKR } from "@/lib/utils";
import type { GiftCardTemplateSummary } from "@/types";

interface GiftCardEditorProps {
  template: GiftCardTemplateSummary;
}

export function GiftCardEditor({ template }: GiftCardEditorProps) {
  const isCustom = template.price === 0;
  const [amount, setAmount] = useState(isCustom ? 1500 : template.price);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("Wishing you a bouquet of beautiful moments.");
  const add = useCartStore((s) => s.add);

  const valid = recipientName.trim().length > 0 && recipientEmail.includes("@") && amount >= 500;

  function handleAdd() {
    if (!valid) return;
    add({
      id: `gc-${template.id}-${Date.now()}`,
      name: `Gift Card · ${template.name}`,
      imageId: template.imageId,
      price: amount,
      quantity: 1,
      meta: {
        recipient: recipientName,
        email: recipientEmail,
        message,
      },
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card-soft">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-brand-pink/30">
          <CloudinaryImage
            publicId={template.imageId}
            fallbackSrc="/images/placeholder.svg"
            alt={template.name}
            width={1000}
            height={750}
            transform={{ width: 1000, height: 750, crop: "fill", gravity: "auto" }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 grid gap-1 text-sm text-brand-ink/80">
          <p>
            <strong className="text-brand-deep">To:</strong> {recipientName || "Recipient name"}
          </p>
          <p className="italic">"{message || "Your message"}"</p>
          <p className="font-display text-2xl text-brand-deep">{formatPKR(amount)}</p>
        </div>
      </div>

      <div className="card-soft space-y-3">
        <input
          className="input"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          placeholder="Recipient name"
        />
        <input
          className="input"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          type="email"
          placeholder="Recipient email"
        />
        <textarea
          className="input min-h-[100px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          maxLength={300}
        />
        {isCustom ? (
          <input
            className="input"
            type="number"
            min={500}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        ) : null}
        <button type="button" onClick={handleAdd} disabled={!valid} className="btn-primary w-full">
          Add gift card to cart · {formatPKR(amount)}
        </button>
        <p className="text-xs text-brand-ink/60">
          Cards are delivered as a PDF + QR code to the recipient's email after checkout.
        </p>
      </div>
    </div>
  );
}
