import { getSessionView } from "@/lib/auth/session-view";
import { countNewRequestsAs } from "@/lib/office/requests";

export async function GET() {
  const view = await getSessionView();
  if (!view) return Response.json({ ok: false }, { status: 401 });
  const newRequestCount = await countNewRequestsAs(view);
  return Response.json({ ok: true, ...view, newRequestCount });
}
