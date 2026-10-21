import { redirect } from "next/navigation";
import { requestTime } from "@/components/office/format";
import { RequestsInbox } from "@/components/office/requests/RequestsInbox";
import { isRequestStatus } from "@/components/office/requests/request-labels";
import { PageHead } from "@/components/office/ui/PageHead";
import { getOfficeRequests, getOfficeSession } from "@/lib/http/office-session";

type RequestsSearch = { status?: string; id?: string };

export default async function RequestsPage({ searchParams }: { searchParams: Promise<RequestsSearch> }) {
  const actor = await getOfficeSession();
  if (!actor) redirect("/office/login");
  const [rows, search] = await Promise.all([getOfficeRequests(), searchParams]);
  const status = isRequestStatus(search.status) ? search.status : "";
  const id = Number(search.id);

  return (
    <>
      <PageHead title="Requests" description="Messages, custom trips, and bookings from the website." />
      <RequestsInbox
        rows={rows}
        now={requestTime()}
        canUpdateStatus={actor.canUpdateRequestStatus}
        canDelete={actor.canDeleteRequest}
        initialStatus={status}
        initialId={Number.isInteger(id) && id > 0 ? id : null}
      />
    </>
  );
}
