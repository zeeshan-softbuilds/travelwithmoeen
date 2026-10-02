import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  airExtras,
  hotelRates,
  jeepLines,
  quoteDays,
  quoteExtras,
  quoteNights,
  quotes,
  seasons,
  vehicleRates,
} from "@/lib/db/schema";
import { canEditRates } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { buildQuote, type DayEdit, type NightEdit, type QuoteInput, type SeasonPercent } from "@/lib/quote";
import { loadCatalog, readAmount, readCount } from "@/lib/rates";

function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function saveHotelRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  const id = Number(formData.get("id"));
  const twin = readAmount(String(formData.get("twin") ?? ""));
  if (!twin.ok) return twin;
  const triple = readAmount(String(formData.get("triple") ?? ""));
  if (!triple.ok) return triple;
  const hotelName = String(formData.get("hotelName") ?? "").trim();
  const [row] = await db.select({ id: hotelRates.id }).from(hotelRates).where(eq(hotelRates.id, id)).limit(1);
  if (!row) return { ok: false, error: "That hotel rate was not found." };
  await db
    .update(hotelRates)
    .set({ twin: twin.amount, triple: triple.amount, hotelName, offered: checked(formData.get("offered")) })
    .where(eq(hotelRates.id, id));
  return { ok: true, message: "Hotel rate saved." };
}

export async function saveVehicleRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  const id = Number(formData.get("id"));
  const rent = readAmount(String(formData.get("rent") ?? ""));
  if (!rent.ok) return rent;
  const fuel = readAmount(String(formData.get("fuel") ?? ""));
  if (!fuel.ok) return fuel;
  const toll = readAmount(String(formData.get("toll") ?? ""));
  if (!toll.ok) return toll;
  const seats = readCount(String(formData.get("seats") ?? ""), "the seats", 60);
  if (!seats.ok) return seats;
  const [row] = await db.select({ id: vehicleRates.id }).from(vehicleRates).where(eq(vehicleRates.id, id)).limit(1);
  if (!row) return { ok: false, error: "That vehicle rate was not found." };
  const live = checked(formData.get("live")) && !(rent.amount === 0 && fuel.amount === 0 && toll.amount === 0);
  await db
    .update(vehicleRates)
    .set({ rent: rent.amount, fuel: fuel.amount, toll: toll.amount, seats: seats.count, live })
    .where(eq(vehicleRates.id, id));
  return { ok: true, message: "Vehicle rate saved." };
}

export async function saveAirExtraAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  const fields = ["islamabadTicket", "lahoreAdd", "karachiAdd", "welcomePack", "entry", "infantExtra", "sticker"] as const;
  const amounts: Record<(typeof fields)[number], number> = {
    islamabadTicket: 0,
    lahoreAdd: 0,
    karachiAdd: 0,
    welcomePack: 0,
    entry: 0,
    infantExtra: 0,
    sticker: 0,
  };
  for (const field of fields) {
    const amount = readAmount(String(formData.get(field) ?? ""));
    if (!amount.ok) return amount;
    amounts[field] = amount.amount;
  }
  const [row] = await db.select({ id: airExtras.id }).from(airExtras).limit(1);
  if (!row) return { ok: false, error: "The air extras are not loaded." };
  await db.update(airExtras).set(amounts).where(eq(airExtras.id, row.id));
  return { ok: true, message: "Air extras saved." };
}

export async function saveJeepLineAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  const id = Number(formData.get("id"));
  const amount = readAmount(String(formData.get("amount") ?? ""));
  if (!amount.ok) return amount;
  const [row] = await db.select({ id: jeepLines.id }).from(jeepLines).where(eq(jeepLines.id, id)).limit(1);
  if (!row) return { ok: false, error: "That jeep line was not found." };
  await db.update(jeepLines).set({ amount: amount.amount, live: checked(formData.get("live")) }).where(eq(jeepLines.id, id));
  return { ok: true, message: "Jeep line saved." };
}

export async function saveSeasonAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  const percent = String(formData.get("percent") ?? "").trim();
  if (percent !== "15" && percent !== "20") return { ok: false, error: "Choose 15 percent or 20 percent." };
  const [row] = await db.select({ id: seasons.id }).from(seasons).limit(1);
  if (!row) await db.insert(seasons).values({ percent: Number(percent) });
  else await db.update(seasons).set({ percent: Number(percent) }).where(eq(seasons.id, row.id));
  return { ok: true, message: "Season saved." };
}

