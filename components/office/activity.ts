import { formatDateTime, relativeTime } from "@/components/office/format";

type SavedRow = { at: string; userEmail: string };

// "Just now" and "Yesterday" read as "saved just now" mid-sentence. A date such as "Oct 20, 2026"
// and "5 minutes ago" stay as they are.
function inSentence(when: string) {
  return when === "Just now" || when === "Yesterday" ? when.toLowerCase() : when;
}

// The prototype's "Last saved 5 minutes ago by editor@…" line. Made on the server with the request
// time, so the browser shows the same text.
export function savedByText(row: SavedRow | undefined, now: number) {
  if (!row) return "";
  return `Last saved ${inSentence(relativeTime(row.at, now))} by ${row.userEmail}`;
}

export type SavedCell = { when: string; who: string; full: string };

// The same for each row of a rate table, keyed by the row id. The cell is narrow, so it shows the
// time and the login name. The full email and date are in full, for the tooltip and screen readers.
export function savedByCells(rows: Record<string, SavedRow>, now: number): Record<string, SavedCell> {
  return Object.fromEntries(
    Object.entries(rows).map(([id, row]) => [
      id,
      { when: inSentence(relativeTime(row.at, now)), who: row.userEmail.split("@")[0], full: `Last saved ${formatDateTime(row.at)} by ${row.userEmail}` },
    ]),
  );
}

const LIST_OF_KIND: Record<string, string> = {
  tour: "/office/tours",
  place: "/office/places",
  post: "/office/blog",
  photo: "/office/gallery",
  review: "/office/reviews",
  slide: "/office/slides",
  site: "/office/site",
  hotel_rate: "/office/rates",
  vehicle_rate: "/office/rates/vehicles",
  jeep_line: "/office/rates/jeeps",
  air_extra: "/office/rates/air",
  margin: "/office/rates/margin",
  quote: "/office/rates/quote",
  request: "/office/requests",
  user: "/office/users",
  backup: "/office/backup",
};

// Where a feed row opens: the record's editor while it exists, otherwise its list.
export function activityHref(row: { kind: string; recordId: string; text: string }) {
  const list = LIST_OF_KIND[row.kind] ?? "/office";
  // A delete row names a record that is gone, so it opens the list.
  if (!row.recordId || /^(Deleted|Removed) /.test(row.text)) return list;
  const id = encodeURIComponent(row.recordId);
  if (row.kind === "tour" || row.kind === "place" || row.kind === "post") return `${list}/${id}`;
  if (row.kind === "photo" || row.kind === "review" || row.kind === "slide") return `${list}?edit=${id}`;
  if (row.kind === "request") return `${list}?id=${id}`;
  return list;
}
