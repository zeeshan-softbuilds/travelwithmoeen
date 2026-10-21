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
        window.location.assign("/office/login");
      }}
    >
      <Icon name="logout" />
      Sign out
    </button>
  );
}
