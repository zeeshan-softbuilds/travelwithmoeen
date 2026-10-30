import { and, desc, eq, inArray, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { activity } from "@/lib/db/schema";
import { canEditContent, canEditRates, canManageUsers, canRunBackup, type Role } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";

// BR-86 and design section 11: who saved what, and when.
export const ACTIVITY_AREA_OF_KIND = {
  tour: "content",
  place: "content",
  post: "content",
  photo: "content",
  review: "content",
  slide: "content",
  site: "content",
  hotel_rate: "rates",
  vehicle_rate: "rates",
  jeep_line: "rates",
  air_extra: "rates",
  margin: "rates",
  quote: "rates",
  request: "requests",
  user: "users",
  backup: "backups",
} as const;

export type ActivityKind = keyof typeof ACTIVITY_AREA_OF_KIND;
export type ActivityArea = (typeof ACTIVITY_AREA_OF_KIND)[ActivityKind];

export type ActivityRow = {
  id: number;
  at: string;
  userEmail: string;
  area: ActivityArea;
  kind: ActivityKind;
  recordId: string;
  text: string;
};

const KEEP_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;
const FEED_LIMIT = 20;
const FEED_MAX = 100;

// The database, or the transaction a save already runs in, so the row commits with the save.
type ActivityWriter = Pick<typeof db, "insert" | "delete">;

export function isActivityKind(value: string): value is ActivityKind {
  return Object.hasOwn(ACTIVITY_AREA_OF_KIND, value);
}

// Owner reads every area. Manager reads rates and requests. Editor reads content and requests.
// Users and backups are Owner only.
export function activityAreasFor(role: Role): ActivityArea[] {
  const areas: ActivityArea[] = [];
  if (canEditContent(role)) areas.push("content");
  if (canEditRates(role)) areas.push("rates");
  areas.push("requests");
  if (canManageUsers(role)) areas.push("users");
  if (canRunBackup(role)) areas.push("backups");
  return areas;
}

// Called by a lib/ save after the save has succeeded. The text names the record. It never holds a
// password, a token, a secret, or a guest phone or message. Rows older than 365 days go here.
export async function recordActivity(
  writer: ActivityWriter,
  actor: SessionUser,
  entry: { kind: ActivityKind; recordId?: string | number; text: string },
) {
  await writer.insert(activity).values({
    userId: actor.id,
    userEmail: actor.email,
    area: ACTIVITY_AREA_OF_KIND[entry.kind],
    kind: entry.kind,
    recordId: entry.recordId === undefined ? "" : String(entry.recordId),
    text: entry.text,
  });
  await writer.delete(activity).where(lt(activity.at, new Date(Date.now() - KEEP_DAYS * DAY_MS)));
}

function toRow(row: typeof activity.$inferSelect): ActivityRow {
  return {
    id: row.id,
    at: row.at.toISOString(),
    userEmail: row.userEmail,
    area: row.area as ActivityArea,
    kind: row.kind as ActivityKind,
    recordId: row.recordId,
    text: row.text,
  };
}

// The newest rows the actor's role may read, for the dashboard feed.
export async function listActivityAs(actor: SessionUser, limit = FEED_LIMIT) {
  const take = Number.isInteger(limit) && limit > 0 ? Math.min(limit, FEED_MAX) : FEED_LIMIT;
  const rows = await db
    .select()
    .from(activity)
    .where(inArray(activity.area, activityAreasFor(actor.role)))
    .orderBy(desc(activity.at), desc(activity.id))
    .limit(take);
  return { ok: true as const, rows: rows.map(toRow) };
}

// "Saved by" on a screen: the newest row for each record of one kind, or for the records named.
export async function latestActivityAs(actor: SessionUser, kind: string, recordIds: string[] = []) {
  if (!isActivityKind(kind)) return { ok: false as const, error: "Choose a record type." };
  if (!activityAreasFor(actor.role).includes(ACTIVITY_AREA_OF_KIND[kind])) {
    return { ok: false as const, error: "You cannot read that activity.", status: 403 as const };
  }
  const rows = await db
    .selectDistinctOn([activity.recordId])
    .from(activity)
    .where(recordIds.length ? and(eq(activity.kind, kind), inArray(activity.recordId, recordIds)) : eq(activity.kind, kind))
    .orderBy(activity.recordId, desc(activity.at), desc(activity.id));
  return { ok: true as const, rows: rows.map(toRow) };
}
