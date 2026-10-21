import { Badge, type BadgeTone } from "@/components/office/ui/Badge";
import type { OfficeRequestRow } from "@/lib/http/office-session";

export type RequestStatus = OfficeRequestRow["status"];
export type RequestKind = OfficeRequestRow["kind"];

export const REQUEST_STATUSES: RequestStatus[] = ["new", "in_progress", "closed"];
export const REQUEST_KINDS: RequestKind[] = ["booking", "custom", "contact"];

export const STATUS_LABEL: Record<RequestStatus, string> = {
  new: "New",
  in_progress: "In progress",
  closed: "Closed",
};

export const KIND_LABEL: Record<RequestKind, string> = {
  contact: "Contact",
  custom: "Custom trip",
  booking: "Booking",
};

const STATUS_TONE: Record<RequestStatus, BadgeTone> = {
  new: "info",
  in_progress: "warning",
  closed: "neutral",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge tone={STATUS_TONE[status]} dot={status !== "closed"}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function guestName(row: Pick<OfficeRequestRow, "name">) {
  return row.name.trim() || "Guest";
}

export function initialOf(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "G";
}

export function messagePreview(message: string, length = 70) {
  const flat = message.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length)}…` : flat;
}

export function isRequestStatus(value: string | undefined): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus);
}
