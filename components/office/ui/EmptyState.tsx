import { Icon, type IconName } from "@/components/office/ui/Icon";

type EmptyStateProps = {
  icon: IconName;
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
};

export function EmptyState({ icon, title, children, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <span className="empty-ic">
        <Icon name={icon} />
      </span>
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  );
}
