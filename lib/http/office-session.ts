import { headers } from "next/headers";
import type { Role } from "@/lib/http/result";

export type OfficeSession = {
  id: number;
  email: string;
  role: Role;
  canEditContent: boolean;
  canManageUsers: boolean;
  canDeleteTour: boolean;
  canEditRates: boolean;
  canUpdateRequestStatus: boolean;
  canDeleteRequest: boolean;
  canRunBackup: boolean;
  newRequestCount: number;
};

export type OfficeUserRow = {
  id: number;
  email: string;
  role: Role;
};

async function officeUrl(path: string) {
  const configured = (process.env.API_BASE_URL ?? "").trim().replace(/\/$/, "");
  if (configured) return `${configured}${path}`;
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("The office API host is not set.");
  return `${proto}://${host}${path}`;
}

async function officeRequest(path: string) {
  const headerStore = await headers();
  return fetch(await officeUrl(path), {
    headers: { cookie: headerStore.get("cookie") ?? "" },
    cache: "no-store",
  });
}

export async function getOfficeSession(): Promise<OfficeSession | null> {
  const response = await officeRequest("/api/office/session");
  if (!response.ok) return null;
  const body = (await response.json()) as { ok: boolean } & Partial<OfficeSession>;
  if (!body.ok || !body.email || !body.role || body.id === undefined) return null;
  return {
    id: body.id,
    email: body.email,
    role: body.role,
    canEditContent: Boolean(body.canEditContent),
    canManageUsers: Boolean(body.canManageUsers),
    canDeleteTour: Boolean(body.canDeleteTour),
    canEditRates: Boolean(body.canEditRates),
    canUpdateRequestStatus: Boolean(body.canUpdateRequestStatus),
    canDeleteRequest: Boolean(body.canDeleteRequest),
    canRunBackup: Boolean(body.canRunBackup),
    newRequestCount: Number(body.newRequestCount) || 0,
  };
}

export type OfficeRequestRow = {
  id: number;
  kind: "contact" | "custom" | "booking";
  status: "new" | "in_progress" | "closed";
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
};

export async function getOfficeRequests(): Promise<OfficeRequestRow[]> {
  const response = await officeRequest("/api/office/requests");
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; requests?: OfficeRequestRow[] };
  return body.requests ?? [];
}

export async function getOfficeUsers(): Promise<OfficeUserRow[]> {
  const response = await officeRequest("/api/office/users");
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; users?: OfficeUserRow[] };
  return body.users ?? [];
}

export type OfficeBackupRow = {
  name: string;
  size: number;
  uploadedAt: string;
};

export async function getOfficeBackups(): Promise<OfficeBackupRow[]> {
  const response = await officeRequest("/api/office/backup");
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; backups?: OfficeBackupRow[] };
  return body.backups ?? [];
}

export type OfficeActivityRow = {
  id: number;
  at: string;
  userEmail: string;
  area: "content" | "rates" | "requests" | "users" | "backups";
  kind: string;
  recordId: string;
  text: string;
};

// The newest office saves the signed-in role may read, for the dashboard feed.
export async function getOfficeActivity(limit = 8): Promise<OfficeActivityRow[]> {
  const response = await officeRequest(`/api/office/activity?limit=${limit}`);
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; rows?: OfficeActivityRow[] };
  return body.rows ?? [];
}

// "Saved by": the newest save of each record of one kind, keyed by the record. With no records
// named, every record of that kind.
export async function getSavedBy(kind: string, records: (string | number)[] = []): Promise<Record<string, OfficeActivityRow>> {
  const query = new URLSearchParams({ kind });
  for (const record of records) query.append("record", String(record));
  const response = await officeRequest(`/api/office/activity?${query}`);
  if (!response.ok) return {};
  const body = (await response.json()) as { ok: boolean; rows?: OfficeActivityRow[] };
  return Object.fromEntries((body.rows ?? []).map((row) => [row.recordId, row]));
}
