"use client";

import { useEffect, useState } from "react";
import { takeSavedMessage } from "@/components/office/content/media";
import { Button } from "@/components/office/ui/Button";
import type { ActionResult } from "@/lib/http/result";

type SaveBarProps = {
  label: string;
  pending: boolean;
  result: ActionResult | null;
  hint?: string;
};

// Sticks to the bottom of the form. It shows the last save result, or the message a save left
// before the page reloaded.
export function SaveBar({ label, pending, result, hint = "Changes go live when you save." }: SaveBarProps) {
  const [savedBefore, setSavedBefore] = useState<string | null>(null);

  useEffect(() => {
    const message = takeSavedMessage();
    // Read once after the reload. Storage is only in the browser, so this cannot run during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (message) setSavedBefore(message);
  }, []);

  let message = <span className="sb-msg">{hint}</span>;
  if (pending) {
    message = <span className="sb-msg">Saving…</span>;
  } else if (result && !result.ok) {
    message = (
      <span className="sb-msg is-error" role="alert">
        {result.error}
      </span>
    );
  } else if (result?.ok) {
    message = (
      <span className="sb-msg is-saved" role="status">
        {result.message ?? "Saved."}
      </span>
    );
  } else if (savedBefore) {
    message = (
      <span className="sb-msg is-saved" role="status">
        {savedBefore}
      </span>
    );
  }

  return (
    <div className="savebar">
      {message}
      <div className="sb-actions">
        <Button variant="primary" type="submit" disabled={pending} busy={pending}>
          {label}
        </Button>
      </div>
    </div>
  );
}
