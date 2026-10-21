type CardProps = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  danger?: boolean;
  id?: string;
  children: React.ReactNode;
};

export function Card({ title, description, actions, danger = false, id, children }: CardProps) {
  return (
    <section className={danger ? "card card-danger" : "card"} id={id}>
      {title ? (
        <div className="card-head">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
          </div>
          {actions}
        </div>
      ) : null}
      <div className="card-body">{children}</div>
    </section>
  );
}
