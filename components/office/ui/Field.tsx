// A label, its control, and an optional help line. The control sets
// aria-describedby to helpId(id) when help is given.
export function helpId(id: string) {
  return `${id}-help`;
}

type FieldProps = {
  id: string;
  label: string;
  help?: string;
  optional?: boolean;
  children: React.ReactNode;
};

export function Field({ id, label, help, optional = false, children }: FieldProps) {
  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
        {optional ? <span className="opt"> (optional)</span> : null}
      </label>
      {children}
      {help ? (
        <p className="help" id={helpId(id)}>
          {help}
        </p>
      ) : null}
    </div>
  );
}
