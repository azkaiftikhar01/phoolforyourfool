import { PrismaClient, ProductType, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Categories ---
  const categories = await Promise.all(
    [
      {
        name: "Bouquets",
        slug: "bouquets",
        description: "Hand-tied bouquets for every occasion.",
        imageId: "phoolforyourfool/categories/bouquets",
      },
      {
        name: "Crochet Flowers",
        slug: "crochet",
        description: "Forever-blooming crochet bouquets.",
        imageId: "phoolforyourfool/categories/crochet",
      },
      {
        name: "Gajra",
        slug: "gajra",
        description: "Traditional jasmine gajra and garlands.",
        imageId: "phoolforyourfool/categories/gajra",
      },
      {
        name: "Seasonal",
        slug: "seasonal",
        description: "Limited-time seasonal arrangements.",
        imageId: "phoolforyourfool/categories/seasonal",
      },
      {
        name: "Premium",
        slug: "premium",
        description: "Curated premium collections.",
        imageId: "phoolforyourfool/categories/premium",
      },
    ].map((data) =>
      prisma.category.upsert({ where: { slug: data.slug }, create: data, update: data }),
    ),
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  // --- Products ---
  const products: Array<{
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    imageId: string;
    type: ProductType;
    categorySlug: string;
    stock: number;
    featured?: boolean;
  }> = [
    {
      name: "Enchanted Garden",
      slug: "enchanted-garden",
      description:
        "A romantic mix of pink roses, lisianthus and eucalyptus tied with a satin ribbon.",
      basePrice: 7999,
      imageId: "phoolforyourfool/products/enchanted-garden",
      type: ProductType.BOUQUET,
      categorySlug: "bouquets",
      stock: 30,
      featured: true,
    },
    {
      name: "Cute Corsage Flower",
      slug: "cute-corsage-flower",
      description: "A delicate corsage perfect for weddings and special evenings.",
      basePrice: 2999,
      imageId: "phoolforyourfool/products/cute-corsage",
      type: ProductType.BOUQUET,
      categorySlug: "bouquets",
      stock: 60,
      featured: true,
    },
    {
      name: "Sunset Peach Bouquet",
      slug: "sunset-peach-bouquet",
      description:
        "Peach roses, ranunculus and golden mums — a warm sunset in your hands.",
      basePrice: 5499,
      imageId: "phoolforyourfool/products/sunset-peach",
      type: ProductType.BOUQUET,
      categorySlug: "bouquets",
      stock: 40,
      featured: true,
    },
    {
      name: "Classic Jasmine Gajra",
      slug: "classic-jasmine-gajra",
      description: "Fresh jasmine gajra strung daily for hair and wrists.",
      basePrice: 1499,
      imageId: "phoolforyourfool/products/jasmine-gajra",
      type: ProductType.GAJRA,
      categorySlug: "gajra",
      stock: 120,
      featured: true,
    },
    {
      name: "Forever Crochet Bouquet",
      slug: "forever-crochet-bouquet",
      description: "Hand-crocheted bouquet that lasts forever — perfect keepsake.",
      basePrice: 4999,
      imageId: "phoolforyourfool/products/crochet-forever",
      type: ProductType.CROCHET,
      categorySlug: "crochet",
      stock: 25,
    },
    {
      name: "Pastel Dream",
      slug: "pastel-dream",
      description: "Soft pastel mix of carnations, roses and baby's breath.",
      basePrice: 4499,
      imageId: "phoolforyourfool/products/pastel-dream",
      type: ProductType.BOUQUET,
      categorySlug: "bouquets",
      stock: 35,
    },
    {
      name: "Golden Hour Premium",
      slug: "golden-hour-premium",
      description: "A premium arrangement of orange roses and golden eucalyptus.",
      basePrice: 12999,
      imageId: "phoolforyourfool/products/golden-hour",
      type: ProductType.PREMIUM,
      categorySlug: "premium",
      stock: 12,
    },
    {
      name: "Mehendi Marigold Strands",
      slug: "mehendi-marigold-strands",
      description: "Vibrant marigold strands for mehendi and event decor.",
      basePrice: 2499,
      imageId: "phoolforyourfool/products/marigold-strands",
      type: ProductType.GAJRA,
      categorySlug: "gajra",
      stock: 80,
    },
  ];

  for (const p of products) {
    const { categorySlug, ...rest } = p;
    const category = bySlug[categorySlug];
    if (!category) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: { ...rest, categoryId: category.id },
      update: { ...rest, categoryId: category.id },
    });
  }

  // --- Flowers (custom builder) ---
  const flowers = [
    { name: "Pink Rose", slug: "pink-rose", basePrice: 250, colors: ["pink", "blush"] },
    { name: "White Rose", slug: "white-rose", basePrice: 250, colors: ["white", "ivory"] },
    { name: "Coral Rose", slug: "coral-rose", basePrice: 280, colors: ["coral", "peach"] },
    { name: "Lisianthus", slug: "lisianthus", basePrice: 320, colors: ["white", "pink", "purple"] },
    { name: "Ranunculus", slug: "ranunculus", basePrice: 380, colors: ["peach", "pink", "yellow"] },
    { name: "Carnation", slug: "carnation", basePrice: 180, colors: ["pink", "white", "red"] },
    { name: "Marigold", slug: "marigold", basePrice: 100, colors: ["orange", "yellow"] },
    { name: "Jasmine", slug: "jasmine", basePrice: 200, colors: ["white"] },
    { name: "Baby's Breath", slug: "babys-breath", basePrice: 150, colors: ["white"] },
    { name: "Eucalyptus", slug: "eucalyptus", basePrice: 200, colors: ["green"] },
  ];
  for (const f of flowers) {
    // Leave imageId blank so the bouquet builder falls through to the
    // shared watercolor sprite. Admin uploads in /admin/flowers will set
    // a real Cloudinary public ID, and we never overwrite it on re-seed.
    await prisma.flower.upsert({
      where: { slug: f.slug },
      create: {
        ...f,
        imageId: "",
        stock: 200,
      },
      update: {
        // Refresh metadata only — keep any admin-uploaded image intact.
        name: f.name,
        basePrice: f.basePrice,
        colors: f.colors,
      },
    });
  }

  // --- Gift Card Templates ---
  const templates = [
    { name: "Pastel Bloom", price: 500 },
    { name: "Coral Hour", price: 1000 },
    { name: "Wonderland", price: 2500 },
    { name: "Eternal Gold", price: 5000 },
    { name: "Custom Amount", price: 0 },
  ];
  for (const t of templates) {
    await prisma.giftCardTemplate.upsert({
      where: { name: t.name },
      create: {
        ...t,
        description: `${t.name} digital gift card`,
        imageId: `phoolforyourfool/gift-cards/${t.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: {
        description: `${t.name} digital gift card`,
        price: t.price,
      },
    });
  }

  // --- Bootstrap admin + sample customer ---
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL ?? "admin@phoolforyourfool.com";
  const adminPwd = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "ChangeMeNow!2026";
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Phool Admin",
      password: await bcrypt.hash(adminPwd, 10),
      role: Role.ADMIN,
    },
    update: {},
  });

  // --- Site Settings (defaults; admin can replace via /admin/site-settings) ---
  const defaultSettings: Array<[string, string]> = [
    ["hero.eyebrow", "Apke Fool kay liye"],
    ["hero.title", "Phool."],
    [
      "hero.subtitle",
      "Pyaar ho ya maafi, gajra ho ya gulaab — Pakistan bhar mein hand-picked bouquets ki khushbu, sirf ek click mein.",
    ],
    [
      "testimonial.quote",
      "Mere pyaar ko phool bhejne ka aisa tareeqa pehle nahi mila. Phool ne hamari saalgirah ko sach mein wonderland bana diya.",
    ],
    ["testimonial.author", "— Aisha, Karachi"],
  ];
  for (const [key, value] of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      // Re-run seed = refresh the marketing copy. Image keys are NOT touched
      // here so admin uploads are preserved across re-seeds.
      update: { value },
    });
  }
  // Empty image placeholders — only insert if missing, never overwrite.
  for (const key of [
    "hero.image",
    "testimonial.image.1",
    "testimonial.image.2",
    "testimonial.image.3",
    "testimonial.image.4",
  ]) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: "" },
      update: {},
    });
  }

  await prisma.user.upsert({
    where: { email: "demo@phoolforyourfool.com" },
    create: {
      email: "demo@phoolforyourfool.com",
      name: "Demo Customer",
      password: await bcrypt.hash("demo1234", 10),
      role: Role.CUSTOMER,
    },
    update: {},
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
