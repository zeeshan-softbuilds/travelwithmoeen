export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent" | "outline";

type BadgeProps = {
  tone?: BadgeTone;
  dot?: boolean;
  children: React.ReactNode;
};

export function Badge({ tone = "neutral", dot = false, children }: BadgeProps) {
  return (
    <span className={tone === "neutral" ? "badge" : `badge b-${tone}`}>
      {dot ? <span className="dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
