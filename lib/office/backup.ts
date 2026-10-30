import { timingSafeEqual } from "crypto";
import { del, get, list, put } from "@vercel/blob";
import { db } from "@/lib/db";
import {
  activity,
  airExtras,
  guestRequests,
  hotelRates,
  jeepLines,
  loginFailures,
  photos,
  places,
  posts,
  quoteDays,
  quoteExtras,
  quoteNights,
  quotes,
  reviews,
  seasons,
  siteSettings,
  slides,
  tourDays,
  tourPlaces,
  tours,
  users,
  vehicleRates,
} from "@/lib/db/schema";
import { canRunBackup } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";

export const BACKUP_FORMAT = "twm-backup-1";
const PREFIX = "backups/";
const KEEP = 30;

// Parents come before the tables that point at them, so a restore can insert in this order.
export const BACKUP_TABLES = [
  ["users", users],
  ["login_failures", loginFailures],
  ["tours", tours],
  ["tour_days", tourDays],
  ["places", places],
  ["tour_places", tourPlaces],
  ["posts", posts],
  ["photos", photos],
  ["reviews", reviews],
  ["slides", slides],
  ["hotel_rates", hotelRates],
  ["vehicle_rates", vehicleRates],
  ["air_extras", airExtras],
  ["jeep_lines", jeepLines],
  ["seasons", seasons],
  ["quotes", quotes],
  ["quote_nights", quoteNights],
  ["quote_days", quoteDays],
  ["quote_extras", quoteExtras],
  ["guest_requests", guestRequests],
  ["site_settings", siteSettings],
  ["activity", activity],
] as const;

export type BackupFile = {
  format: typeof BACKUP_FORMAT;
  createdAt: string;
  tables: Record<string, Record<string, unknown>[]>;
};

export type BackupRow = {
  name: string;
  size: number;
  uploadedAt: string;
};

function storageReady() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isBackupName(name: string) {
  return name.startsWith(PREFIX) && name.endsWith(".json") && !name.includes("..");
}

async function pruneOldBackups() {
  const { blobs } = await list({ prefix: PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
  const old = blobs
    .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())
    .slice(KEEP)
    .map((blob) => blob.url);
  if (old.length > 0) await del(old, { token: process.env.BLOB_READ_WRITE_TOKEN });
}

// Every table in BACKUP_TABLES, as the backup file holds it. check-step3 restores this into a copy.
export async function readBackupFile(): Promise<BackupFile> {
  const file: BackupFile = { format: BACKUP_FORMAT, createdAt: new Date().toISOString(), tables: {} };
  for (const [name, table] of BACKUP_TABLES) {
    file.tables[name] = await db.select().from(table);
  }
  return file;
}

export async function runBackup(): Promise<ActionResult> {
  if (!storageReady()) {
    return { ok: false, error: "Backup storage is not connected to this deployment." };
  }
  const file = await readBackupFile();
  const stamp = file.createdAt.replace(/[:.]/g, "-");
  const target = process.env.VERCEL_ENV === "production" ? "production" : "preview";
  const name = `${PREFIX}${target}-${stamp}.json`;
  await put(name, JSON.stringify(file), {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: "application/json",
    addRandomSuffix: false,
  });
  await pruneOldBackups();
  const rowCount = Object.values(file.tables).reduce((total, rows) => total + rows.length, 0);
  return { ok: true, message: `Backup saved: ${name} (${rowCount} rows).` };
}

export async function backupAs(actor: SessionUser): Promise<ActionResult> {
  if (!canRunBackup(actor.role)) {
    return forbidden("Only the Owner can run a backup.");
  }
  const result = await runBackup();
  // Back up now from the office. The nightly backup has no signed-in login, so it writes no row.
  if (result.ok) await recordActivity(db, actor, { kind: "backup", text: "Made a backup" });
  return result;
}

export async function listBackupsAs(actor: SessionUser) {
  if (!canRunBackup(actor.role)) {
    return forbidden("Only the Owner can see backups.");
  }
  if (!storageReady()) {
    return { ok: true as const, backups: [] as BackupRow[] };
  }
  const { blobs } = await list({ prefix: PREFIX, token: process.env.BLOB_READ_WRITE_TOKEN });
  const backups: BackupRow[] = blobs
    .sort((left, right) => right.uploadedAt.getTime() - left.uploadedAt.getTime())
    .map((blob) => ({ name: blob.pathname, size: blob.size, uploadedAt: blob.uploadedAt.toISOString() }));
  return { ok: true as const, backups };
}

export async function readBackupAs(actor: SessionUser, name: string) {
  if (!canRunBackup(actor.role)) {
    return { ok: false as const, error: "Only the Owner can download a backup.", status: 403 as const };
  }
  if (!storageReady() || !isBackupName(name)) {
    return { ok: false as const, error: "That backup was not found." };
  }
  const result = await get(name, { access: "private", token: process.env.BLOB_READ_WRITE_TOKEN });
  if (!result || result.statusCode !== 200) {
    return { ok: false as const, error: "That backup was not found." };
  }
  return { ok: true as const, stream: result.stream };
}

export function scheduleSecretMatches(authorization: string | null) {
  const secret = process.env.BACKUP_SECRET ?? "";
  if (!secret || !authorization?.startsWith("Bearer ")) return false;
  const left = Buffer.from(authorization.slice("Bearer ".length));
  const right = Buffer.from(secret);
  return left.length === right.length && timingSafeEqual(left, right);
}
