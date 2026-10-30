"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Card } from "@/components/office/ui/Card";
import { helpId } from "@/components/office/ui/Field";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import { MARGIN_MAX } from "@/lib/quote";

// The saved profit margin: one whole percent from 0 to 100, with a slider (BR-22). The server
// checks the number. The number box and the slider follow each other.
export function MarginForm({ margin, savedBy }: { margin: number; savedBy?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(String(margin));
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const sliderValue = /^\d+$/.test(value) ? Math.min(Number(value), MARGIN_MAX) : margin;

  // A plain submit keeps a refused number in the box, so the message and the box agree.
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    start(async () => {
      const saved = await postOfficeForm("/api/office/rates", formData);
      setResult(saved);
      if (saved.ok) router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="stack">
      <input type="hidden" name="kind" value="season" />
      <Card title="Profit margin" description={`Added last to every quote, after the costs. Saved now: ${margin} percent.`} savedBy={savedBy}>
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="margin-percent">
              Percent
            </label>
            <input
              className="input"
              id="margin-percent"
              name="percent"
              inputMode="numeric"
              autoComplete="off"
              value={value}
              aria-describedby={helpId("margin-percent")}
              aria-invalid={result && !result.ok ? true : undefined}
              onChange={(event) => setValue(event.target.value)}
            />
            <p className="help" id={helpId("margin-percent")}>
              Any whole number from 0 to 100. Guests get this saved margin. The starting value is 20 percent until Moeen confirms it.
            </p>
          </div>
          <div className="field">
            <label className="label" htmlFor="margin-slider">
              Profit margin slider
            </label>
            <input
              className="range"
              id="margin-slider"
              type="range"
              min={0}
              max={MARGIN_MAX}
              step={1}
              value={sliderValue}
              aria-valuetext={`${sliderValue} percent`}
              onChange={(event) => setValue(event.target.value)}
            />
            <p className="help">0 to 100 percent.</p>
          </div>
        </div>
      </Card>
      <SaveBar label="Save profit margin" pending={pending} result={result} hint="A quote screen can still use another margin for one quote." />
    </form>
  );
}
