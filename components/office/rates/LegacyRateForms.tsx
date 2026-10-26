"use client";

// The quote form, moved from the old RatesDesk. T-37f gave it the margin slider. T-37g restyles it.
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import { GUEST_GRADES, MARGIN_MAX } from "@/lib/quote";
import type { Vehicle } from "@/components/office/rates/types";

function useRateAction() {
  const router = useRouter();
  return useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/rates", formData);
    if (result.ok) router.refresh();
    return result;
  }, null as ActionResult | null);
}

function Note({ state }: { state: ActionResult | null }) {
  if (!state || state.ok) return null;
  return <p className="mt-3 text-sm text-red-700">{state.error}</p>;
}

export function QuoteForm({ places, vehicles, margin }: { places: string[]; vehicles: Vehicle[]; margin: number }) {
  const [quoteMargin, setQuoteMargin] = useState(String(margin));
  const vehicleNames = [...new Set(vehicles.filter((row) => row.live).map((row) => row.vehicle))];
  const [state, action, pending] = useRateAction();
  return (
    <form action={action} className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Quote</h2>
      <input name="kind" type="hidden" value="quote" />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block text-sm">Place
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="place" defaultValue="Skardu Valley">
            {places.map((place) => <option key={place}>{place}</option>)}
          </select>
        </label>
        <label className="block text-sm">Mode
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="mode" defaultValue="road">
            <option value="road">Road</option>
            <option value="air">Air</option>
          </select>
        </label>
        <label className="block text-sm">Start
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="startCity" defaultValue="Islamabad">
            <option>Islamabad</option>
            <option>Lahore</option>
            <option>Karachi</option>
          </select>
        </label>
        <label className="block text-sm">Grade
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="grade" defaultValue="Deluxe">
            {GUEST_GRADES.map((grade) => <option key={grade}>{grade}</option>)}
          </select>
        </label>
        <label className="block text-sm">Vehicle
          <input className="mt-1 w-full rounded-md border px-3 py-2" name="vehicle" defaultValue="Gli Car" />
        </label>
        <label className="block text-sm">Days<input className="mt-1 w-full rounded-md border px-3 py-2" name="days" defaultValue="5" /></label>
        <label className="block text-sm">Adults<input className="mt-1 w-full rounded-md border px-3 py-2" name="adults" defaultValue="2" /></label>
        <label className="block text-sm">Children<input className="mt-1 w-full rounded-md border px-3 py-2" name="children" defaultValue="0" /></label>
        <label className="block text-sm">Lap infants<input className="mt-1 w-full rounded-md border px-3 py-2" name="lapInfants" defaultValue="0" /></label>
        <label className="block text-sm">Infants with a seat<input className="mt-1 w-full rounded-md border px-3 py-2" name="seatInfants" defaultValue="0" /></label>
        <div className="block text-sm md:col-span-2">
          <label htmlFor="quote-margin">Profit margin for this quote, percent</label>
          <div className="mt-1 flex items-center gap-3">
            <input
              className="w-24 rounded-md border px-3 py-2"
              id="quote-margin"
              name="seasonPercent"
              inputMode="numeric"
              value={quoteMargin}
              onChange={(event) => setQuoteMargin(event.target.value)}
              aria-describedby="quote-margin-help"
            />
            <input
              className="range"
              type="range"
              min={0}
              max={MARGIN_MAX}
              step={1}
              value={/^\d+$/.test(quoteMargin) ? Math.min(Number(quoteMargin), MARGIN_MAX) : margin}
              onChange={(event) => setQuoteMargin(event.target.value)}
              aria-label="Profit margin for this quote, slider"
            />
          </div>
          <p className="mt-1 text-slate-500" id="quote-margin-help">
            Starts at the saved margin, {margin} percent. A whole number from 0 to 100. Guests always get the saved margin.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm"><input name="guide" type="checkbox" />Guide</label>
        <label className="flex items-center gap-2 text-sm"><input name="meals" type="checkbox" />Meals</label>
        <label className="block text-sm">Night number<input className="mt-1 w-full rounded-md border px-3 py-2" name="night" /></label>
        <label className="block text-sm">Night rate<input className="mt-1 w-full rounded-md border px-3 py-2" name="nightRate" /></label>
        <label className="block text-sm md:col-span-2">Night hotel<input className="mt-1 w-full rounded-md border px-3 py-2" name="nightHotel" /></label>
        <label className="block text-sm">Day<input className="mt-1 w-full rounded-md border px-3 py-2" name="day" /></label>
        <label className="block text-sm">That day
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="dayChange" defaultValue="">
            <option value="">Leave the vehicle</option>
            <option value="clear">No vehicle</option>
            <option value="jeep">Jeep</option>
            <option value="vehicle">Higher vehicle</option>
          </select>
        </label>
        <label className="block text-sm">Higher vehicle
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="dayVehicle" defaultValue="">
            <option value="">Choose a vehicle</option>
            {vehicleNames.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <label className="block text-sm">Jeep rent<input className="mt-1 w-full rounded-md border px-3 py-2" name="dayRent" /></label>
        <label className="block text-sm">Jeep fuel<input className="mt-1 w-full rounded-md border px-3 py-2" name="dayFuel" /></label>
        <label className="block text-sm">Paid extra<input className="mt-1 w-full rounded-md border px-3 py-2" name="extraName" /></label>
        <label className="block text-sm">Extra amount<input className="mt-1 w-full rounded-md border px-3 py-2" name="extraAmount" /></label>
        <label className="block text-sm md:col-span-2">Other mix<input className="mt-1 w-full rounded-md border px-3 py-2" name="otherNote" placeholder="Use vehicle Other, then type the mix" /></label>
        <label className="block text-sm">Other rent<input className="mt-1 w-full rounded-md border px-3 py-2" name="otherRent" /></label>
        <label className="block text-sm">Other fuel<input className="mt-1 w-full rounded-md border px-3 py-2" name="otherFuel" /></label>
        <label className="block text-sm">Other toll<input className="mt-1 w-full rounded-md border px-3 py-2" name="otherToll" /></label>
        <label className="block text-sm">Other seats<input className="mt-1 w-full rounded-md border px-3 py-2" name="otherSeats" /></label>
      </div>
      <Note state={state} />
      <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white" disabled={pending} type="submit">Save quote</button>
    </form>
  );
}
