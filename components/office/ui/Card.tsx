import { Icon } from "@/components/office/ui/Icon";

type CardProps = {
  title?: string;
  description?: string;
  // "Last saved 5 minutes ago by manager@…" for a card that is one record (BR-86).
  savedBy?: string;
  actions?: React.ReactNode;
  danger?: boolean;
  id?: string;
  // Children sit straight under the head, for a list that runs edge to edge.
  flush?: boolean;
  children: React.ReactNode;
};

export function Card({ title, description, savedBy, actions, danger = false, id, flush = false, children }: CardProps) {
  return (
    <section className={danger ? "card card-danger" : "card"} id={id}>
      {title ? (
        <div className="card-head">
          <div>
            <h3>{title}</h3>
            {description ? <p>{description}</p> : null}
            {savedBy ? (
              <p className="meta">
                <Icon name="clock" />
                {savedBy}
              </p>
            ) : null}
          </div>
          {actions}
        </div>
      ) : null}
      {flush ? children : <div className="card-body">{children}</div>}
    </section>
  );
}
