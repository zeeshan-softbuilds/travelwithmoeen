"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonClass } from "@/components/office/ui/Button";
import { Drawer } from "@/components/office/ui/Drawer";
import { Icon } from "@/components/office/ui/Icon";

const LEAVE_QUESTION = "Leave without saving? Your changes will be lost.";

type EditorDrawerProps = {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  closeHref: string;
  previousHref?: string | null;
  nextHref?: string | null;
  position?: { index: number; total: number } | null;
  // The page on the website, as a site path such as /tours/5, so it opens on the same host.
  viewHref?: string;
  sections?: { id: string; label: string }[];
  preview?: React.ReactNode;
  // "Last saved 5 minutes ago by editor@…", from the activity record (BR-86). Empty for a new record.
  savedBy?: string;
  children: React.ReactNode;
};

// The editor that slides in over a list: previous and next, View on site, section links, a
// preview of the website card, and the form. Leaving with unsaved changes asks first.
export function EditorDrawer({ title, description, badge, closeHref, previousHref, nextHref, position, viewHref, sections, preview, savedBy, children }: EditorDrawerProps) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);

  const mayLeave = () => !dirty || window.confirm(LEAVE_QUESTION);
  const guard = (event: React.MouseEvent) => {
    if (!mayLeave()) event.preventDefault();
  };

  const toolbar = (
    <>
      {position ? (
        <>
          <span className="drawer-pos">
            {position.index + 1} of {position.total}
          </span>
          {previousHref ? (
            <Link className={buttonClass({ variant: "ghost", size: "sm", iconOnly: true })} href={previousHref} scroll={false} prefetch={false} onClick={guard}>
              <Icon name="chevU" />
              <span className="sr-only">Previous</span>
            </Link>
          ) : null}
          {nextHref ? (
            <Link className={buttonClass({ variant: "ghost", size: "sm", iconOnly: true })} href={nextHref} scroll={false} prefetch={false} onClick={guard}>
              <Icon name="chevD" />
              <span className="sr-only">Next</span>
            </Link>
          ) : null}
          <span className="drawer-sep" aria-hidden="true" />
        </>
      ) : null}
      {viewHref ? (
        <a className={buttonClass({ variant: "ghost", size: "sm" })} href={viewHref} target="_blank" rel="noopener noreferrer">
          <Icon name="external" />
          <span>View on site</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </>
  );

  const subhead = sections?.length ? (
    <nav className="drawer-sections" aria-label="Sections">
      {sections.map((section) => (
        <button
          className="chip"
          type="button"
          key={section.id}
          onClick={() => {
            const target = document.getElementById(section.id);
            target?.scrollIntoView({ block: "start" });
            target?.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea")?.focus({ preventScroll: true });
          }}
        >
          {section.label}
        </button>
      ))}
    </nav>
  ) : null;

  return (
    <Drawer
      open
      title={title}
      description={description}
      badge={badge}
      meta={
        savedBy ? (
          <>
            <Icon name="clock" />
            {savedBy}
          </>
        ) : null
      }
      toolbar={toolbar}
      subhead={subhead}
      onClose={() => {
        if (mayLeave()) router.push(closeHref, { scroll: false });
      }}
    >
      {preview ? (
        <div className="preview">
          <p className="preview-label">
            <Icon name="eye" />
            Preview on the website
          </p>
          {preview}
        </div>
      ) : null}
      <div className="drawer-form" onInput={() => setDirty(true)} onChange={() => setDirty(true)}>
        {children}
      </div>
    </Drawer>
  );
}
