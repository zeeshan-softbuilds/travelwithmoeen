import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { canManageUsers, isRole, type Role } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";

export type { ActionResult };

const ROLE_NAME: Record<Role, string> = { owner: "Owner", manager: "Manager", editor: "Editor" };

export async function listUsersAs(actor: SessionUser) {
  if (!canManageUsers(actor.role)) {
    return forbidden("Only the Owner can see logins.");
  }
  const rows = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users)
    .orderBy(asc(users.email));
  return { ok: true as const, users: rows };
}

export async function createUserAs(
  actor: SessionUser,
  input: { email: string; password: string; role: string },
): Promise<ActionResult> {
  if (!canManageUsers(actor.role)) {
    return forbidden("Only the Owner can create a login.");
  }
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, error: "Enter an email address." };
  }
  if (input.password.length < 8) {
    return { ok: false, error: "Use a password of at least 8 characters." };
  }
  if (!isRole(input.role)) {
    return { ok: false, error: "Choose Owner, Manager, or Editor." };
  }
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return { ok: false, error: "That email already has a login." };
  }
  const passwordHash = await hashPassword(input.password);
  const role = input.role;
  await db.transaction(async (tx) => {
    const [created] = await tx.insert(users).values({ email, passwordHash, role }).returning({ id: users.id });
    // The login's email and role only. Never the password.
    await recordActivity(tx, actor, { kind: "user", recordId: created?.id, text: `Created a login for ${email} as ${ROLE_NAME[role]}` });
  });
  return { ok: true, message: "Login created." };
}

export async function removeUserAs(actor: SessionUser, userId: number): Promise<ActionResult> {
  if (!canManageUsers(actor.role)) {
    return forbidden("Only the Owner can remove a login.");
  }
  if (actor.id === userId) {
    return { ok: false, error: "You cannot remove your own login." };
  }
  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target) {
    return { ok: false, error: "That login was not found." };
  }
  if (target.role === "owner") {
    const [owners] = await db.select({ value: count() }).from(users).where(eq(users.role, "owner"));
    if ((owners?.value ?? 0) <= 1) {
      return { ok: false, error: "The last Owner login cannot be removed." };
    }
  }
  await db.transaction(async (tx) => {
    await tx.delete(users).where(eq(users.id, userId));
    await recordActivity(tx, actor, { kind: "user", recordId: userId, text: `Removed the login ${target.email}` });
  });
  return { ok: true, message: "Login removed." };
}

export async function changeRoleAs(actor: SessionUser, userId: number, role: string): Promise<ActionResult> {
  if (!canManageUsers(actor.role)) {
    return forbidden("Only the Owner can change a role.");
  }
  if (!isRole(role)) {
    return { ok: false, error: "Choose Owner, Manager, or Editor." };
  }
  const [target] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!target) {
    return { ok: false, error: "That login was not found." };
  }
  if (target.role === "owner" && role !== "owner") {
    const [owners] = await db.select({ value: count() }).from(users).where(eq(users.role, "owner"));
    if ((owners?.value ?? 0) <= 1) {
      return { ok: false, error: "The last Owner cannot change to another role." };
    }
  }
  const newRole = role;
  await db.transaction(async (tx) => {
    await tx.update(users).set({ role: newRole }).where(eq(users.id, userId));
    await recordActivity(tx, actor, { kind: "user", recordId: userId, text: `Changed ${target.email} to ${ROLE_NAME[newRole]}` });
  });
  return { ok: true, message: "Role updated." };
}
