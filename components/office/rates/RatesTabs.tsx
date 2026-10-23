"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const RATE_TABS = [
  { href: "/office/rates", label: "Hotels" },
  { href: "/office/rates/vehicles", label: "Vehicles" },
  { href: "/office/rates/jeeps", label: "Jeep lines" },
  { href: "/office/rates/air", label: "Air extras" },
  { href: "/office/rates/margin", label: "Profit margin" },
  { href: "/office/rates/quote", label: "Quote" },
];

export function RatesTabs() {
  const pathname = usePathname();
  return (
    <nav className="tabs" aria-label="Rates">
      {RATE_TABS.map((tab) => (
        <Link className="tab" href={tab.href} key={tab.href} aria-current={pathname === tab.href ? "page" : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
