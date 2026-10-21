type CardProps = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  danger?: boolean;
  id?: string;
  // Children sit straight under the head, for a list that runs edge to edge.
  flush?: boolean;
  children: React.ReactNode;
};

export function Card({ title, description, actions, danger = false, id, flush = false, children }: CardProps) {
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
      {flush ? children : <div className="card-body">{children}</div>}
    </section>
  );
}
