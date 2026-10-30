"use client";

import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Alert } from "@/components/office/ui/Alert";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { Table } from "@/components/office/ui/Table";
import { apiPath } from "@/lib/http/api-path";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import { GUEST_GRADES, MARGIN_MAX } from "@/lib/quote";

// The fields of one quote. Their names are the fields POST /api/office/rates reads for kind=quote.
type QuoteFields = {
  place: string;
  mode: string;
  startCity: string;
  grade: string;
  vehicle: string;
  days: string;
  adults: string;
  children: string;
  lapInfants: string;
  seatInfants: string;
  seasonPercent: string;
  guide: boolean;
  meals: boolean;
  night: string;
  nightRate: string;
  nightHotel: string;
  day: string;
  dayChange: string;
  dayVehicle: string;
  dayRent: string;
  dayFuel: string;
  extraName: string;
  extraAmount: string;
  otherNote: string;
  otherRent: string;
  otherFuel: string;
  otherToll: string;
  otherSeats: string;
};

type QuoteResult = {
  ok: true;
  subtotal: number;
  profit: number;
  total: number;
  seasonPercent: number;
  lines: { label: string; amount: number }[];
  nights: { night: number; rate: number; hotelName: string }[];
  days: { day: number; vehicle: string; rent: number; fuel: number; toll: number; cleared: boolean }[];
  averageNightly: number;
  averageGrade: string;
  nearestGrade: boolean;
  hotelName: string;
  vehicleName: string;
};

type Priced = { result: QuoteResult } | { error: string } | null;

const OTHER = "Other";

function rupees(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-US")}`;
}

function isWhole(value: string) {
  return /^\d+$/.test(value.trim());
}

// The same quote as JSON for POST /api/quote, which prices it for an Owner or a Manager with the
// lines and the profit. The edits go as lists; this screen has one night edit and one day edit.
function quoteRequest(fields: QuoteFields) {
  const body: Record<string, unknown> = {
    place: fields.place,
    startCity: fields.startCity,
    mode: fields.mode,
    days: fields.days,
    adults: fields.adults,
    children: fields.children || "0",
    lapInfants: fields.lapInfants || "0",
    seatInfants: fields.seatInfants || "0",
    grade: fields.grade,
    vehicle: fields.vehicle,
    guide: fields.guide,
    meals: fields.meals,
    seasonPercent: fields.seasonPercent,
    otherNote: fields.otherNote,
  };
  if (fields.vehicle === OTHER) {
    Object.assign(body, { otherRent: fields.otherRent, otherFuel: fields.otherFuel, otherToll: fields.otherToll, otherSeats: fields.otherSeats });
  }
  if (fields.night.trim() || fields.nightRate.trim()) {
    body.nightEdits = [{ night: fields.night, rate: fields.nightRate, hotelName: fields.nightHotel }];
  }
  if (fields.dayChange === "clear") body.dayEdits = [{ day: fields.day, cleared: true }];
  if (fields.dayChange === "jeep") body.dayEdits = [{ day: fields.day, jeep: true, rent: fields.dayRent, fuel: fields.dayFuel }];
  if (fields.dayChange === "vehicle") body.dayEdits = [{ day: fields.day, vehicle: fields.dayVehicle }];
  if (fields.extraName.trim() || fields.extraAmount.trim()) {
    body.paidExtras = [{ name: fields.extraName, amount: fields.extraAmount }];
  }
  return body;
}

type QuoteScreenProps = {
  places: string[];
  vehicles: string[];
  margin: number;
};

