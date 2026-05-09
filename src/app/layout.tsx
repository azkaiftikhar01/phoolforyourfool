import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ServiceWorkerRegister } from "@/components/shared/ServiceWorkerRegister";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://phoolforyourfool.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Phool For Your Fool – Your Floral Wonderland",
    template: "%s · Phool For Your Fool",
  },
  description:
    "Handpicked bouquets, crochet flowers, gajra and custom creations delivered across Pakistan. Build your own floral wonderland.",
  keywords: [
    "flower delivery",
    "bouquets",
    "Pakistan flowers",
    "crochet flowers",
    "gajra",
    "wedding flowers",
    "Phool For Your Fool",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Phool For Your Fool",
    title: "Phool For Your Fool – Your Floral Wonderland",
    description:
      "Handpicked bouquets, crochet flowers, gajra and custom creations delivered across Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phool For Your Fool",
    description: "Your Floral Wonderland — bouquets, gajra, crochet flowers and more.",
  },
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#FFB3BA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-brand-cream">
        <Navbar />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
