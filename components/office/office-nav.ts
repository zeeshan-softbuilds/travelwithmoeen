import type { IconName } from "@/components/office/ui/Icon";
import type { OfficeSession } from "@/lib/http/office-session";

// Remembers the collapsed sidebar for this browser. Read on the server so the first paint is right.
export const SIDEBAR_COOKIE = "twm_office_sidebar";

export type OfficeNavLink = {
  href: string;
  label: string;
  icon: IconName;
};

export type OfficeNavGroup = {
  title: string;
  links: OfficeNavLink[];
};

type Allowed = (user: OfficeSession) => boolean;
type GatedLink = OfficeNavLink & { allowed: Allowed };

const anyRole: Allowed = () => true;
const canEditRates: Allowed = (user) => user.canEditRates;
const canEditContent: Allowed = (user) => user.canEditContent;

// NAV in docs/office-design/src/screens.js. Trip plans is prototype only. Hiding a link does
// not replace the server check on each page and route.
const NAV: { title: string; links: GatedLink[] }[] = [
  {
    title: "Overview",
    links: [
      { href: "/office", label: "Dashboard", icon: "home", allowed: anyRole },
      { href: "/office/requests", label: "Requests", icon: "inbox", allowed: anyRole },
    ],
  },
  {
    title: "Sales",
    links: [{ href: "/office/rates", label: "Rates and quotes", icon: "tag", allowed: canEditRates }],
  },
  {
    title: "Content",
    links: [
      { href: "/office/tours", label: "Tours", icon: "map", allowed: canEditContent },
      { href: "/office/places", label: "Places", icon: "pin", allowed: canEditContent },
      { href: "/office/blog", label: "Blog", icon: "file", allowed: canEditContent },
      { href: "/office/gallery", label: "Gallery", icon: "image", allowed: canEditContent },
      { href: "/office/reviews", label: "Reviews", icon: "star", allowed: canEditContent },
      { href: "/office/slides", label: "Home slides", icon: "slides", allowed: canEditContent },
      { href: "/office/site", label: "Site details", icon: "sliders", allowed: canEditContent },
    ],
  },
  {
    title: "Admin",
    links: [
      { href: "/office/users", label: "Users", icon: "users", allowed: (user) => user.canManageUsers },
      { href: "/office/backup", label: "Backups", icon: "database", allowed: (user) => user.canRunBackup },
    ],
  },
];

// The New menu in the top bar. Each item opens the page that holds that form.
const NEW_LINKS: GatedLink[] = [
  { href: "/office/rates", label: "New quote", icon: "calc", allowed: canEditRates },
  { href: "/office/tours/new", label: "New tour", icon: "map", allowed: canEditContent },
  { href: "/office/gallery", label: "Gallery photo", icon: "image", allowed: canEditContent },
  { href: "/office/reviews", label: "Review", icon: "star", allowed: canEditContent },
  { href: "/office/slides", label: "Home slide", icon: "slides", allowed: canEditContent },
  { href: "/office/users", label: "Office login", icon: "users", allowed: (user) => user.canManageUsers },
];

function visibleLinks(links: GatedLink[], user: OfficeSession): OfficeNavLink[] {
  return links.filter((link) => link.allowed(user)).map(({ href, label, icon }) => ({ href, label, icon }));
}

export function officeNavFor(user: OfficeSession): OfficeNavGroup[] {
  return NAV.map((group) => ({ title: group.title, links: visibleLinks(group.links, user) })).filter(
    (group) => group.links.length > 0,
  );
}

export function officeNewLinksFor(user: OfficeSession): OfficeNavLink[] {
  return visibleLinks(NEW_LINKS, user);
}

export function isCurrentOfficeLink(href: string, pathname: string) {
  if (href === "/office") return pathname === "/office";
  return pathname === href || pathname.startsWith(`${href}/`);
}
