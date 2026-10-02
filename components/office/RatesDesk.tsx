"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import { GUEST_GRADES } from "@/lib/quote";

type Hotel = {
  id: number;
  place: string;
  startCity: string;
  grade: string;
  twin: number;
  triple: number;
  hotelName: string;
  offered: boolean;
};
type Vehicle = {
  id: number;
  place: string;
  startCity: string;
  mode: string;
  vehicle: string;
  rent: number;
  fuel: number;
  toll: number;
  seats: number;
  live: boolean;
};
type Air = {
  islamabadTicket: number;
  lahoreAdd: number;
  karachiAdd: number;
  welcomePack: number;
  entry: number;
  infantExtra: number;
  sticker: number;
};
type Jeep = { id: number; place: string; mode: string; label: string; amount: number; live: boolean };

export function RatesDesk({
  desk,
}: {
  desk: { hotels: Hotel[]; vehicles: Vehicle[]; air: Air | null; jeeps: Jeep[]; seasonPercent: 15 | 20 };
}) {
  const [hotelId, setHotelId] = useState(String(desk.hotels[0]?.id ?? ""));
  const [vehicleId, setVehicleId] = useState(String(desk.vehicles[0]?.id ?? ""));
  const hotel = useMemo(() => desk.hotels.find((row) => String(row.id) === hotelId), [desk.hotels, hotelId]);
  const vehicle = useMemo(() => desk.vehicles.find((row) => String(row.id) === vehicleId), [desk.vehicles, vehicleId]);
  const places = useMemo(() => [...new Set(desk.hotels.map((row) => row.place))], [desk.hotels]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Rates</h1>
      <SeasonForm percent={desk.seasonPercent} />
      {desk.air ? <AirForm air={desk.air} /> : <p>Run the rate import before editing air extras.</p>}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Jeep lines</h2>
        {desk.jeeps.map((jeep) => (
          <JeepForm jeep={jeep} key={jeep.id} />
        ))}
      </section>
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">Hotel rate</h2>
        <label className="mt-4 block text-sm" htmlFor="hotelId">Rate</label>
        <select className="mt-1 w-full rounded-md border px-3 py-2" id="hotelId" value={hotelId} onChange={(event) => setHotelId(event.target.value)}>
          {desk.hotels.map((row) => (
            <option key={row.id} value={row.id}>
              {row.place} · {row.startCity} · {row.grade}
            </option>
          ))}
        </select>
        {hotel ? <HotelForm hotel={hotel} key={hotel.id} /> : null}
      </section>
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold">Vehicle</h2>
        <label className="mt-4 block text-sm" htmlFor="vehicleId">Rate</label>
        <select className="mt-1 w-full rounded-md border px-3 py-2" id="vehicleId" value={vehicleId} onChange={(event) => setVehicleId(event.target.value)}>
          {desk.vehicles.map((row) => (
            <option key={row.id} value={row.id}>
              {row.place} · {row.startCity} · {row.vehicle}{row.live ? "" : " · off"}
            </option>
          ))}
        </select>
        {vehicle ? <VehicleForm vehicle={vehicle} key={vehicle.id} /> : null}
      </section>
      <QuoteForm places={places} />
    </div>
  );
}

function useRateAction() {
  const router = useRouter();
  return useActionState(async (_prev: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/rates", formData);
    if (result.ok) router.refresh();
    return result;
  }, null as ActionResult | null);
}

function Note({ state }: { state: ActionResult | null }) {
  if (!state || state.ok) return null;
  return <p className="mt-3 text-sm text-red-700">{state.error}</p>;
}

function SeasonForm({ percent }: { percent: 15 | 20 }) {
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

function AirForm({ air }: { air: Air }) {
  const [state, action, pending] = useRateAction();
  const fields: { name: keyof Air; label: string }[] = [
    { name: "islamabadTicket", label: "Islamabad ticket" },
    { name: "lahoreAdd", label: "Lahore add" },
    { name: "karachiAdd", label: "Karachi add" },
    { name: "welcomePack", label: "Welcome pack" },
    { name: "entry", label: "Entry" },
    { name: "infantExtra", label: "Infant extra" },
    { name: "sticker", label: "Sticker" },
  ];
  return (
    <form action={action} className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold">Air extras</h2>
      <input name="kind" type="hidden" value="air" />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label className="block text-sm" key={field.name}>
            {field.label}
            <input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={air[field.name]} name={field.name} />
          </label>
        ))}
      </div>
      <Note state={state} />
      <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-white" disabled={pending} type="submit">Save air extras</button>
    </form>
  );
}

function JeepForm({ jeep }: { jeep: Jeep }) {
  const [state, action, pending] = useRateAction();
  return (
    <form action={action} className="rounded-xl bg-white p-4 shadow">
      <input name="kind" type="hidden" value="jeep" />
      <input name="id" type="hidden" value={jeep.id} />
      <p className="font-medium">{jeep.place} · {jeep.label} · {jeep.mode}</p>
      <label className="mt-3 block text-sm">
        Amount
        <input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={jeep.amount} name="amount" />
      </label>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input defaultChecked={jeep.live} name="live" type="checkbox" />
        On
      </label>
      <Note state={state} />
      <button className="mt-3 rounded-md bg-slate-900 px-3 py-2 text-sm text-white" disabled={pending} type="submit">Save jeep</button>
    </form>
  );
}

function HotelForm({ hotel }: { hotel: Hotel }) {
  const [state, action, pending] = useRateAction();
  return (
    <form action={action} className="mt-4 space-y-3">
      <input name="kind" type="hidden" value="hotel" />
      <input name="id" type="hidden" value={hotel.id} />
      <label className="block text-sm">Twin<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={hotel.twin} name="twin" /></label>
      <label className="block text-sm">3-share<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={hotel.triple} name="triple" /></label>
      <label className="block text-sm">Hotel name<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={hotel.hotelName} name="hotelName" /></label>
      <label className="flex items-center gap-2 text-sm"><input defaultChecked={hotel.offered} name="offered" type="checkbox" />Offered</label>
      <Note state={state} />
      <button className="rounded-md bg-slate-900 px-4 py-2 text-white" disabled={pending} type="submit">Save hotel</button>
    </form>
  );
}

function VehicleForm({ vehicle }: { vehicle: Vehicle }) {
  const [state, action, pending] = useRateAction();
  return (
    <form action={action} className="mt-4 grid gap-3 md:grid-cols-2">
      <input name="kind" type="hidden" value="vehicle" />
      <input name="id" type="hidden" value={vehicle.id} />
      <label className="block text-sm">Rent<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={vehicle.rent} name="rent" /></label>
      <label className="block text-sm">Fuel<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={vehicle.fuel} name="fuel" /></label>
      <label className="block text-sm">Toll<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={vehicle.toll} name="toll" /></label>
      <label className="block text-sm">Seats<input className="mt-1 w-full rounded-md border px-3 py-2" defaultValue={vehicle.seats} name="seats" /></label>
      <label className="flex items-center gap-2 text-sm md:col-span-2"><input defaultChecked={vehicle.live} name="live" type="checkbox" />On</label>
      <Note state={state} />
      <button className="rounded-md bg-slate-900 px-4 py-2 text-white md:col-span-2" disabled={pending} type="submit">Save vehicle</button>
    </form>
  );
}

function QuoteForm({ places }: { places: string[] }) {
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
        <label className="block text-sm">Day to clear<input className="mt-1 w-full rounded-md border px-3 py-2" name="day" /></label>
        <label className="flex items-center gap-2 text-sm"><input name="clearDay" type="checkbox" />Clear that day&apos;s vehicle</label>
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
