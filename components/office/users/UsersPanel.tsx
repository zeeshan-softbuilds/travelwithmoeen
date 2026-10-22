"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ROLE_NAME } from "@/components/office/office-nav";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { Table } from "@/components/office/ui/Table";
import { postOfficeForm } from "@/lib/http/office-client";
import type { OfficeUserRow } from "@/lib/http/office-session";
import { ROLES, type Role } from "@/lib/http/result";

type Notice = { tone: "success" | "danger"; text: string } | null;

const ROLE_RULES: [string, boolean, boolean, boolean][] = [
  ["Read requests", true, true, true],
  ["Change a request status", true, true, false],
  ["Delete a request", true, false, false],
  ["Rates and quotes", true, true, false],
  ["Website content", true, false, true],
  ["Delete a tour", true, false, true],
  ["Logins and backups", true, false, false],
];

function withoutUser(roles: Record<number, Role>, userId: number) {
  const rest = { ...roles };
  delete rest[userId];
  return rest;
}

function initialsOf(email: string) {
  return email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "?";
}

export function UsersPanel({ users, selfId }: { users: OfficeUserRow[]; selfId: number }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Record<number, Role>>({});
  const [removing, setRemoving] = useState<number | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, start] = useTransition();

  // Calls an existing users route. The server checks the role and the last-Owner rule.
  const send = (path: string, form: FormData, after: () => void) =>
    start(async () => {
      const result = await postOfficeForm(path, form);
      if (!result.ok) {
        setNotice({ tone: "danger", text: result.error });
        return;
      }
      setNotice({ tone: "success", text: result.message ?? "Saved." });
      after();
      router.refresh();
    });

  const create = (form: FormData) =>
    send("/api/office/users", form, () => {
      setCreating(false);
      setShowPassword(false);
    });

  const saveRole = (user: OfficeUserRow) => {
    const form = new FormData();
    form.set("userId", String(user.id));
    form.set("role", roles[user.id]);
    send("/api/office/users/role", form, () => setRoles((current) => withoutUser(current, user.id)));
  };

  const remove = (user: OfficeUserRow) => {
    const form = new FormData();
    form.set("userId", String(user.id));
    send("/api/office/users/remove", form, () => setRemoving(null));
  };

  return (
    <>
      <PageHead
        title="Users"
        description="Office logins and their roles. Only the Owner sees this page."
        actions={
          creating ? null : (
            <Button variant="primary" icon="plus" onClick={() => setCreating(true)}>
              Create login
            </Button>
          )
        }
      />

      {notice ? <Alert tone={notice.tone} title={notice.text} role={notice.tone === "danger" ? "alert" : "status"} /> : null}

      {creating ? (
        <Card title="Create a login" description="They sign in at /office/login with this email and password.">
          <form action={create} className="stack">
            <div className="form-grid">
              <Field id="new-email" label="Email">
                <input className="input" id="new-email" name="email" type="email" autoComplete="off" required />
              </Field>
              <Field id="new-role" label="Role">
                <select className="select" id="new-role" name="role" defaultValue="editor">
                  <option value="editor">Editor</option>
                  <option value="manager">Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </Field>
              <div className="field full">
                <label className="label" htmlFor="new-password">
                  Password
                </label>
                <div className="pw">
                  <input
                    className="input"
                    id="new-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    aria-describedby={helpId("new-password")}
                  />
                  <Button variant="ghost" size="sm" icon="eye" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </Button>
                </div>
                <p className="help" id={helpId("new-password")}>
                  At least 8 characters. Give it to them in person or by phone.
                </p>
              </div>
            </div>
            <div className="row-tools">
              <Button variant="ghost" disabled={pending} onClick={() => setCreating(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon="plus" disabled={pending} busy={pending}>
                Create login
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <Table label="Office logins">
        <thead>
          <tr>
            <th scope="col">Login</th>
            <th scope="col">Role</th>
            <th scope="col" className="r">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const self = user.id === selfId;
            const chosen = roles[user.id] ?? user.role;
            const changed = chosen !== user.role;
            return (
              <tr key={user.id}>
                <td>
                  <span className="user-cell">
                    <span className="avatar" aria-hidden="true">
                      {initialsOf(user.email)}
                    </span>
                    <span>
                      <b>{user.email}</b>
                      {self ? <small className="cell-sub">You</small> : null}
                    </span>
                  </span>
                </td>
                <td data-label="Role">
                  <label className="sr-only" htmlFor={`role-${user.id}`}>
                    Role for {user.email}
                  </label>
                  <select
                    className="select select-sm"
                    id={`role-${user.id}`}
                    value={chosen}
                    disabled={pending}
                    onChange={(event) => setRoles((current) => ({ ...current, [user.id]: event.target.value as Role }))}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_NAME[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td data-label="Actions">
                  <div className="row-tools">
                    {changed ? (
                      <>
                        <Button size="sm" variant="primary" disabled={pending} busy={pending} onClick={() => saveRole(user)}>
                          Make {ROLE_NAME[chosen]}
                        </Button>
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setRoles((current) => withoutUser(current, user.id))}>
                          Cancel
                        </Button>
                      </>
                    ) : removing === user.id ? (
                      <>
                        <span className="help">Remove this login?</span>
                        <Button size="sm" variant="danger" disabled={pending} busy={pending} onClick={() => remove(user)}>
                          Remove login
                        </Button>
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => setRemoving(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : self ? (
                      <span className="muted">You</span>
                    ) : (
                      <Button size="sm" variant="ghost" icon="trash" onClick={() => setRemoving(user.id)}>
                        Remove<span className="sr-only"> {user.email}</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Card title="What each role can do" description="Only the Owner can create a login or change a role. The last Owner cannot be removed or changed to another role.">
        <Table label="What each role can do" flat plain>
          <thead>
            <tr>
              <th scope="col">Area</th>
              <th scope="col">Owner</th>
              <th scope="col">Manager</th>
              <th scope="col">Editor</th>
            </tr>
          </thead>
          <tbody>
            {ROLE_RULES.map(([area, ...allowed]) => (
              <tr key={area}>
                <th scope="row">{area}</th>
                {allowed.map((yes, index) => (
                  <td key={index}>
                    {yes ? <Icon name="check" className="yes" /> : <span className="muted">—</span>}
                    <span className="sr-only">{yes ? "Yes" : "No"}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
