"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useSyncExternalStore } from "react";

// T-50 (BR-95, BR-100, design section 13): one thin bar across the top of the window while the site
// moves to another page, on the public site and in the office. It starts when a same-site link is
// followed or when code calls startNavigationProgress() before router.push(), and it ends when the
// path or the search changes. It shows only after 150 milliseconds, so a fast move does not flicker.

const SHOW_AFTER_MS = 150;
// A move that never changes the address, such as a link to the page already open, ends on its own.
const GIVE_UP_MS = 15000;

type Move = { startedAt: number; target: string };
const IDLE: Move = { startedAt: 0, target: "" };
let move: Move = IDLE;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return move;
}

function serverSnapshot() {
  return IDLE;
}

// Call this just before router.push() or router.replace() to another page, with the same href.
export function startNavigationProgress(href = "") {
  let target = "";
  try {
    target = new URL(href, window.location.href).pathname;
  } catch {
    target = "";
  }
  move = { startedAt: Date.now(), target };
  emit();
}

function stopNavigationProgress() {
  if (move.startedAt === 0) return;
  move = IDLE;
  emit();
}

// The path of a move to another page that has taken longer than 150 milliseconds, or null. The
// office shows its placeholder blocks while it waits for that page (BR-96).
export function usePendingPath() {
  const { startedAt, target } = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [shown, setShown] = useState<string | null>(null);
  useEffect(() => {
    if (!startedAt) {
      // The move has ended, so nothing is pending.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(null);
      return;
    }
    const timer = window.setTimeout(() => setShown(target), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [startedAt, target]);
  return shown;
}

function currentAddress() {
  return `${window.location.pathname}${window.location.search}`;
}

// The href of a plain left click on a same-site link to another address, or null. A new tab, a
// download, a link to another site, a hash on the same page, and a modified click do not move this page.
function pageMoveHref(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  return `${url.pathname}${url.search}` !== currentAddress() ? url.href : null;
}

// The address the bar last saw. A new one means the move has ended.
let shownAddress: string | null = null;

function onAddress(address: string) {
  if (shownAddress !== null && shownAddress !== address) stopNavigationProgress();
  shownAddress = address;
}

function AddressWatch({ onChange }: { onChange: (address: string) => void }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    onChange(`${pathname}?${search}`);
  }, [pathname, search, onChange]);
  return null;
}

export function NavigationProgress() {
  const { startedAt: started } = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // Links are followed in the capture phase, before the Link component turns the click into a
  // client-side move, so every same-site link starts the bar, including links outside the office.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = pageMoveHref(event);
      if (href) startNavigationProgress(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!started) return;
    const show = window.setTimeout(() => {
      setFinishing(false);
      setVisible(true);
      setAnnouncement("Loading page");
    }, SHOW_AFTER_MS);
    const giveUp = window.setTimeout(stopNavigationProgress, GIVE_UP_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(giveUp);
    };
  }, [started]);

  // When the move ends, the bar fills, then fades out.
  useEffect(() => {
    if (started || !visible) return;
    // The bar was showing and the move has ended, so it finishes before it hides.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFinishing(true);
    setAnnouncement("");
    const hide = window.setTimeout(() => {
      setVisible(false);
      setFinishing(false);
    }, 300);
    return () => window.clearTimeout(hide);
  }, [started, visible]);

  const office = pathname.startsWith("/office");
  const barClass = ["nav-progress", visible ? "is-active" : "", finishing ? "is-done" : "", office ? "is-office" : ""].filter(Boolean).join(" ");

  return (
    <>
      <Suspense fallback={null}>
        <AddressWatch onChange={onAddress} />
      </Suspense>
      <div className={office ? "office nav-progress-root" : "nav-progress-root"} aria-hidden="true">
        <div className={barClass} />
      </div>
      <div className="nav-progress-status" role="status" aria-live="polite">
        {announcement}
      </div>
    </>
  );
}
