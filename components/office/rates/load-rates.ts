import { redirect } from "next/navigation";
import type { RateDeskView } from "@/components/office/rates/types";
import { getOfficeSession } from "@/lib/http/office-session";
import { getRateDesk } from "@/lib/http/site-content";

// Every rates page: Owner and Manager only, read through GET /api/office/rates.
export async function loadRateDesk(): Promise<RateDeskView> {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const desk = await getRateDesk();
  if (!desk) redirect("/office");
  return {
    hotels: desk.hotels,
    vehicles: desk.vehicles,
    air: desk.air,
    jeeps: desk.jeeps,
    seasonPercent: desk.seasonPercent,
  };
}
