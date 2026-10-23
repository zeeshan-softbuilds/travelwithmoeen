// The rate rows as GET /api/office/rates returns them.
export type Hotel = {
  id: number;
  place: string;
  startCity: string;
  grade: string;
  twin: number;
  triple: number;
  hotelName: string;
  offered: boolean;
};
export type Vehicle = {
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
export type Air = {
  islamabadTicket: number;
  lahoreAdd: number;
  karachiAdd: number;
  welcomePack: number;
  entry: number;
  infantExtra: number;
  sticker: number;
};
export type Jeep = { id: number; place: string; mode: string; label: string; amount: number; live: boolean };

export type RateDeskView = { hotels: Hotel[]; vehicles: Vehicle[]; air: Air | null; jeeps: Jeep[]; seasonPercent: number };
