"use client";

import { useState, useTransition } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { rememberSaved } from "@/components/office/content/media";
import { postOfficeForm } from "@/lib/http/office-client";

type DeleteCardProps = {
  title: string;
  body: string;
  buttonLabel: string;
  path: string;
  id: string | number;
  // Where to go after the delete.
  goTo: string;
};

// The danger card at the foot of an editor. It asks once more before it calls the route.
export function DeleteCard({ title, body, buttonLabel, path, id, goTo }: DeleteCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const confirm = () =>
    start(async () => {
      const form = new FormData();
      form.set("id", String(id));
      const result = await postOfficeForm(path, form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      rememberSaved(result.message ?? "Deleted.");
      window.location.assign(goTo);
    });

  return (
    <section className="card card-danger">
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
        {confirming ? null : (
          <Button variant="danger-outline" icon="trash" onClick={() => setConfirming(true)}>
            {buttonLabel}
          </Button>
        )}
      </div>
      {confirming ? (
        <div className="card-body">
          <div className="alert a-danger" role="alertdialog" aria-label={`${buttonLabel}?`}>
            <Icon name="alert" />
            <div className="confirm-row">
              <b>{buttonLabel}? This cannot be undone.</b>
              <Button variant="danger" size="sm" busy={pending} disabled={pending} onClick={confirm}>
                {buttonLabel}
              </Button>
              <Button variant="ghost" size="sm" disabled={pending} onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
          {error ? <Alert tone="danger" title={error} role="alert" /> : null}
        </div>
      ) : null}
    </section>
  );
}
