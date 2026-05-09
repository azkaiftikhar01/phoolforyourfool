/**
 * Gmail SMTP email integration via nodemailer.
 *
 * Setup:
 *   1. Enable 2-Step Verification on the Gmail account.
 *   2. Generate an App Password at https://myaccount.google.com/apppasswords.
 *   3. Set GMAIL_USER and GMAIL_APP_PASSWORD in your .env.
 *
 * Without those env vars, `sendEmail()` simply logs the payload to the console
 * so local development still works without secrets.
 */

import type { Transporter } from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
  cc?: string;
  bcc?: string;
}

let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter | null> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (transporter) return transporter;

  const nodemailer = await import("nodemailer");
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: pass.replace(/\s+/g, "") },
  });
  return transporter;
}

export async function sendEmail(
  payload: EmailPayload,
): Promise<{ sent: boolean; mock?: boolean; error?: string }> {
  const t = await getTransporter();
  const fromName = process.env.GMAIL_FROM_NAME ?? "Phool For Your Fool";
  const fromEmail = process.env.GMAIL_USER;

  if (!t || !fromEmail) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email:mock]", payload.subject, "→", payload.to);
    }
    return { sent: false, mock: true };
  }

  try {
    await t.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    return { sent: true };
  } catch (err) {
    console.error("[email:error]", err);
    return { sent: false, error: err instanceof Error ? err.message : "Send failed" };
  }
}

/**
 * Notify the shop owner. Defaults to GMAIL_USER unless SHOP_NOTIFY_EMAIL is set.
 */
export async function notifyShop(payload: Omit<EmailPayload, "to">) {
  const to = process.env.SHOP_NOTIFY_EMAIL || process.env.GMAIL_USER;
  if (!to) return { sent: false, mock: true };
  return sendEmail({ ...payload, to });
}

export const EMAIL_TEMPLATES = {
  orderConfirmation: (orderNumber: string, name: string, total: string) => ({
    subject: `Order ${orderNumber} confirmed`,
    text: [
      `Hi ${name},`,
      "",
      `We've received your order ${orderNumber} (${total}).`,
      "Payment method: Cash on Delivery — please have the amount ready when our courier arrives.",
      "We'll send another email once your bouquet is on its way.",
      "",
      "With love,",
      "Phool For Your Fool",
    ].join("\n"),
    html: orderConfirmationHtml(orderNumber, name, total),
  }),
  orderDispatched: (orderNumber: string, name: string) => ({
    subject: `Order ${orderNumber} is on its way`,
    text: `Hi ${name},\n\nYour order ${orderNumber} has been dispatched and will arrive soon.`,
  }),
  reviewRequest: (orderNumber: string, name: string) => ({
    subject: `How were the flowers from order ${orderNumber}?`,
    text: `Hi ${name}, we'd love your feedback on the flowers from your recent order ${orderNumber}.`,
  }),
  bulkQuoteAck: (name: string) => ({
    subject: `We received your bulk order request`,
    text: `Hi ${name}, our event team will reach out within 24 hours with a tailored quote.`,
  }),
  shopOrderAlert: (orderNumber: string, customerName: string, total: string) => ({
    subject: `New COD order: ${orderNumber}`,
    text: `New order ${orderNumber} from ${customerName} for ${total}. Payment: Cash on Delivery.`,
  }),
  shopBulkAlert: (name: string, eventType: string, eventDate: string) => ({
    subject: `New bulk request: ${eventType} on ${eventDate}`,
    text: `${name} requested a bulk quote for ${eventType} on ${eventDate}. Open the admin panel to respond.`,
  }),
} as const;

function orderConfirmationHtml(orderNumber: string, name: string, total: string): string {
  return `<!doctype html>
<html><body style="font-family:Georgia,serif;background:#F8F6F3;padding:32px;color:#2E2A26">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:24px;padding:32px;box-shadow:0 4px 20px -8px rgba(255,153,153,.25)">
    <h1 style="font-size:28px;margin:0 0 8px">Thank you, ${escapeHtml(name)}.</h1>
    <p style="color:#7A7167;margin:0 0 24px">Your order <strong>${escapeHtml(orderNumber)}</strong> has been received.</p>
    <div style="background:linear-gradient(135deg,#FFB3BA,#FFD4A3);border-radius:16px;padding:20px;color:#2E2A26">
      <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.8">Order total</div>
      <div style="font-size:28px;font-weight:700">${escapeHtml(total)}</div>
      <div style="font-size:13px;margin-top:6px;opacity:.85">Cash on Delivery — pay your courier on arrival.</div>
    </div>
    <p style="margin-top:24px;color:#4A4A4A">We'll be in touch shortly with delivery details. For any questions, just reply to this email.</p>
    <p style="margin-top:32px;color:#7A7167;font-size:12px">With love,<br/>Phool For Your Fool</p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
