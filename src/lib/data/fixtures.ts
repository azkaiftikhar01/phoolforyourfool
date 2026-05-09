/**
 * Static fallback dataset used when the database isn't configured (e.g. local
 * dev before running `prisma migrate`). Mirrors the seed script.
 */

import type {
  CategorySummary,
  FlowerSummary,
  GiftCardTemplateSummary,
  ProductSummary,
} from "@/types";

export const FIXTURE_CATEGORIES: CategorySummary[] = [
  { id: "cat-bouquets", name: "Bouquets", slug: "bouquets", description: "Hand-tied bouquets for every occasion." },
  { id: "cat-crochet", name: "Crochet Flowers", slug: "crochet", description: "Forever-blooming crochet bouquets." },
  { id: "cat-gajra", name: "Gajra", slug: "gajra", description: "Traditional jasmine gajra and garlands." },
  { id: "cat-seasonal", name: "Seasonal", slug: "seasonal", description: "Limited-time seasonal arrangements." },
  { id: "cat-premium", name: "Premium", slug: "premium", description: "Curated premium collections." },
];

export const FIXTURE_PRODUCTS: ProductSummary[] = [
  {
    id: "p-enchanted",
    name: "Enchanted Garden",
    slug: "enchanted-garden",
    description:
      "A romantic mix of pink roses, lisianthus and eucalyptus tied with a satin ribbon.",
    basePrice: 7999,
    imageId: "phoolforyourfool/products/enchanted-garden",
    type: "BOUQUET",
    rating: 4.8,
    reviewCount: 124,
    stock: 30,
    categoryId: "cat-bouquets",
    categorySlug: "bouquets",
    featured: true,
  },
  {
    id: "p-corsage",
    name: "Cute Corsage Flower",
    slug: "cute-corsage-flower",
    description: "A delicate corsage perfect for weddings and special evenings.",
    basePrice: 2999,
    imageId: "phoolforyourfool/products/cute-corsage",
    type: "BOUQUET",
    rating: 4.6,
    reviewCount: 58,
    stock: 60,
    categoryId: "cat-bouquets",
    categorySlug: "bouquets",
    featured: true,
  },
  {
    id: "p-sunset",
    name: "Sunset Peach Bouquet",
    slug: "sunset-peach-bouquet",
    description: "Peach roses, ranunculus and golden mums — a warm sunset in your hands.",
    basePrice: 5499,
    imageId: "phoolforyourfool/products/sunset-peach",
    type: "BOUQUET",
    rating: 4.9,
    reviewCount: 89,
    stock: 40,
    categoryId: "cat-bouquets",
    categorySlug: "bouquets",
    featured: true,
  },
  {
    id: "p-jasmine",
    name: "Classic Jasmine Gajra",
    slug: "classic-jasmine-gajra",
    description: "Fresh jasmine gajra strung daily for hair and wrists.",
    basePrice: 1499,
    imageId: "phoolforyourfool/products/jasmine-gajra",
    type: "GAJRA",
    rating: 4.9,
    reviewCount: 212,
    stock: 120,
    categoryId: "cat-gajra",
    categorySlug: "gajra",
    featured: true,
  },
  {
    id: "p-crochet",
    name: "Forever Crochet Bouquet",
    slug: "forever-crochet-bouquet",
    description: "Hand-crocheted bouquet that lasts forever — perfect keepsake.",
    basePrice: 4999,
    imageId: "phoolforyourfool/products/crochet-forever",
    type: "CROCHET",
    rating: 4.7,
    reviewCount: 41,
    stock: 25,
    categoryId: "cat-crochet",
    categorySlug: "crochet",
  },
  {
    id: "p-pastel",
    name: "Pastel Dream",
    slug: "pastel-dream",
    description: "Soft pastel mix of carnations, roses and baby's breath.",
    basePrice: 4499,
    imageId: "phoolforyourfool/products/pastel-dream",
    type: "BOUQUET",
    rating: 4.5,
    reviewCount: 33,
    stock: 35,
    categoryId: "cat-bouquets",
    categorySlug: "bouquets",
  },
  {
    id: "p-golden",
    name: "Golden Hour Premium",
    slug: "golden-hour-premium",
    description: "A premium arrangement of orange roses and golden eucalyptus.",
    basePrice: 12999,
    imageId: "phoolforyourfool/products/golden-hour",
    type: "PREMIUM",
    rating: 5,
    reviewCount: 18,
    stock: 12,
    categoryId: "cat-premium",
    categorySlug: "premium",
  },
  {
    id: "p-marigold",
    name: "Mehendi Marigold Strands",
    slug: "mehendi-marigold-strands",
    description: "Vibrant marigold strands for mehendi and event decor.",
    basePrice: 2499,
    imageId: "phoolforyourfool/products/marigold-strands",
    type: "GAJRA",
    rating: 4.7,
    reviewCount: 64,
    stock: 80,
    categoryId: "cat-gajra",
    categorySlug: "gajra",
  },
];

