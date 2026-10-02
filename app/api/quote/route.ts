import { getCurrentUser } from "@/lib/auth/session";
import { canEditRates } from "@/lib/auth/permissions";
import { buildQuote, type DayEdit, type NightEdit, type QuoteInput, type SeasonPercent } from "@/lib/quote";
import { loadCatalog, readAmount, readCount } from "@/lib/rates";

function text(body: Record<string, unknown>, key: string) {
  const value = body[key];
  return value === undefined || value === null ? "" : String(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "The quote could not be read." }, { status: 400 });
  }
  const user = await getCurrentUser();
  const staff = Boolean(user && canEditRates(user.role));
  const days = readCount(text(body, "days"), "the days", 60);
  if (!days.ok) return Response.json(days, { status: 400 });
  const adults = readCount(text(body, "adults"), "the adults", 60);
  if (!adults.ok) return Response.json(adults, { status: 400 });
  const children = readCount(text(body, "children") || "0", "the children", 60);
  if (!children.ok) return Response.json(children, { status: 400 });
  const lapInfants = readCount(text(body, "lapInfants") || "0", "the lap infants", 60);
  if (!lapInfants.ok) return Response.json(lapInfants, { status: 400 });
  const seatInfants = readCount(text(body, "seatInfants") || "0", "the infants with a seat", 60);
  if (!seatInfants.ok) return Response.json(seatInfants, { status: 400 });
  const season = text(body, "seasonPercent");
  const input: QuoteInput = {
    place: text(body, "place"),
    startCity: text(body, "startCity"),
    mode: text(body, "mode") === "air" ? "air" : "road",
    days: days.count,
    adults: adults.count,
    children: children.count,
    lapInfants: lapInfants.count,
    seatInfants: seatInfants.count,
    grade: text(body, "grade"),
    vehicle: text(body, "vehicle"),
    roomCount: text(body, "roomCount") ? Number(text(body, "roomCount")) : undefined,
    guide: body.guide === true,
    meals: body.meals === true,
    seasonPercent: season === "15" || season === "20" ? (Number(season) as SeasonPercent) : undefined,
    otherNote: text(body, "otherNote"),
  };
  if (input.vehicle.trim().toLowerCase() === "other") {
    const rent = readAmount(text(body, "otherRent"));
    if (!rent.ok) return Response.json(rent, { status: 400 });
    const fuel = readAmount(text(body, "otherFuel"));
    if (!fuel.ok) return Response.json(fuel, { status: 400 });
    const toll = readAmount(text(body, "otherToll"));
    if (!toll.ok) return Response.json(toll, { status: 400 });
    const seats = readCount(text(body, "otherSeats"), "the seats", 60);
    if (!seats.ok) return Response.json(seats, { status: 400 });
    input.otherRent = rent.amount;
    input.otherFuel = fuel.amount;
    input.otherToll = toll.amount;
    input.otherSeats = seats.count;
  }
  if (staff && Array.isArray(body.nightEdits)) {
    const nightEdits: NightEdit[] = [];
    for (const edit of body.nightEdits) {
      const row = edit as { night?: unknown; rate?: unknown; hotelName?: unknown };
      const night = readCount(String(row.night ?? ""), "the night", 60);
      if (!night.ok) return Response.json(night, { status: 400 });
      const rate = readAmount(String(row.rate ?? ""));
      if (!rate.ok) return Response.json(rate, { status: 400 });
      nightEdits.push({ night: night.count, rate: rate.amount, hotelName: String(row.hotelName ?? "") });
    }
    input.nightEdits = nightEdits;
  }
  if (staff && Array.isArray(body.dayEdits)) {
    const dayEdits: DayEdit[] = [];
    for (const edit of body.dayEdits) {
      const row = edit as { day?: unknown; cleared?: unknown };
      const day = readCount(String(row.day ?? ""), "the day", 60);
      if (!day.ok) return Response.json(day, { status: 400 });
      dayEdits.push({ day: day.count, cleared: row.cleared === true });
    }
    input.dayEdits = dayEdits;
  }
  if (staff && Array.isArray(body.paidExtras)) {
    const paidExtras: { name: string; amount: number }[] = [];
    for (const extra of body.paidExtras) {
      const row = extra as { name?: unknown; amount?: unknown };
      const amount = readAmount(String(row.amount ?? ""));
      if (!amount.ok) return Response.json(amount, { status: 400 });
      paidExtras.push({ name: String(row.name ?? ""), amount: amount.amount });
    }
    input.paidExtras = paidExtras;
  }
  const quote = buildQuote(input, await loadCatalog());
  if (!quote.ok) return Response.json(quote, { status: 400 });
  if (!staff) {
    return Response.json({ ok: true, total: quote.total, hotelName: quote.hotelName, vehicleCount: quote.vehicleCount });
  }
  return Response.json(quote);
}
