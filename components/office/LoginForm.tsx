"use client";

import { useActionState, useState } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Field } from "@/components/office/ui/Field";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

export function LoginForm() {
  const [state, action, pending] = useActionState(officeFormAction("/api/office/login", "/office"), null as ActionResult | null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="card login-card">
      <div className="card-body">
        <div>
          <h1>Sign in</h1>
          <p className="desc">
            Use the email and password for your office login. A Manager uses the login the Owner created under Users.
          </p>
        </div>
        {state && !state.ok ? <Alert tone="danger" title={state.error} role="alert" /> : null}
        <Field id="email" label="Email">
          <input className="input" id="email" name="email" type="email" autoComplete="username" required />
        </Field>
        <Field id="password" label="Password">
          <div className="pw">
            <input
              className="input"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
            />
            <Button variant="ghost" size="sm" icon="eye" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
              <span>{showPassword ? "Hide" : "Show"}</span>
            </Button>
          </div>
        </Field>
        <Button variant="primary" size="lg" block type="submit" disabled={pending} busy={pending}>
          Sign in
        </Button>
        <p className="help center">Forgot your password? Ask the Owner to set a new one.</p>
      </div>
    </form>
  );
}
