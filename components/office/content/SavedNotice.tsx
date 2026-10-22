"use client";

import { useEffect, useState } from "react";
import { takeSavedMessage } from "@/components/office/content/media";
import { Alert } from "@/components/office/ui/Alert";

// On a list page, shows the message an add or a delete left before the page changed.
export function SavedNotice() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Storage is only in the browser, so the message is read after the first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(takeSavedMessage());
  }, []);

  return message ? <Alert tone="success" title={message} role="status" /> : null;
}
