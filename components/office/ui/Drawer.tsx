"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/office/ui/Button";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  badge?: React.ReactNode;
  toolbar?: React.ReactNode;
  // Shown under the title, above the scrolling body, such as section links.
  subhead?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
};

// The panel that slides in from the right over a list. It is a modal dialog: Tab stays inside it,
// Esc or the scrim closes it, and focus goes back to what was focused before it opened.
export function Drawer({ open, title, description, meta, badge, toolbar, subhead, onClose, children }: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null || element === document.activeElement,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = panelRef.current.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (returnTo?.isConnected) returnTo.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="drawer-scrim" aria-hidden="true" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef}>
        <div className="drawer-bar">
          {toolbar}
          <span className="spacer" />
          <Button variant="ghost" size="sm" iconOnly icon="x" onClick={onClose}>
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="drawer-head">
          <div>
            <h2 id={titleId} ref={titleRef} tabIndex={-1}>
              {title}
              {badge}
            </h2>
            {description ? <p className="desc">{description}</p> : null}
            {meta ? <p className="meta">{meta}</p> : null}
          </div>
        </div>
        {subhead}
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}
