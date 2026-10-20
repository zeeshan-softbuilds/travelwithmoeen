import Link from "next/link";
import { Icon, type IconName } from "@/components/office/ui/Icon";

type StatProps = {
  label: string;
  value: React.ReactNode;
  meta?: string;
  icon?: IconName;
  href?: string;
  current?: boolean;
};

// One figure on the dashboard. With href, the whole tile is a link.
export function Stat({ label, value, meta, icon, href, current = false }: StatProps) {
  const className = current ? "stat is-current" : "stat";
  const body = (
    <>
      <span className="stat-k">
        {icon ? <Icon name={icon} /> : null}
        {label}
      </span>
      <span className="stat-v">{value}</span>
      {meta ? <span className="stat-m">{meta}</span> : null}
    </>
  );
  if (href) {
    return (
      <Link className={className} href={href}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}

export function Stats({ children }: { children: React.ReactNode }) {
  return <div className="stats">{children}</div>;
}
