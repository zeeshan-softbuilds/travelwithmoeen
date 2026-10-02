import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { airExtras, hotelRates, jeepLines, seasons, vehicleRates } from "@/lib/db/schema";
import type { HotelRateRow, JeepLineRow, RateCatalog, SeasonPercent, TripMode, VehicleRateRow } from "@/lib/quote";

const MONEY_MAX = 10_000_000;

export function readAmount(raw: string): { ok: true; amount: number } | { ok: false; error: string } {
  const text = raw.trim();
  if (!text) return { ok: false, error: "Enter an amount." };
  if (text.startsWith("-")) return { ok: false, error: "Enter an amount that is not negative." };
  if (!/^\d+$/.test(text)) return { ok: false, error: "Enter a number." };
  const amount = Number(text);
  if (amount > MONEY_MAX) return { ok: false, error: "Enter an amount of 10,000,000 rupees or less." };
  return { ok: true, amount };
}

export function readCount(raw: string, label: string, max: number): { ok: true; count: number } | { ok: false; error: string } {
  const text = raw.trim();
  if (!text) return { ok: false, error: `Enter ${label}.` };
  if (text.startsWith("-")) return { ok: false, error: `Enter ${label} that is not negative.` };
  if (!/^\d+$/.test(text)) return { ok: false, error: `Enter a number for ${label}.` };
  const count = Number(text);
  if (count > max) return { ok: false, error: `Enter ${label} of ${max} or less.` };
  return { ok: true, count };
}

export async function loadCatalog(): Promise<RateCatalog> {
  const [hotels, vehicles, airRows, jeeps, seasonRows] = await Promise.all([
    db.select().from(hotelRates).orderBy(asc(hotelRates.place), asc(hotelRates.grade)),
    db.select().from(vehicleRates).orderBy(asc(vehicleRates.place), asc(vehicleRates.vehicle)),
    db.select().from(airExtras).limit(1),
    db.select().from(jeepLines).orderBy(asc(jeepLines.place)),
    db.select().from(seasons).limit(1),
  ]);
  const air = airRows[0];
  const season = seasonRows[0]?.percent === 15 ? 15 : 20;
  return {
    hotels: hotels.map(toHotel),
    vehicles: vehicles.map(toVehicle),
    air: {
      islamabadTicket: air?.islamabadTicket ?? 0,
      lahoreAdd: air?.lahoreAdd ?? 0,
      karachiAdd: air?.karachiAdd ?? 0,
      welcomePack: air?.welcomePack ?? 0,
      entry: air?.entry ?? 0,
      infantExtra: air?.infantExtra ?? 0,
      sticker: air?.sticker ?? 0,
    },
    jeeps: jeeps.map(toJeep),
    seasonPercent: season,
  };
}

function toHotel(row: typeof hotelRates.$inferSelect): HotelRateRow {
  return {
    place: row.place,
    startCity: row.startCity,
    grade: row.grade,
    twin: row.twin,
    triple: row.triple,
    hotelName: row.hotelName,
    offered: row.offered,
  };
}

function toVehicle(row: typeof vehicleRates.$inferSelect): VehicleRateRow {
  return {
    place: row.place,
    startCity: row.startCity,
    mode: row.mode === "air" ? "air" : "road",
    vehicle: row.vehicle,
    rent: row.rent,
    fuel: row.fuel,
    toll: row.toll,
    seats: row.seats,
    live: row.live,
  };
}

function toJeep(row: typeof jeepLines.$inferSelect): JeepLineRow {
  const mode: TripMode | "both" = row.mode === "air" || row.mode === "both" ? row.mode : "road";
  return {
    place: row.place,
    mode,
    label: row.label,
    people: row.people,
    amount: row.amount,
    live: row.live,
  };
}

export async function loadRateDesk() {
  const [hotels, vehicles, airRows, jeeps, seasonRows] = await Promise.all([
    db.select().from(hotelRates).orderBy(asc(hotelRates.place), asc(hotelRates.startCity), asc(hotelRates.grade)),
    db.select().from(vehicleRates).orderBy(asc(vehicleRates.place), asc(vehicleRates.vehicle)),
    db.select().from(airExtras).limit(1),
    db.select().from(jeepLines).orderBy(asc(jeepLines.id)),
    db.select().from(seasons).limit(1),
  ]);
  return {
    hotels,
    vehicles,
    air: airRows[0] ?? null,
    jeeps,
    seasonPercent: (seasonRows[0]?.percent === 15 ? 15 : 20) as SeasonPercent,
  };
}