// The Quote tab in the Meadow layout: the trip and the edits on the left, and the price on the
// right. The edits are the ones the office already had: one night, one day, and a paid extra.
export function QuoteScreen({ places, vehicles, margin }: QuoteScreenProps) {
  const [fields, setFields] = useState<QuoteFields>({
    place: places.includes("Skardu Valley") ? "Skardu Valley" : places[0] ?? "",
    mode: "road",
    startCity: "Islamabad",
    grade: "Deluxe",
    vehicle: vehicles.includes("Gli Car") ? "Gli Car" : vehicles[0] ?? OTHER,
    days: "5",
    adults: "2",
    children: "0",
    lapInfants: "0",
    seatInfants: "0",
    seasonPercent: String(margin),
    guide: false,
    meals: false,
    night: "",
    nightRate: "",
    nightHotel: "",
    day: "",
    dayChange: "",
    dayVehicle: "",
    dayRent: "",
    dayFuel: "",
    extraName: "",
    extraAmount: "",
    otherNote: "",
    otherRent: "",
    otherFuel: "",
    otherToll: "",
    otherSeats: "",
  });
  const [priced, setPriced] = useState<Priced>(null);
  const [pricing, setPricing] = useState(false);
  const [saved, setSaved] = useState<ActionResult | null>(null);
  const [saving, startSaving] = useTransition();
  const requestCount = useRef(0);

  const set = <K extends keyof QuoteFields>(name: K, value: QuoteFields[K]) => {
    setSaved(null);
    setFields((current) => ({ ...current, [name]: value }));
  };

  // Price the quote a moment after the last change. Only the newest answer is shown.
  useEffect(() => {
    const request = ++requestCount.current;
    const timer = window.setTimeout(async () => {
      setPricing(true);
      try {
        const response = await fetch(apiPath("/api/quote"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(quoteRequest(fields)),
        });
        const body = (await response.json()) as QuoteResult | { ok: false; error: string };
        if (request !== requestCount.current) return;
        setPriced(body.ok ? { result: body } : { error: body.error });
      } catch {
        if (request === requestCount.current) setPriced({ error: "The quote could not be priced. Check the connection." });
      } finally {
        if (request === requestCount.current) setPricing(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [fields]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    form.set("kind", "quote");
    for (const [name, value] of Object.entries(fields)) {
      if (typeof value === "boolean") {
        if (value) form.set(name, "on");
      } else {
        form.set(name, value);
      }
    }
    startSaving(async () => setSaved(await postOfficeForm("/api/office/rates", form)));
  };

  const result = priced && "result" in priced ? priced.result : null;
  const editedNight = Number(fields.night);
  const editedDay = fields.dayChange ? Number(fields.day) : 0;
  const marginSlider = isWhole(fields.seasonPercent) ? Math.min(Number(fields.seasonPercent), MARGIN_MAX) : margin;
  const text = (name: keyof QuoteFields, label: string, extra: { numeric?: boolean; optional?: boolean; help?: string } = {}) => (
    <Field id={`quote-${name}`} label={label} optional={extra.optional} help={extra.help}>
      <input
        className="input"
        id={`quote-${name}`}
        name={name}
        inputMode={extra.numeric ? "numeric" : undefined}
        autoComplete="off"
        value={String(fields[name])}
        aria-describedby={extra.help ? helpId(`quote-${name}`) : undefined}
        onChange={(event) => set(name, event.target.value)}
      />
    </Field>
  );
  const choose = (name: keyof QuoteFields, label: string, options: [string, string][], help?: string) => (
    <Field id={`quote-${name}`} label={label} help={help}>
      <select
        className="select"
        id={`quote-${name}`}
        name={name}
        value={String(fields[name])}
        aria-describedby={help ? helpId(`quote-${name}`) : undefined}
        onChange={(event) => set(name, event.target.value)}
      >
        {options.map(([value, optionLabel]) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <form onSubmit={submit} className="stack">
      <div className="quote-form">
        <div className="quote-side">
          <Card title="Trip" description="The starting quote uses one hotel rate on every night and one vehicle on every day.">
            <div className="form-grid">
              {choose("place", "Place", places.map((place) => [place, place]))}
              {choose("mode", "Travel by", [["road", "Road"], ["air", "Air"]])}
              {choose("startCity", "Start city", [["Islamabad", "Islamabad"], ["Lahore", "Lahore"], ["Karachi", "Karachi"]], "Karachi starts are by air only.")}
              {choose("grade", "Hotel grade", GUEST_GRADES.map((grade) => [grade, grade]))}
              {choose("vehicle", "Vehicle", [...vehicles.map((name): [string, string] => [name, name]), [OTHER, "Other, typed below"]])}
              {text("days", "Days", { numeric: true })}
              {text("adults", "Adults", { numeric: true })}
              {text("children", "Children", { numeric: true })}
              {text("lapInfants", "Lap infants", { numeric: true })}
              {text("seatInfants", "Infants with a seat", { numeric: true })}
              <div className="field">
                <label className="label" htmlFor="quote-seasonPercent">
                  Profit margin for this quote, percent
                </label>
                <input
                  className="input"
                  id="quote-seasonPercent"
                  name="seasonPercent"
                  inputMode="numeric"
                  autoComplete="off"
                  value={fields.seasonPercent}
                  aria-describedby={helpId("quote-seasonPercent")}
                  onChange={(event) => set("seasonPercent", event.target.value)}
                />
                <p className="help" id={helpId("quote-seasonPercent")}>
                  Starts at the saved margin, {margin} percent. Guests always get the saved margin.
                </p>
              </div>
              <div className="field">
                <label className="label" htmlFor="quote-margin-slider">
                  Profit margin slider
                </label>
                <input
                  className="range"
                  id="quote-margin-slider"
                  type="range"
                  min={0}
                  max={MARGIN_MAX}
                  step={1}
                  value={marginSlider}
                  aria-valuetext={`${marginSlider} percent`}
                  onChange={(event) => set("seasonPercent", event.target.value)}
                />
              </div>
              <div className="field full quote-checks">
                <label className="check">
                  <input type="checkbox" name="guide" checked={fields.guide} onChange={(event) => set("guide", event.target.checked)} />
                  <span>Guide</span>
                </label>
                <label className="check">
                  <input type="checkbox" name="meals" checked={fields.meals} onChange={(event) => set("meals", event.target.checked)} />
                  <span>Meals</span>
                </label>
              </div>
            </div>
          </Card>

          {fields.vehicle === OTHER ? (
            <Card title="Other vehicle" description="A mix the rate tables do not have. Every amount is checked by the server.">
              <div className="form-grid">
                <div className="field full">
                  <label className="label" htmlFor="quote-otherNote">
                    The mix
                  </label>
                  <input className="input" id="quote-otherNote" name="otherNote" value={fields.otherNote} placeholder="For example, a Prado and a Gli car" onChange={(event) => set("otherNote", event.target.value)} />
                </div>
                {text("otherRent", "Rent per day", { numeric: true })}
                {text("otherFuel", "Fuel per day", { numeric: true })}
                {text("otherToll", "Toll", { numeric: true })}
                {text("otherSeats", "Seats", { numeric: true })}
              </div>
            </Card>
          ) : null}

          <Card title="Change one night" description="A different hotel rate on one night. The other nights stay as they were (BR-46).">
            <div className="form-grid">
              {text("night", "Night number", { numeric: true, optional: true })}
              {text("nightRate", "Rate for that night", { numeric: true, optional: true })}
              <div className="field full">
                <label className="label" htmlFor="quote-nightHotel">
                  Hotel for that night <span className="opt">(optional)</span>
                </label>
                <input className="input" id="quote-nightHotel" name="nightHotel" value={fields.nightHotel} onChange={(event) => set("nightHotel", event.target.value)} />
              </div>
            </div>
          </Card>

          <Card title="Change one day" description="No vehicle, a jeep, or a higher vehicle on one day (BR-47).">
            <div className="form-grid">
              {choose("dayChange", "That day", [["", "Keep the vehicle"], ["clear", "No vehicle"], ["jeep", "Jeep"], ["vehicle", "Higher vehicle"]])}
              {text("day", "Day number", { numeric: true, optional: !fields.dayChange })}
              {fields.dayChange === "vehicle" ? choose("dayVehicle", "Higher vehicle", [["", "Choose a vehicle"], ...vehicles.map((name): [string, string] => [name, name])]) : null}
              {fields.dayChange === "jeep" ? text("dayRent", "Jeep rent", { numeric: true }) : null}
              {fields.dayChange === "jeep" ? text("dayFuel", "Jeep fuel", { numeric: true }) : null}
            </div>
          </Card>

          <Card title="Paid extra" description="One added cost, such as a permit or an entry ticket.">
            <div className="form-grid">
              {text("extraName", "What it is", { optional: true })}
              {text("extraAmount", "Amount", { numeric: true, optional: true })}
            </div>
          </Card>

          {result ? (
            <Card title="Nights and days" description="Each night's hotel rate and each day's vehicle. The edited night or day is marked.">
              <div className="form-grid">
                <Table label="Nights" flat>
                  <thead>
                    <tr>
                      <th scope="col">Night</th>
                      <th scope="col" className="r">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.nights.map((row) => (
                      <tr key={row.night} className={row.night === editedNight ? "is-edited" : undefined}>
                        <td>Night {row.night}</td>
                        <td className="r">{rupees(row.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Table label="Days" flat>
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">Vehicle</th>
                      <th scope="col" className="r">
                        Rent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.days.map((row) => (
                      <tr key={row.day} className={row.day === editedDay ? "is-edited" : undefined}>
                        <td>Day {row.day}</td>
                        <td>{row.cleared ? "No vehicle" : row.vehicle}</td>
                        <td className="r">{rupees(row.rent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          ) : null}
        </div>

        <section className="card quote-result" aria-label="This quote" aria-busy={pricing}>
          <div className="card-head">
            <div>
              <h3>This quote</h3>
              <p>
                {fields.place}, {fields.days} days, {fields.adults} adults{pricing ? " · pricing…" : ""}
              </p>
            </div>
          </div>
          <div className="card-body" aria-live="polite">
            {priced && "error" in priced ? <Alert tone="warning" title="This quote cannot be priced yet" role="status">{priced.error}</Alert> : null}
            {result ? (
              <>
                <dl className="sum">
                  {result.lines.map((line, index) => (
                    <Fragment key={`${index}-${line.label}`}>
                      <dt>{line.label}</dt>
                      <dd>{rupees(line.amount)}</dd>
                    </Fragment>
                  ))}
                  <dt className="sum-sub">Subtotal</dt>
                  <dd className="sum-sub">{rupees(result.subtotal)}</dd>
                  <dt>Profit, {result.seasonPercent} percent</dt>
                  <dd>{rupees(result.profit)}</dd>
                  <dt className="sum-total">Guest total</dt>
                  <dd className="sum-total">{rupees(result.total)}</dd>
                  {result.averageNightly ? (
                    <>
                      <dt>Average nightly rate</dt>
                      <dd>{rupees(result.averageNightly)}</dd>
                      <dt>Hotel grade</dt>
                      <dd>
                        {result.averageGrade}
                        {result.nearestGrade ? " (nearest)" : ""}
                      </dd>
                    </>
                  ) : null}
                </dl>
                <p className="help">The guest sees one total, {rupees(result.total)}, with no lines and no profit.</p>
              </>
            ) : !priced ? (
              <p className="help">Pricing…</p>
            ) : null}
          </div>
        </section>
      </div>
      <SaveBar label="Save quote" pending={saving} result={saved} hint="Saving keeps this quote with its nights and days." />
    </form>
  );
}
