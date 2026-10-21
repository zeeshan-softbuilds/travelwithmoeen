import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OfficeFrame } from "@/components/office/OfficeFrame";
import { SIDEBAR_COOKIE, officeNavFor, officeNewLinksFor } from "@/components/office/office-nav";
import { getOfficeSession } from "@/lib/http/office-session";

export async function OfficeShell({ children }: { children: React.ReactNode }) {
  const user = await getOfficeSession();
  if (!user) redirect("/office/login");

  const cookieStore = await cookies();

  return (
    <OfficeFrame
      email={user.email}
      role={user.role}
      nav={officeNavFor(user)}
      newLinks={officeNewLinksFor(user)}
      newRequestCount={user.newRequestCount}
      startCollapsed={cookieStore.get(SIDEBAR_COOKIE)?.value === "collapsed"}
    >
      {children}
    </OfficeFrame>
  );
}
