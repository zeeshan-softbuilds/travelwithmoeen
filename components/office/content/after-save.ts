"use client";

import { useRouter } from "next/navigation";
import { startTransition, type FormEvent } from "react";
import { rememberSaved } from "@/components/office/content/media";
import { startNavigationProgress } from "@/components/ui/NavigationProgress";

// T-50 (BR-99, design section 13): after a save the office shows the new data without reloading the
// whole page. An editor that stays open refreshes the server data, and its screen opens it again with
// the saved record, so no stale path or chosen file is left in the form. A save that opens another
// page moves there with router.push and the page-move bar.
export function useAfterSave() {
  const router = useRouter();
  return {
    stay(message: string, scope: string) {
      rememberSaved(message, scope);
      router.refresh();
    },
    go(href: string, message: string, options: { scroll?: boolean } = {}) {
      rememberSaved(message);
      startNavigationProgress(href);
      router.push(href, options.scroll === false ? { scroll: false } : undefined);
    },
  };
}

// Sends a form to a useActionState action without React's automatic form reset, so a refused or
// cancelled save keeps everything that was typed (BR-97).
export function submitTo(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };
}
