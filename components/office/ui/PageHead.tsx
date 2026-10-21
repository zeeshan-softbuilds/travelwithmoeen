type PageHeadProps = {
  title: string;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageHead({ title, description, badge, actions }: PageHeadProps) {
  return (
    <div className="page-head">
      <div>
        <h1>
          {title}
          {badge}
        </h1>
        {description ? <p className="desc">{description}</p> : null}
      </div>
      {actions ? <div className="ph-actions">{actions}</div> : null}
    </div>
  );
}
