import { isDatabaseConfigured } from "./fixtures";

export const SETTING_KEYS = [
  "hero.eyebrow",
  "hero.title",
  "hero.subtitle",
  "hero.image",
  "testimonial.quote",
  "testimonial.author",
  "testimonial.image.1",
  "testimonial.image.2",
  "testimonial.image.3",
  "testimonial.image.4",
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number];

const DEFAULTS: Record<SettingKey, string> = {
  "hero.eyebrow": "Apke Fool kay liye",
  "hero.title": "Phool.",
  "hero.subtitle":
    "Pyaar ho ya maafi, gajra ho ya gulaab — Pakistan bhar mein hand-picked bouquets ki khushbu, sirf ek click mein.",
  "hero.image": "",
  "testimonial.quote":
    "Mere pyaar ko phool bhejne ka aisa tareeqa pehle nahi mila. Phool ne hamari saalgirah ko sach mein wonderland bana diya.",
  "testimonial.author": "— Aisha, Karachi",
  "testimonial.image.1": "",
  "testimonial.image.2": "",
  "testimonial.image.3": "",
  "testimonial.image.4": "",
};

export type SiteSettings = Record<SettingKey, string>;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isDatabaseConfigured()) return { ...DEFAULTS };
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...SETTING_KEYS] } },
    });
    const map: SiteSettings = { ...DEFAULTS };
    for (const r of rows) {
      if ((SETTING_KEYS as readonly string[]).includes(r.key)) {
        map[r.key as SettingKey] = r.value;
      }
    }
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveSiteSettings(values: Partial<SiteSettings>) {
  const { prisma } = await import("@/lib/prisma");
  const entries = Object.entries(values).filter(
    ([k]) => (SETTING_KEYS as readonly string[]).includes(k),
  );
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value: value ?? "" },
        update: { value: value ?? "" },
      }),
    ),
  );
}
