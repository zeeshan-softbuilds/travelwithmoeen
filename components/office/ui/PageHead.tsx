import { Icon } from "@/components/office/ui/Icon";

type PageHeadProps = {
  title: string;
  description?: React.ReactNode;
  // "Last saved 5 minutes ago by editor@…" for a screen that is one record (BR-86).
  savedBy?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageHead({ title, description, savedBy, badge, actions }: PageHeadProps) {
  return (
    <div className="page-head">
      <div>
        <h1>
          {title}
          {badge}
        </h1>
        {description ? <p className="desc">{description}</p> : null}
        {savedBy ? (
          <p className="meta">
            <Icon name="clock" />
            {savedBy}
          </p>
        ) : null}
      </div>
      {actions ? <div className="ph-actions">{actions}</div> : null}
    </div>
  );
}
