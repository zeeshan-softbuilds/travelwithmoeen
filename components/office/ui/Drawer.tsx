"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/office/ui/Button";

type DrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  toolbar?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
};

// The panel that slides in from the right over a list. Esc or the scrim closes it, and
// focus goes back to what was focused before it opened.
export function Drawer({ open, title, description, meta, toolbar, onClose, children }: DrawerProps) {
  const titleId = useId();
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

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = overflow;
      returnTo?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="drawer-scrim" aria-hidden="true" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
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
            </h2>
            {description ? <p className="desc">{description}</p> : null}
            {meta ? <p className="meta">{meta}</p> : null}
          </div>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>
  );
}
