type TableProps = {
  label: string;
  flat?: boolean;
  plain?: boolean;
  children: React.ReactNode;
};

// A scrollable table. On a phone each row becomes a card, so every td except the
// first sets data-label to its column name.
export function Table({ label, flat = false, plain = false, children }: TableProps) {
  return (
    <div className={flat ? "tbl-wrap flat" : "tbl-wrap"} tabIndex={0} role="region" aria-label={label}>
      <table className={plain ? "tbl tbl-plain" : "tbl"}>{children}</table>
    </div>
  );
}
