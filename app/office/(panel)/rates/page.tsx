import { redirect } from "next/navigation";
import { RatesDesk } from "@/components/office/RatesDesk";
import { getOfficeSession } from "@/lib/http/office-session";
import { loadRateDesk } from "@/lib/rates";

export const dynamic = "force-dynamic";

export default async function OfficeRatesPage() {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const desk = await loadRateDesk();
  return (
    <RatesDesk
      desk={{
        hotels: desk.hotels,
        vehicles: desk.vehicles,
        air: desk.air,
        jeeps: desk.jeeps,
        seasonPercent: desk.seasonPercent,
      }}
    />
  );
}
