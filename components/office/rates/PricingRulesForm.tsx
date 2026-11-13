"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { PricingRules } from "@/components/office/rates/types";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Card } from "@/components/office/ui/Card";
import { Field, helpId } from "@/components/office/ui/Field";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

type RuleField = { name: keyof PricingRules; label: string; help: string; unit: "money" | "percent" | "people" };

const FIELDS: RuleField[] = [
  { name: "guidePerDay", label: "Tour guide, per day", help: "Added for each day of a trip with a guide.", unit: "money" },
  { name: "breakfastPerPerson", label: "Arrival breakfast, per adult and child", help: "Added once on a road trip of more than one day.", unit: "money" },
  { name: "childFarePercent", label: "Child air fare", help: "A whole percent of the adult fare, from 0 to 100.", unit: "percent" },
  { name: "lapInfantFare", label: "Lap infant air fare", help: "For each infant on a lap.", unit: "money" },
  { name: "seatInfantFare", label: "Infant with a seat air fare", help: "For each infant with their own seat.", unit: "money" },
  { name: "peoplePerRoom", label: "People per room", help: "Used for the automatic room count, from 1 to 6.", unit: "people" },
];

// BR-87: the pricing rules the quote reads. The server checks every value when you save.
export function PricingRulesForm({ rules, savedBy }: { rules: PricingRules; savedBy?: string }) {
  const router = useRouter();
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  // A plain submit, not a form action: a form action resets the fields, which would hide the value
  // the server refused.
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    start(async () => {
      const result = await postOfficeForm("/api/office/rates", formData, "Saving pricing rules");
      setState(result);
      if (result.ok) router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="stack" aria-busy={pending || undefined}>
      <fieldset className="form-lock" disabled={pending}>
      <input type="hidden" name="kind" value="pricing_rule" />
      <Card title="Pricing rules" description="Used by every new quote, in the office and on the website." savedBy={savedBy}>
        <div className="form-grid">
          {FIELDS.map((field) => {
            const id = `rule-${field.name}`;
            const input = (
              <input
                className="input"
                id={id}
                name={field.name}
                inputMode="numeric"
                autoComplete="off"
                defaultValue={rules[field.name]}
                aria-describedby={helpId(id)}
              />
            );
            return (
              <Field key={field.name} id={id} label={field.label} help={field.help}>
                {field.unit === "money" ? (
                  <span className="money">
                    <span className="affix" aria-hidden="true">
                      Rs
                    </span>
                    {input}
                  </span>
                ) : field.unit === "percent" ? (
                  <span className="money">
                    {input}
                    <span className="affix" aria-hidden="true">
                      %
                    </span>
                  </span>
                ) : (
                  input
                )}
              </Field>
            );
          })}
        </div>
      </Card>
      </fieldset>
      <SaveBar label="Save pricing rules" pending={pending} result={state} hint="A saved rule applies at once to new quotes." />
    </form>
  );
}
