"use client";

import { useSyncExternalStore } from "react";
import { busyServerSnapshot, busySnapshot, subscribeBusy } from "@/lib/http/office-busy";

// T-50 (BR-98, BR-100): the office top bar shows the action that is working, such as "Saving
// photo…", wherever the page is scrolled, then the saved message or the error for 4 seconds. The
// live region is always there, so a screen reader hears each change once.
export function OfficeBusy() {
  const { working, result } = useSyncExternalStore(subscribeBusy, busySnapshot, busyServerSnapshot);
  let className = "topbar-busy";
  let text = "";
  if (working) {
    className += " is-working";
    text = `${working}…`;
  } else if (result) {
    className += result.ok ? " is-saved" : " is-error";
    text = result.text;
  }
  return (
    <span className={className} role="status" aria-live="polite">
      {working ? <span className="topbar-spinner" aria-hidden="true" /> : null}
      {text ? <span className="topbar-busy-text">{text}</span> : null}
    </span>
  );
}
