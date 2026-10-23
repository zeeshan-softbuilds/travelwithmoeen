import Link from "next/link";
import { RatesTabs } from "@/components/office/rates/RatesTabs";
import { buttonClass } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";

// Each rates page checks the role itself, so a page reached directly is still Owner and Manager only.
export default function RatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHead
        title="Rates and quotes"
        description="Prices behind every guest quote. A saved change applies to new quotes at once."
        actions={
          <Link className={buttonClass()} href="/office/rates/quote">
            <Icon name="calc" />
            New quote
          </Link>
        }
      />
      <RatesTabs />
      {children}
    </>
  );
}
