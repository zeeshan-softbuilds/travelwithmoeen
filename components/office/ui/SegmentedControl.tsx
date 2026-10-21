export type SegmentOption = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  name: string;
  legend: string;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

// The prototype seg-status: one choice from a few, such as a request status.
// Pass value and onChange to control it, or defaultValue inside a form.
export function SegmentedControl({ name, legend, options, value, defaultValue, disabled = false, onChange }: SegmentedControlProps) {
  return (
    <fieldset className="seg-status" disabled={disabled}>
      <legend className="label">{legend}</legend>
      <div className="seg-track">
        {options.map((option) => (
          <label className="seg-opt" key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === undefined ? undefined : value === option.value}
              defaultChecked={value === undefined ? defaultValue === option.value : undefined}
              onChange={onChange ? () => onChange(option.value) : undefined}
              readOnly={value !== undefined && !onChange}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