export async function quoteInputFromForm(formData: FormData): Promise<{ ok: true; input: QuoteInput } | { ok: false; error: string }> {
  const days = readCount(String(formData.get("days") ?? ""), "the days", 60);
  if (!days.ok) return days;
  const adults = readCount(String(formData.get("adults") ?? ""), "the adults", 60);
  if (!adults.ok) return adults;
  const children = readCount(String(formData.get("children") ?? "0"), "the children", 60);
  if (!children.ok) return children;
  const lapInfants = readCount(String(formData.get("lapInfants") ?? "0"), "the lap infants", 60);
  if (!lapInfants.ok) return lapInfants;
  const seatInfants = readCount(String(formData.get("seatInfants") ?? "0"), "the infants with a seat", 60);
  if (!seatInfants.ok) return seatInfants;
  const season = String(formData.get("seasonPercent") ?? "").trim();
  const seasonPercent: SeasonPercent | undefined = season === "15" || season === "20" ? Number(season) as SeasonPercent : undefined;
  const nightEdits: NightEdit[] = [];
  const night = String(formData.get("night") ?? "").trim();
  const nightRate = String(formData.get("nightRate") ?? "").trim();
  if (night || nightRate) {
    const nightNumber = readCount(night, "the night", 60);
    if (!nightNumber.ok) return nightNumber;
    const rate = readAmount(nightRate);
    if (!rate.ok) return rate;
    nightEdits.push({ night: nightNumber.count, rate: rate.amount, hotelName: String(formData.get("nightHotel") ?? "") });
  }
  const dayEdits: DayEdit[] = [];
  if (checked(formData.get("clearDay"))) {
    const day = readCount(String(formData.get("day") ?? ""), "the day", 60);
    if (!day.ok) return day;
    dayEdits.push({ day: day.count, cleared: true });
  }
  const paidExtras: { name: string; amount: number }[] = [];
  const extraName = String(formData.get("extraName") ?? "").trim();
  const extraAmount = String(formData.get("extraAmount") ?? "").trim();
  if (extraName || extraAmount) {
    const amount = readAmount(extraAmount);
    if (!amount.ok) return amount;
    paidExtras.push({ name: extraName, amount: amount.amount });
  }
  const vehicle = String(formData.get("vehicle") ?? "");
  const input: QuoteInput = {
    place: String(formData.get("place") ?? ""),
    startCity: String(formData.get("startCity") ?? ""),
    mode: String(formData.get("mode") ?? "") === "air" ? "air" : "road",
    days: days.count,
    adults: adults.count,
    children: children.count,
    lapInfants: lapInfants.count,
    seatInfants: seatInfants.count,
    grade: String(formData.get("grade") ?? ""),
    vehicle,
    guide: checked(formData.get("guide")),
    meals: checked(formData.get("meals")),
    seasonPercent,
    nightEdits,
    dayEdits,
    paidExtras,
    otherNote: String(formData.get("otherNote") ?? ""),
  };
  if (vehicle.trim().toLowerCase() === "other") {
    const rent = readAmount(String(formData.get("otherRent") ?? ""));
    if (!rent.ok) return rent;
    const fuel = readAmount(String(formData.get("otherFuel") ?? ""));
    if (!fuel.ok) return fuel;
    const toll = readAmount(String(formData.get("otherToll") ?? ""));
    if (!toll.ok) return toll;
    const seats = readCount(String(formData.get("otherSeats") ?? ""), "the seats", 60);
    if (!seats.ok) return seats;
    input.otherRent = rent.amount;
    input.otherFuel = fuel.amount;
    input.otherToll = toll.amount;
    input.otherSeats = seats.count;
  }
  return { ok: true, input };
}

export async function saveQuoteAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  const parsed = await quoteInputFromForm(formData);
  if (!parsed.ok) return parsed;
  const catalog = await loadCatalog();
  const quote = buildQuote(parsed.input, catalog);
  if (!quote.ok) return quote;
  await db.transaction(async (tx) => {
    const [saved] = await tx
      .insert(quotes)
      .values({
        place: parsed.input.place,
        startCity: parsed.input.startCity,
        mode: parsed.input.mode,
        days: parsed.input.days,
        adults: parsed.input.adults,
        children: parsed.input.children,
        lapInfants: parsed.input.lapInfants,
        seatInfants: parsed.input.seatInfants,
        grade: parsed.input.grade,
        vehicle: parsed.input.vehicle,
        otherNote: parsed.input.otherNote ?? "",
        guide: parsed.input.guide,
        meals: parsed.input.meals,
        seasonPercent: quote.seasonPercent,
        subtotal: quote.subtotal,
        profit: quote.profit,
        total: quote.total,
      })
      .returning({ id: quotes.id });
    if (!saved) return;
    if (quote.nights.length > 0) {
      await tx.insert(quoteNights).values(quote.nights.map((night) => ({ quoteId: saved.id, ...night })));
    }
    if (quote.days.length > 0) {
      await tx.insert(quoteDays).values(
        quote.days.map((day) => ({
          quoteId: saved.id,
          day: day.day,
          vehicle: day.vehicle,
          rent: day.rent,
          fuel: day.fuel,
          toll: day.toll,
          cleared: day.cleared,
        })),
      );
    }
    const extras = parsed.input.paidExtras ?? [];
    if (extras.length > 0) {
      await tx.insert(quoteExtras).values(extras.map((extra) => ({ quoteId: saved.id, name: extra.name, amount: extra.amount })));
    }
  });
  return { ok: true, message: `Quote saved. Total ${quote.total}.` };
}

export async function savePriceFromKind(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const kind = String(formData.get("kind") ?? "");
  if (kind === "hotel") return saveHotelRateAs(actor, formData);
  if (kind === "vehicle") return saveVehicleRateAs(actor, formData);
  if (kind === "air") return saveAirExtraAs(actor, formData);
  if (kind === "jeep") return saveJeepLineAs(actor, formData);
  if (kind === "season") return saveSeasonAs(actor, formData);
  if (kind === "quote") return saveQuoteAs(actor, formData);
  if (!canEditRates(actor.role)) return forbidden("You cannot change a price.");
  return { ok: false, error: "Choose a rate to save." };
}
