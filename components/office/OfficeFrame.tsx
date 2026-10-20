"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { SignOutButton } from "@/components/office/SignOutButton";
import {
  SIDEBAR_COOKIE,
  isCurrentOfficeLink,
  type OfficeNavGroup,
  type OfficeNavLink,
} from "@/components/office/office-nav";
import { Button } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import type { Role } from "@/lib/http/result";

const ROLE_NAME: Record<Role, string> = { owner: "Owner", manager: "Manager", editor: "Editor" };
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type OpenMenu = "new" | "account" | null;

type OfficeFrameProps = {
  email: string;
  role: Role;
  nav: OfficeNavGroup[];
  newLinks: OfficeNavLink[];
  newRequestCount: number;
  startCollapsed: boolean;
  children: React.ReactNode;
};

function initialsOf(email: string) {
  return email.split("@")[0].replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "TM";
}

function firstFocusable(root: HTMLElement | null) {
  return root?.querySelector<HTMLElement>("a, button") ?? null;
}

export function OfficeFrame({ email, role, nav, newLinks, newRequestCount, startCollapsed, children }: OfficeFrameProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const [navOpen, setNavOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [shownPath, setShownPath] = useState(pathname);

  const sideRef = useRef<HTMLElement>(null);
  const navButtonRef = useRef<HTMLButtonElement>(null);
  const newWrapRef = useRef<HTMLDivElement>(null);
  const accountWrapRef = useRef<HTMLDivElement>(null);

  // A new page closes the phone menu and any open menu.
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setNavOpen(false);
    setOpenMenu(null);
  }

  const currentLabel = nav.flatMap((group) => group.links).find((link) => isCurrentOfficeLink(link.href, pathname))?.label ?? "Office";

  useEffect(() => {
    if (navOpen) firstFocusable(sideRef.current?.querySelector("nav") ?? null)?.focus();
  }, [navOpen]);

  useEffect(() => {
    const wrap = openMenu === "new" ? newWrapRef.current : openMenu === "account" ? accountWrapRef.current : null;
    if (!wrap) return;
    firstFocusable(wrap.querySelector<HTMLElement>(".pop"))?.focus();

    const closeOutside = (event: PointerEvent) => {
      if (!wrap.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [openMenu]);

  useEffect(() => {
    if (!navOpen && !openMenu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openMenu) {
        const wrap = openMenu === "new" ? newWrapRef.current : accountWrapRef.current;
        setOpenMenu(null);
        wrap?.querySelector<HTMLElement>("[aria-haspopup]")?.focus();
        return;
      }
      setNavOpen(false);
      navButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [navOpen, openMenu]);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => setOpenMenu((current) => (current === menu ? null : menu));

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE}=${next ? "collapsed" : "open"}; path=/office; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
  };

  const shellClass = ["shell-side", collapsed ? "is-collapsed" : "", navOpen ? "nav-open" : ""].filter(Boolean).join(" ");

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className={shellClass}>
        <aside className="side" id="office-side" aria-label="Office" ref={sideRef}>
          <div className="brand">
            <span className="logo" aria-hidden="true">
              TM
            </span>
            <span className="brand-text">
              <b>Travel With Moeen</b>
              <small>Office</small>
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              className="side-toggle"
              icon="sidebar"
              aria-pressed={collapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={toggleCollapsed}
            >
              <span className="sr-only">Collapse sidebar</span>
            </Button>
            <Button
              variant="ghost"
              iconOnly
              className="only-mobile side-close"
              icon="x"
              onClick={() => {
                setNavOpen(false);
                navButtonRef.current?.focus();
              }}
            >
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          <nav className="nav" aria-label="Main">
            {nav.map((group) => (
              <Fragment key={group.title}>
                <div className="nav-sec">{group.title}</div>
                {group.links.map((link) => (
                  <Link
                    className="nav-item"
                    href={link.href}
                    key={link.href}
                    title={collapsed ? link.label : undefined}
                    aria-current={isCurrentOfficeLink(link.href, pathname) ? "page" : undefined}
                    onClick={() => setNavOpen(false)}
                  >
                    <Icon name={link.icon} />
                    <span className="nav-label">{link.label}</span>
                    {link.href === "/office/requests" && newRequestCount > 0 ? (
                      <span className="count">
                        {newRequestCount}
                        <span className="sr-only"> new</span>
                      </span>
                    ) : null}
                  </Link>
                ))}
              </Fragment>
            ))}
          </nav>

          <div className="pop-wrap me-wrap" ref={accountWrapRef}>
            <button
              className="me"
              type="button"
              aria-expanded={openMenu === "account"}
              aria-haspopup="true"
              title={collapsed ? email : undefined}
              onClick={() => toggleMenu("account")}
            >
              <span className="avatar" aria-hidden="true">
                {initialsOf(email)}
              </span>
              <span className="me-text">
                <b>{email}</b>
                <small>{ROLE_NAME[role]}</small>
              </span>
              <Icon name="chevU" className="me-chev" />
            </button>
            <div className="pop pop-up" hidden={openMenu !== "account"}>
              <div className="pop-head">
                <b>{email}</b>
                <small>Signed in as {ROLE_NAME[role]}</small>
              </div>
              <SignOutButton />
            </div>
          </div>
        </aside>

        <div
          className="side-scrim"
          aria-hidden="true"
          onClick={() => {
            setNavOpen(false);
            navButtonRef.current?.focus();
          }}
        />

        <div className="body">
          <header className="topbar">
            <Button
              variant="ghost"
              iconOnly
              className="only-mobile"
              icon="menu"
              ref={navButtonRef}
              aria-controls="office-side"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <span className="sr-only">Open menu</span>
            </Button>
            <span className="topbar-title">{currentLabel}</span>
            <span className="spacer" />
            {newLinks.length > 0 ? (
              <div className="pop-wrap" ref={newWrapRef}>
                <Button
                  variant="primary"
                  size="sm"
                  icon="plus"
                  aria-expanded={openMenu === "new"}
                  aria-haspopup="true"
                  onClick={() => toggleMenu("new")}
                >
                  <span>New</span>
                </Button>
                <div className="pop pop-right" hidden={openMenu !== "new"}>
                  {newLinks.map((link) => (
                    <Link className="pop-item" href={link.href} key={link.label} onClick={() => setOpenMenu(null)}>
                      <Icon name={link.icon} />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </header>
          <main id="main" className="main" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
