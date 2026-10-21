// Office dates are shown in Pakistan time, the same on the server and in the browser.
const OFFICE_TIME_ZONE = "Asia/Karachi";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// The time a server page renders. A server page renders once per request, so reading the clock
// there is intended. It is passed down so the browser shows the same relative times.
export function requestTime() {
  return Date.now();
}

export function formatDateTime(iso: string, options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" }) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: OFFICE_TIME_ZONE }).format(date);
}

// "3 hours ago". Pass the same now on the server and in the browser so both render the same text.
export function relativeTime(iso: string, now: number) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "";
  const elapsed = Math.max(0, now - time);
  if (elapsed < MINUTE_MS) return "Just now";
  if (elapsed < HOUR_MS) {
    const minutes = Math.floor(elapsed / MINUTE_MS);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (elapsed < DAY_MS) {
    const hours = Math.floor(elapsed / HOUR_MS);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  const days = Math.floor(elapsed / DAY_MS);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDateTime(iso, { dateStyle: "medium" });
}

export function hoursSince(iso: string, now: number) {
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return 0;
  return (now - time) / HOUR_MS;
}

export function greetingAt(now: number) {
  const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: OFFICE_TIME_ZONE }).format(new Date(now)));
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
