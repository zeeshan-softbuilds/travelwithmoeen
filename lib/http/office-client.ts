import { apiPath } from "@/lib/http/api-path";
import { startBusy } from "@/lib/http/office-busy";
import type { ActionResult } from "@/lib/http/result";

async function sendOfficeForm(path: string, formData: FormData): Promise<ActionResult> {
  let response: Response;
  try {
    response = await fetch(apiPath(path), {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  } catch {
    return { ok: false, error: "The office could not be reached." };
  }
  const body = (await response.json().catch(() => null)) as ActionResult | null;
  if (!body || typeof body.ok !== "boolean") {
    return { ok: false, error: "The office could not save that." };
  }
  return body;
}

// The text the office top bar shows when an action ends (BR-98).
export function busyOutcome(result: ActionResult) {
  return result.ok ? { ok: true, text: result.message ?? "Saved." } : { ok: false, text: result.error };
}

// T-50: with a label, such as "Saving photo", the office top bar shows the work while it runs and
// the result when it ends. Without one, as on the sign-in page, nothing is shown there.
export async function postOfficeForm(path: string, formData: FormData, label?: string): Promise<ActionResult> {
  const end = label ? startBusy(label) : null;
  const result = await sendOfficeForm(path, formData);
  end?.(busyOutcome(result));
  return result;
}

type OfficeFormActionOptions = {
  // Where to go after a save that worked, with router.push from the calling component (BR-99).
  goTo?: string;
  navigate?: (href: string) => void;
  label?: string;
};

export function officeFormAction(path: string, { goTo, navigate, label }: OfficeFormActionOptions = {}) {
  return async (previous: ActionResult | null, formData: FormData): Promise<ActionResult> => {
    const result = await postOfficeForm(path, formData, label);
    if (result.ok && goTo) {
      if (navigate) navigate(goTo);
      else window.location.assign(goTo);
    }
    return result;
  };
}
