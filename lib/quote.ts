export const GUEST_GRADES = ["Deluxe", "Executive", "Luxury", "Ultra Luxury"] as const;
export type GuestGrade = (typeof GUEST_GRADES)[number];
export type HotelGrade = GuestGrade | "Premier";
export type TripMode = "road" | "air";
export type SeasonPercent = 15 | 20;

const GRADES: HotelGrade[] = ["Deluxe", "Premier", "Executive", "Luxury", "Ultra Luxury"];
const MEAL_PER_NIGHT: Record<HotelGrade, number> = {
  Deluxe: 1200,
  Premier: 1500,
  Executive: 2000,
  Luxury: 2500,
  "Ultra Luxury": 3000,
};
const GUIDE_PER_DAY = 5000;
const BREAKFAST_PER_PERSON = 500;
const LAHORE_ROAD_PER_DAY = 5000;
const LAP_INFANT_TICKET = 1000;
const SEAT_INFANT_TICKET = 5000;
const MAX_DAYS = 60;
const TAOBAT_SHEET_PLACE = "Neelum Taobat Arang Kel";
const TAOBAT_PLACE = "Taobat";

export type HotelRateRow = {
  place: string;
  startCity: string;
  grade: string;
  twin: number;
  triple: number;
  hotelName: string;
  offered: boolean;
};

export type VehicleRateRow = {
  place: string;
  startCity: string;
  mode: TripMode;
  vehicle: string;
  rent: number;
  fuel: number;
  toll: number;
  seats: number;
  live: boolean;
};

export type AirExtraRow = {
  islamabadTicket: number;
  lahoreAdd: number;
  karachiAdd: number;
  welcomePack: number;
  entry: number;
  infantExtra: number;
  sticker: number;
};

export type JeepLineRow = {
  place: string;
  mode: TripMode | "both";
  label: string;
  people: number;
  amount: number;
  live: boolean;
};

export type RateCatalog = {
  hotels: HotelRateRow[];
  vehicles: VehicleRateRow[];
  air: AirExtraRow;
  jeeps: JeepLineRow[];
  seasonPercent: SeasonPercent;
};

export type NightEdit = { night: number; rate: number; hotelName?: string };
export type DayEdit = { day: number; cleared?: boolean; rent?: number; fuel?: number; vehicle?: string };

export type QuoteInput = {
  place: string;
  startCity: string;
  mode: TripMode;
  days: number;
  adults: number;
  children: number;
  lapInfants: number;
  seatInfants: number;
  grade: string;
  vehicle: string;
  vehicleCount?: number;
  roomCount?: number;
  guide: boolean;
  meals: boolean;
  seasonPercent?: SeasonPercent;
  nightEdits?: NightEdit[];
  dayEdits?: DayEdit[];
  paidExtras?: { name: string; amount: number }[];
  otherNote?: string;
  otherRent?: number;
  otherFuel?: number;
  otherToll?: number;
  otherSeats?: number;
};

export type NightLine = { night: number; rate: number; hotelName: string };
export type DayLine = { day: number; vehicle: string; rent: number; fuel: number; toll: number; cleared: boolean };
export type QuoteLine = { label: string; amount: number };

export type QuoteSuccess = {
  ok: true;
  subtotal: number;
  profit: number;
  total: number;
  seasonPercent: SeasonPercent;
  nights: NightLine[];
  days: DayLine[];
  lines: QuoteLine[];
  averageNightly: number;
  averageGrade: string;
  nearestGrade: boolean;
  vehicleCount: number;
  rooms: number;
  vehicleName: string;
  hotelName: string;
};

export type QuoteResult = QuoteSuccess | { ok: false; error: string };

export function storedPlace(place: string) {
  return place.trim() === TAOBAT_SHEET_PLACE ? TAOBAT_PLACE : place.trim();
}

export function vehicleKey(name: string) {
  const key = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (key === "parado" || key === "prado") return "prado";
  return key;
}

function isGrade(value: string): value is HotelGrade {
  return GRADES.includes(value as HotelGrade);
}

function whole(value: number) {
  return Number.isInteger(value) && value >= 0;
}

