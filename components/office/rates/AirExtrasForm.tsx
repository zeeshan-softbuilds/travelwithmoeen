"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Air } from "@/components/office/rates/types";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

const FIELDS: { name: keyof Air; label: string }[] = [
  { name: "islamabadTicket", label: "Islamabad ticket" },
  { name: "lahoreAdd", label: "Lahore add" },
  { name: "karachiAdd", label: "Karachi add" },
  { name: "welcomePack", label: "Welcome pack" },
  { name: "entry", label: "Entry" },
  { name: "infantExtra", label: "Infant extra" },
  { name: "sticker", label: "Sticker" },
];

export function AirExtrasForm({ air, savedBy }: { air: Air; savedBy?: string }) {
  const router = useRouter();
  const [state, setState] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  // A plain submit, not a form action: a form action resets the fields, which would hide the amount
  // the server refused.
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    start(async () => {
      const result = await postOfficeForm("/api/office/rates", formData);
      setState(result);
      if (result.ok) router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="stack">
      <input type="hidden" name="kind" value="air" />
      <Card title="Air extras" description="Added to every By Air quote, per guest." savedBy={savedBy}>
        <div className="form-grid">
          {FIELDS.map((field) => (
            <Field key={field.name} id={`air-${field.name}`} label={field.label}>
              <span className="money">
                <span className="affix" aria-hidden="true">
                  Rs
                </span>
                <input className="input" id={`air-${field.name}`} name={field.name} inputMode="numeric" autoComplete="off" defaultValue={air[field.name]} />
              </span>
            </Field>
          ))}
        </div>
      </Card>
      <SaveBar label="Save air extras" pending={pending} result={state} hint="The server checks every amount when you save." />
    </form>
  );
}
