import { redirect } from "next/navigation";
import { SiteForm } from "@/components/office/SiteForm";
import { PageHead } from "@/components/office/ui/PageHead";
import { getOfficeSession } from "@/lib/http/office-session";
import { getSiteSettings } from "@/lib/http/site-content";

export default async function OfficeSitePage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const settings = await getSiteSettings();
  return (
    <>
      <PageHead title="Site details" description="Contact details and social links in the website header and footer." />
      <SiteForm settings={settings} />
    </>
  );
}
