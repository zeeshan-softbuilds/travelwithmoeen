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
  };
}

export async function getOfficeUsers(): Promise<OfficeUserRow[]> {
  const response = await officeRequest("/api/office/users");
  if (!response.ok) return [];
  const body = (await response.json()) as { ok: boolean; users?: OfficeUserRow[] };
  return body.users ?? [];
}
