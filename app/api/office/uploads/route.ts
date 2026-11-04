import { requireUser } from "@/lib/auth/session";
import { uploadPermissionAs } from "@/lib/office/media";

// T-51: hands the browser a short-lived permission to upload one office file to the media store.
export async function POST(request: Request) {
  let actor;
  try {
    actor = await requireUser();
  } catch {
    return Response.json({ ok: false, error: "Sign in again." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Send the upload again." }, { status: 400 });
  }
  const result = await uploadPermissionAs(actor, body, request);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: "status" in result && result.status === 403 ? 403 : 400 });
  }
  return Response.json(result.reply);
}
