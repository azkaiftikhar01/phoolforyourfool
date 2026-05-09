import { getSiteSettings } from "@/lib/data/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <h1 className="font-display text-3xl text-brand-deep">Site settings</h1>
      <p className="mt-1 text-sm text-brand-ink/70">
        Edit the homepage hero image, headline copy and the testimonial section. Changes go live
        immediately on the next page load.
      </p>
      <div className="mt-6">
        <SiteSettingsForm initial={settings} />
      </div>
    </div>
  );
}
