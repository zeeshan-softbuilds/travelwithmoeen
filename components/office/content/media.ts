// A stored photo path as a CSS background. Quotes and line breaks are dropped so a path
// cannot end the url() early.
export function photoStyle(src: string | undefined | null): React.CSSProperties | undefined {
  const clean = (src ?? "").replace(/["\\\n\r]/g, "").trim();
  return clean ? { backgroundImage: `url("${clean}")` } : undefined;
}

const SAVED_KEY = "twm-office-saved";
// A message is shown only soon after its save, so an old one never appears on a later visit.
const SAVED_MS = 15000;

type SavedEntry = { message: string; scope: string; at: number };

// T-50: a save leaves its message for the screen that shows next. A list page takes a message with
// no scope, after an add or a delete. An editor that stays open after its save passes its own scope,
// such as "photo:12", so only that editor shows the message once it opens again with the new data.
export function rememberSaved(message: string, scope = "") {
  try {
    const entry: SavedEntry = { message, scope, at: Date.now() };
    window.sessionStorage.setItem(SAVED_KEY, JSON.stringify(entry));
  } catch {
    // Storage can be blocked. The save itself has worked.
  }
}

export function takeSavedMessage(scope = "") {
  try {
    const raw = window.sessionStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    let entry: SavedEntry | null = null;
    try {
      entry = JSON.parse(raw) as SavedEntry;
    } catch {
      entry = null;
    }
    if (!entry || typeof entry.message !== "string" || Date.now() - Number(entry.at) > SAVED_MS) {
      window.sessionStorage.removeItem(SAVED_KEY);
      return null;
    }
    if ((entry.scope ?? "") !== scope) return null;
    window.sessionStorage.removeItem(SAVED_KEY);
    return entry.message;
  } catch {
    return null;
  }
}

export function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
