// A stored photo path as a CSS background. Quotes and line breaks are dropped so a path
// cannot end the url() early.
export function photoStyle(src: string | undefined | null): React.CSSProperties | undefined {
  const clean = (src ?? "").replace(/["\\\n\r]/g, "").trim();
  return clean ? { backgroundImage: `url("${clean}")` } : undefined;
}

const SAVED_KEY = "twm-office-saved";

// The office forms reload the page after a save, so the next page shows the message.
export function rememberSaved(message: string) {
  try {
    window.sessionStorage.setItem(SAVED_KEY, message);
  } catch {
    // Storage can be blocked. The save itself has worked.
  }
}

export function takeSavedMessage() {
  try {
    const message = window.sessionStorage.getItem(SAVED_KEY);
    if (message) window.sessionStorage.removeItem(SAVED_KEY);
    return message;
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