export function buildQuote(input: QuoteInput, catalog: RateCatalog): QuoteResult {
  if (input.mode === "road" && input.startCity.trim().toLowerCase() === "karachi") {
    return { ok: false, error: "A road trip cannot start in Karachi." };
  }
  if (!isGrade(input.grade)) {
    return { ok: false, error: "Choose Deluxe, Executive, Luxury, or Ultra Luxury." };
  }
  if (input.grade === "Premier") {
    return { ok: false, error: "Premier is not offered." };
  }
  if (!Number.isInteger(input.days) || input.days < 1 || input.days > MAX_DAYS) {
    return { ok: false, error: "Enter a trip of 1 to 60 days." };
  }
  if (!whole(input.adults) || !whole(input.children) || !whole(input.lapInfants) || !whole(input.seatInfants)) {
    return { ok: false, error: "Enter a number for each traveler." };
  }
  const seats = input.adults + input.children + input.seatInfants;
  if (seats < 1) {
    return { ok: false, error: "Enter the travelers." };
  }

  const place = storedPlace(input.place);
  const city = input.mode === "air" ? "Air" : input.startCity.trim();
  const hotel = catalog.hotels.find(
    (row) => row.place === place && row.startCity === city && row.grade === input.grade && row.offered,
  );
  if (!hotel) {
    return { ok: false, error: "No hotel rate is stored for that trip." };
  }

  const other = vehicleKey(input.vehicle) === "other";
  let vehicleName = input.vehicle.trim();
  let rent = 0;
  let fuel = 0;
  let toll = 0;
  let vehicleSeats = 0;
  if (other) {
    if (
      input.otherRent === undefined ||
      input.otherFuel === undefined ||
      input.otherToll === undefined ||
      input.otherSeats === undefined ||
      !whole(input.otherRent) ||
      !whole(input.otherFuel) ||
      !whole(input.otherToll) ||
      !Number.isInteger(input.otherSeats) ||
      input.otherSeats < 1
    ) {
      return { ok: false, error: "Enter the rent, fuel, toll, and seats for Other." };
    }
    rent = input.otherRent;
    fuel = input.otherFuel;
    toll = input.otherToll;
    vehicleSeats = input.otherSeats;
    vehicleName = input.otherNote?.trim() || "Other";
  } else {
    const vehicle = catalog.vehicles.find(
      (row) =>
        row.place === place &&
        row.startCity === city &&
        row.mode === input.mode &&
        row.live &&
        vehicleKey(row.vehicle) === vehicleKey(input.vehicle),
    );
    if (!vehicle) {
      return { ok: false, error: "No vehicle rate is stored for that trip." };
    }
    rent = vehicle.rent;
    fuel = vehicle.fuel;
    toll = vehicle.toll;
    vehicleSeats = vehicle.seats;
    vehicleName = vehicle.vehicle;
  }
  if (vehicleSeats < 1) {
    return { ok: false, error: "That vehicle has no seats." };
  }

  const rooms = input.roomCount ?? Math.ceil(seats / 3);
  if (!Number.isInteger(rooms) || rooms < 1) {
    return { ok: false, error: "Enter the rooms." };
  }
  const peoplePerRoom = seats / rooms;
  const nightly = peoplePerRoom > 2 ? hotel.triple : hotel.twin;
  const nightsCount = input.days > 1 ? input.days - 1 : 0;
  const nights: NightLine[] = [];
  for (let night = 1; night <= nightsCount; night += 1) {
    const edit = input.nightEdits?.find((row) => row.night === night);
    nights.push({
      night,
      rate: edit ? edit.rate : nightly,
      hotelName: edit?.hotelName?.trim() || hotel.hotelName,
    });
  }

  const vehicleCount = input.vehicleCount ?? Math.ceil(seats / vehicleSeats);
  if (!Number.isInteger(vehicleCount) || vehicleCount < 1) {
    return { ok: false, error: "Enter the vehicles." };
  }
  const days: DayLine[] = [];
  for (let day = 1; day <= input.days; day += 1) {
    const edit = input.dayEdits?.find((row) => row.day === day);
    const cleared = Boolean(edit?.cleared);
    days.push({
      day,
      vehicle: cleared ? "" : edit?.vehicle?.trim() || vehicleName,
      rent: cleared ? 0 : edit?.rent ?? rent,
      fuel: cleared ? 0 : edit?.fuel ?? fuel,
      toll,
      cleared,
    });
  }

  const activeDays = days.filter((day) => !day.cleared);
  const dailyVehicle = activeDays.reduce((sum, day) => sum + day.rent + day.fuel, 0);
  const vehicleCost = vehicleCount * (dailyVehicle + (activeDays.length > 0 ? toll : 0));
  const hotelCost = nights.reduce((sum, night) => sum + night.rate, 0) * rooms;
  const guideCost = input.guide ? GUIDE_PER_DAY * input.days : 0;
  const mealPeople = input.adults + input.children;
  const mealCost = input.meals ? MEAL_PER_NIGHT[input.grade] * nightsCount * mealPeople : 0;
  const breakfastCost = input.mode === "road" && input.days > 1 ? BREAKFAST_PER_PERSON * mealPeople : 0;
  const lahoreCost =
    input.mode === "road" && input.startCity.trim().toLowerCase() === "lahore" && input.days > 3
      ? LAHORE_ROAD_PER_DAY * (input.days - 3) * vehicleCount
      : 0;

  let ticketCost = 0;
  let welcomeCost = 0;
  let entryCost = 0;
  let infantExtraCost = 0;
  let stickerCost = 0;
  if (input.mode === "air") {
    const adultFare =
      catalog.air.islamabadTicket +
      (input.startCity.trim().toLowerCase() === "lahore" ? catalog.air.lahoreAdd : 0) +
      (input.startCity.trim().toLowerCase() === "karachi" ? catalog.air.karachiAdd : 0);
    const childFare = Math.round((adultFare * 75) / 100);
    ticketCost =
      adultFare * input.adults +
      childFare * input.children +
      LAP_INFANT_TICKET * input.lapInfants +
      SEAT_INFANT_TICKET * input.seatInfants;
    welcomeCost = catalog.air.welcomePack * mealPeople;
    entryCost = catalog.air.entry * mealPeople;
    infantExtraCost = catalog.air.infantExtra * (input.lapInfants + input.seatInfants);
    stickerCost = catalog.air.sticker * rooms;
  }

  const travelers = input.adults + input.children + input.lapInfants + input.seatInfants;
  const jeepCosts = catalog.jeeps
    .filter((line) => line.live && line.place === place && (line.mode === "both" || line.mode === input.mode))
    .map((line) => ({
      label: line.label,
      amount: line.amount * Math.ceil(travelers / line.people),
    }));
  const extras = (input.paidExtras ?? []).filter((extra) => extra.name.trim() && extra.amount > 0);

  const lines: QuoteLine[] = [
    { label: "Vehicle", amount: vehicleCost },
    { label: "Hotel", amount: hotelCost },
  ];
  if (guideCost > 0) lines.push({ label: "Guide", amount: guideCost });
  if (mealCost > 0) lines.push({ label: "Meals", amount: mealCost });
  if (breakfastCost > 0) lines.push({ label: "Arrival breakfast", amount: breakfastCost });
  if (lahoreCost > 0) lines.push({ label: "Lahore road extra", amount: lahoreCost });
  if (ticketCost > 0) lines.push({ label: "Air tickets", amount: ticketCost });
  if (welcomeCost > 0) lines.push({ label: "Welcome pack", amount: welcomeCost });
  if (entryCost > 0) lines.push({ label: "Entry", amount: entryCost });
  if (infantExtraCost > 0) lines.push({ label: "Infant extra", amount: infantExtraCost });
  if (stickerCost > 0) lines.push({ label: "Sticker", amount: stickerCost });
  for (const jeep of jeepCosts) lines.push({ label: jeep.label, amount: jeep.amount });
  for (const extra of extras) lines.push({ label: extra.name.trim(), amount: extra.amount });

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const seasonPercent = input.seasonPercent ?? catalog.seasonPercent;
  if (seasonPercent !== 15 && seasonPercent !== 20) {
    return { ok: false, error: "The season is 15 percent or 20 percent." };
  }
  const profit = Math.round((subtotal * seasonPercent) / 100);
  const averageNightly = nightsCount > 0 ? nights.reduce((sum, night) => sum + night.rate, 0) / nightsCount : 0;
  const twins = catalog.hotels.filter((row) => row.place === place && row.startCity === city);
  let averageGrade = "";
  let nearestGrade = false;
  if (twins.length > 0 && nightsCount > 0) {
    const exact = twins.find((row) => row.twin === averageNightly);
    if (exact) {
      averageGrade = exact.grade;
    } else {
      const nearest = twins.reduce((best, row) =>
        Math.abs(row.twin - averageNightly) < Math.abs(best.twin - averageNightly) ? row : best,
      );
      averageGrade = nearest.grade;
      nearestGrade = true;
    }
  }

  return {
    ok: true,
    subtotal,
    profit,
    total: subtotal + profit,
    seasonPercent,
    nights,
    days,
    lines,
    averageNightly,
    averageGrade,
    nearestGrade,
    vehicleCount,
    rooms,
    vehicleName,
    hotelName: nights[0]?.hotelName || hotel.hotelName,
  };
}