export const FIXTURE_FLOWERS: FlowerSummary[] = [
  { id: "f-pink-rose", name: "Pink Rose", slug: "pink-rose", basePrice: 250, colors: ["pink", "blush"], imageId: "phoolforyourfool/flowers/pink-rose" },
  { id: "f-white-rose", name: "White Rose", slug: "white-rose", basePrice: 250, colors: ["white", "ivory"], imageId: "phoolforyourfool/flowers/white-rose" },
  { id: "f-coral-rose", name: "Coral Rose", slug: "coral-rose", basePrice: 280, colors: ["coral", "peach"], imageId: "phoolforyourfool/flowers/coral-rose" },
  { id: "f-lisianthus", name: "Lisianthus", slug: "lisianthus", basePrice: 320, colors: ["white", "pink", "purple"], imageId: "phoolforyourfool/flowers/lisianthus" },
  { id: "f-ranunculus", name: "Ranunculus", slug: "ranunculus", basePrice: 380, colors: ["peach", "pink", "yellow"], imageId: "phoolforyourfool/flowers/ranunculus" },
  { id: "f-carnation", name: "Carnation", slug: "carnation", basePrice: 180, colors: ["pink", "white", "red"], imageId: "phoolforyourfool/flowers/carnation" },
  { id: "f-marigold", name: "Marigold", slug: "marigold", basePrice: 100, colors: ["orange", "yellow"], imageId: "phoolforyourfool/flowers/marigold" },
  { id: "f-jasmine", name: "Jasmine", slug: "jasmine", basePrice: 200, colors: ["white"], imageId: "phoolforyourfool/flowers/jasmine" },
  { id: "f-babys-breath", name: "Baby's Breath", slug: "babys-breath", basePrice: 150, colors: ["white"], imageId: "phoolforyourfool/flowers/babys-breath" },
  { id: "f-eucalyptus", name: "Eucalyptus", slug: "eucalyptus", basePrice: 200, colors: ["green"], imageId: "phoolforyourfool/flowers/eucalyptus" },
];

export const FIXTURE_GIFT_CARDS: GiftCardTemplateSummary[] = [
  { id: "gc-pastel", name: "Pastel Bloom", price: 500, description: "Pastel Bloom digital gift card", imageId: "phoolforyourfool/gift-cards/pastel-bloom" },
  { id: "gc-coral", name: "Coral Hour", price: 1000, description: "Coral Hour digital gift card", imageId: "phoolforyourfool/gift-cards/coral-hour" },
  { id: "gc-wonder", name: "Wonderland", price: 2500, description: "Wonderland digital gift card", imageId: "phoolforyourfool/gift-cards/wonderland" },
  { id: "gc-eternal", name: "Eternal Gold", price: 5000, description: "Eternal Gold digital gift card", imageId: "phoolforyourfool/gift-cards/eternal-gold" },
  { id: "gc-custom", name: "Custom Amount", price: 0, description: "Choose your own amount", imageId: "phoolforyourfool/gift-cards/custom" },
];

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && !url.includes("user:password@localhost"));
}
