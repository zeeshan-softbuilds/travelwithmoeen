"use client";

// Moved unchanged from the old RatesDesk. T-37f replaces the season control with the margin, and
// T-37g restyles the quote form.
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import { GUEST_GRADES } from "@/lib/quote";
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

export function SeasonForm({ percent }: { percent: 15 | 20 }) {
  const [state, action, pending] = useRateAction();
  return (
    <form action={action} className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Season</h2>
      <input name="kind" type="hidden" value="season" />
      <label className="mt-4 block text-sm" htmlFor="percent">Active profit</label>
      <select className="mt-1 rounded-md border px-3 py-2" defaultValue={String(percent)} id="percent" name="percent">
        <option value="15">15 percent</option>
        <option value="20">20 percent</option>
      </select>
      <Note state={state} />
      <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white" disabled={pending} type="submit">Save season</button>
    </form>
  );
}

export function QuoteForm({ places, vehicles }: { places: string[]; vehicles: Vehicle[] }) {
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
        <label className="block text-sm">Season
          <select className="mt-1 w-full rounded-md border px-3 py-2" name="seasonPercent" defaultValue="20">
            <option value="20">20 percent</option>
            <option value="15">15 percent</option>
          </select>
        </label>
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
