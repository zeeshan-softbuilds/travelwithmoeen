import { requireUser } from "@/lib/auth/session";
import { latestActivityAs, listActivityAs } from "@/lib/office/activity";

// Read only. With no kind: the newest rows the role may read. With kind, and optionally one or
// more record values: the newest row for each record, which is "Saved by" on a screen.
export async function GET(request: Request) {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind");
  if (!kind) return Response.json(await listActivityAs(actor, Number(params.get("limit") ?? undefined)));
  const result = await latestActivityAs(actor, kind, params.getAll("record"));
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: "status" in result ? 403 : 400 });
  }
  return Response.json(result);
}
