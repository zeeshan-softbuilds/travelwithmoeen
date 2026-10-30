"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { officeFormAction } from "@/lib/http/office-client";
import type { SiteSettings } from "@/lib/content-types";
import type { ActionResult } from "@/lib/http/result";

const SOCIAL: { name: keyof SiteSettings; label: string }[] = [
  { name: "facebookUrl", label: "Facebook" },
  { name: "instagramUrl", label: "Instagram" },
  { name: "tiktokUrl", label: "TikTok" },
  { name: "youtubeUrl", label: "YouTube" },
];

export function SiteForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await officeFormAction("/api/office/site")(previous, formData);
    // The page reads the saved details and "Last saved" again.
    if (result.ok) router.refresh();
    return result;
  }, null as ActionResult | null);

  return (
    <form action={action} className="stack">
      <Card title="Contact" description="Shown in the website header and footer.">
        <div className="form-grid">
          <Field id="site-phone" label="Phone" help="As guests should see it.">
            <input className="input" id="site-phone" name="phoneDisplay" type="tel" autoComplete="tel" defaultValue={settings.phoneDisplay} required aria-describedby="site-phone-help" />
          </Field>
          <Field id="site-whatsapp" label="WhatsApp number" help="Digits only, with 92 first.">
            <input className="input" id="site-whatsapp" name="phoneE164" inputMode="numeric" defaultValue={settings.phoneE164} required aria-describedby="site-whatsapp-help" />
          </Field>
          <Field id="site-email" label="Email">
            <input className="input" id="site-email" name="email" type="email" autoComplete="email" defaultValue={settings.email} required />
          </Field>
          <Field id="site-map" label="Map link" optional>
            <input className="input" id="site-map" name="mapsUrl" defaultValue={settings.mapsUrl} />
          </Field>
          <div className="field full">
            <label className="label" htmlFor="site-address">
              Address
            </label>
            <textarea className="textarea" id="site-address" name="address" rows={2} defaultValue={settings.address} required />
          </div>
        </div>
      </Card>
      <Card title="Social links" description="Leave a link empty to hide its icon.">
        <div className="form-grid">
          {SOCIAL.map((link) => (
            <Field key={link.name} id={`site-${link.name}`} label={link.label} optional>
              <input className="input" id={`site-${link.name}`} name={link.name} defaultValue={settings[link.name]} />
            </Field>
          ))}
        </div>
      </Card>
      <SaveBar label="Save site details" pending={pending} result={state} />
    </form>
  );
}
