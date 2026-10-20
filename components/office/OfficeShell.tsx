import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OfficeFrame } from "@/components/office/OfficeFrame";
import { SIDEBAR_COOKIE, officeNavFor, officeNewLinksFor } from "@/components/office/office-nav";
import { getOfficeRequests, getOfficeSession } from "@/lib/http/office-session";

export async function OfficeShell({ children }: { children: React.ReactNode }) {
  const user = await getOfficeSession();
  if (!user) redirect("/office/login");

  const [cookieStore, requests] = await Promise.all([cookies(), getOfficeRequests()]);
  const newRequestCount = requests.filter((request) => request.status === "new").length;

  return (
    <OfficeFrame
      email={user.email}
      role={user.role}
      nav={officeNavFor(user)}
      newLinks={officeNewLinksFor(user)}
      newRequestCount={newRequestCount}
      startCollapsed={cookieStore.get(SIDEBAR_COOKIE)?.value === "collapsed"}
    >
      {children}
    </OfficeFrame>
  );
}
