import { redirect } from "next/navigation";
import { SiteForm } from "@/components/office/SiteForm";
import { PageHead } from "@/components/office/ui/PageHead";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getSiteSettings } from "@/lib/http/site-content";

export default async function OfficeSitePage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const [settings, savedBy] = await Promise.all([getSiteSettings(), getSavedBy("site")]);
  return (
    <>
      <PageHead
        title="Site details"
        description="Contact details and social links in the website header and footer."
        savedBy={savedByText(savedBy[""], requestTime())}
      />
      <SiteForm settings={settings} />
    </>
  );
}
