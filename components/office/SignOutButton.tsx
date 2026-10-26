"use client";

import { Icon } from "@/components/office/ui/Icon";
import { apiPath } from "@/lib/http/api-path";

export function SignOutButton() {
  return (
    <button
      className="pop-item"
      type="button"
      onClick={async () => {
        await fetch(apiPath("/api/office/logout"), { method: "POST", credentials: "include" });
        // A full page load on purpose: it drops everything the office kept in the browser. Replace also
        // keeps the signed-out office page out of the Back history.
        window.location.replace("/office/login");
      }}
    >
      <Icon name="logout" />
      Sign out
    </button>
  );
}
