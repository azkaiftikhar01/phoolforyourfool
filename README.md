# Phool For Your Fool

Your Floral Wonderland — a Next.js 14 e-commerce foundation for handpicked bouquets,
crochet flowers, gajra and custom creations delivered across Pakistan.

This repo is the **full-foundation pass** described in the implementation plan: it
ships the architectural skeleton plus working homepage, catalog, cart, auth, checkout,
gift cards, custom bouquet builder, bulk-order intake, admin dashboard skeleton,
SEO, offline fallback, and Cloudinary-powered media delivery.

## Tech stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Zustand, Lucide icons
- **Backend**: Next.js Route Handlers, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: bcryptjs + JWT (jose) via httpOnly cookie
- **Media**: Cloudinary (primary upload, optimization, delivery)
- **Payments**: Cash on Delivery (online gateway can be added later)
- **Email**: Gmail SMTP via nodemailer (App Password) with safe local fallback
- **State**: Zustand stores with `localStorage` persistence
- **Validation**: Zod
- **PWA**: minimal service worker with offline fallback

## Project structure

```
src/
  app/                      # App Router pages + API routes
    (public)                # homepage, products, builder, gift-cards, bulk-orders, about
    account/                # protected user pages
    admin/                  # admin dashboard skeleton
    api/                    # auth, products, orders, gift-cards, reviews, wishlists, bulk-orders
    offline/                # service-worker fallback page
  components/               # layout, products, builder, gift-cards, forms, shared
  lib/
    auth.ts                 # JWT + bcrypt session helpers
    cloudinary.ts           # URL builder + server SDK
    email.ts                # Gmail SMTP integration with mock fallback
    prisma.ts               # singleton Prisma client
    data/                   # data access (Prisma + fixture fallback)
    utils.ts                # PKR formatting, slugify, order numbers
    design-tokens.ts        # brand color and typography tokens
  store/                    # Zustand stores (auth, cart)
  middleware.ts             # protected route enforcement
prisma/
  schema.prisma             # full data model
  seed.ts                   # categories, products, flowers, gift cards, admin user
public/
  sw.js                     # offline fallback service worker
  manifest.webmanifest      # PWA manifest
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, etc.

# 3. Set up the database
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start the app
npm run dev
```

The app runs at <http://localhost:3000>.

> **Tip:** the homepage, catalog and builder render even before you connect a
> database — the data layer falls back to in-repo fixtures whenever
> `DATABASE_URL` still points at the example value. This makes the visual
> foundation reviewable instantly. Auth and order creation, however, do require
> a live PostgreSQL database.

## Cloudinary integration

Cloudinary is the **primary media layer** for product images, gift cards,
testimonials and the custom bouquet builder. The helper in
[`src/lib/cloudinary.ts`](src/lib/cloudinary.ts) builds optimized URLs with
smart cropping defaults and always appends `f_auto/q_auto`:

```ts
cldUrl("phoolforyourfool/products/enchanted-garden", {
  width: 800,
  height: 1000,
  crop: "fill",
  gravity: "auto",
});
// → https://res.cloudinary.com/<cloud>/image/upload/c_fill,g_auto,w_800,h_1000/f_auto/q_auto/phoolforyourfool/products/enchanted-garden
```

Use the [`<CloudinaryImage>`](src/components/shared/CloudinaryImage.tsx) wrapper
to drop responsive Cloudinary delivery into any `next/image` slot. It falls
back gracefully to a placeholder when no cloud name is configured.

For server-side uploads or signed URL flows, use `getCloudinaryServer()` and
`signedUploadParams()` from the same module.

> The Cloudinary MCP plugin installed in this workspace can authenticate against
> your Cloudinary account directly from Cursor (asset management, environment
> config, analysis). Run those tools when you're ready to upload your real
> imagery into the public IDs the seed file expects.

## Auth model

- Passwords hashed with `bcryptjs`.
- Sessions issued as JWTs (HS256) signed with `JWT_SECRET`.
- Session cookie: `pfyf_session` (httpOnly, sameSite=lax, 30 days).
- `src/middleware.ts` protects `/account/*`, `/checkout/*`, `/admin/*`.
- Admin role bootstrapped via `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD`.

## Payments

Currently **Cash on Delivery only**. Customers pay the courier in cash when
their bouquet arrives.

The `Order` table still tracks `paymentMethod` and `paymentStatus`, so adding
an online gateway later (Razorpay, Stripe, JazzCash, Easypaisa) is a drop-in:
add a new endpoint, set `paymentMethod` to the gateway name, mark `paymentStatus`
as `PAID` on success.

## Email (Gmail SMTP)

We use nodemailer with Gmail's `service: "gmail"` transport, authenticated by
an **App Password**. To configure:

1. Turn on **2-Step Verification** for the Gmail account you want to send from.
2. Visit <https://myaccount.google.com/apppasswords> and generate a 16-character
   App Password (label it "Phool For Your Fool").
3. Set in `.env.local`:
   ```
   GMAIL_USER="your.address@gmail.com"
   GMAIL_APP_PASSWORD="abcdabcdabcdabcd"  # no spaces
   GMAIL_FROM_NAME="Phool For Your Fool"
   SHOP_NOTIFY_EMAIL=""                   # optional, defaults to GMAIL_USER
   ```

`sendEmail()` and `notifyShop()` in `src/lib/email.ts` use the transport
transparently. Without those env vars, both functions log to the console and
return `{ sent: false, mock: true }` — useful for local dev.

Built-in templates: order confirmation, order dispatched, review request,
bulk-quote acknowledgement, plus shop-side alerts for new COD orders and bulk
requests.

## SEO & performance

- Per-route metadata + dynamic product `Metadata`.
- JSON-LD schema on product detail pages.
- Edge-rendered Open Graph image at `/opengraph-image`.
- Dynamic `/sitemap.xml` and `/robots.txt`.
- Next.js Image with AVIF/WebP, Cloudinary `f_auto/q_auto`, lazy loading.
- Service worker caches the app shell + provides `/offline` fallback.

## Deployment

Recommended deployment target: **Vercel**.

```bash
# Build locally to verify
npm run build
```

Set the same env vars from `.env.example` in your Vercel project settings.
For PostgreSQL, use any managed provider (Neon, Railway, Supabase). Run
`prisma migrate deploy` as part of your CI step.

## Roadmap (next phases)

- Wire Cloudinary signed uploads into an admin product CRUD form.
- Server-rendered PDF gift-card generation (`@react-pdf/renderer`).
- Order tracking page with live status timeline.
- Reviews UI on product detail (API already in place).
- Wishlist persistence on `/account/wishlist`.
- Abandoned-cart email scheduler.
- Analytics charts (Recharts).
- Sentry error reporting.
- Online payment gateway (Razorpay / JazzCash / Easypaisa) when ready.
