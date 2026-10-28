import { requireUser, type SessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/http/result";

export async function handleOfficeForm(
  request: Request,
  run: (actor: SessionUser, formData: FormData) => Promise<ActionResult>,
  refresh?: (formData: FormData, result: Extract<ActionResult, { ok: true }>) => void,
) {
  let actor: SessionUser;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  // T-41: a missing body, or one that is not a form, is the sender's mistake, not a server fault.
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Send the form again." }, { status: 400 });
  }
  const result = await run(actor, formData);
  if (result.ok && refresh) refresh(formData, result);
  if (!result.ok && result.status === 403) {
    return Response.json({ ok: false, error: result.error }, { status: 403 });
  }
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 400 });
  }
  return Response.json(result);
}
