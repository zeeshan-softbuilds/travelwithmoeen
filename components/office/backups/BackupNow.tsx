"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert } from "@/components/office/ui/Alert";
import { Button } from "@/components/office/ui/Button";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

// Runs a backup through the existing route, then reloads the list.
export function BackupNow() {
  const router = useRouter();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const run = () =>
    start(async () => {
      const outcome = await postOfficeForm("/api/office/backup", new FormData());
      setResult(outcome);
      if (outcome.ok) router.refresh();
    });

  return (
    <>
      <Button variant="primary" icon="database" disabled={pending} busy={pending} onClick={run}>
        {pending ? "Backing up…" : "Back up now"}
      </Button>
      {result ? (
        <div className="backup-result">
          <Alert tone={result.ok ? "success" : "danger"} title={result.ok ? result.message ?? "Backup saved." : result.error} role={result.ok ? "status" : "alert"} />
        </div>
      ) : null}
    </>
  );
}
