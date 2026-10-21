import { Icon, type IconName } from "@/components/office/ui/Icon";

export type AlertTone = "info" | "success" | "warning" | "danger";

const TONE_ICON: Record<AlertTone, IconName> = {
  info: "info",
  success: "checkCircle",
  warning: "alert",
  danger: "errorCircle",
};

type AlertProps = {
  tone: AlertTone;
  title: string;
  role?: "alert" | "status" | "note";
  children?: React.ReactNode;
};

export function Alert({ tone, title, role = "note", children }: AlertProps) {
  return (
    <div className={`alert a-${tone}`} role={role}>
      <Icon name={TONE_ICON[tone]} />
      <div>
        <b>{title}</b>
        {children ? <p>{children}</p> : null}
      </div>
    </div>
  );
}
