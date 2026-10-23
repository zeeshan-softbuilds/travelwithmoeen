import { AirExtrasForm } from "@/components/office/rates/AirExtrasForm";
import { loadRateDesk } from "@/components/office/rates/load-rates";
import { Alert } from "@/components/office/ui/Alert";

export default async function RatesAirPage() {
  const desk = await loadRateDesk();
  return desk.air ? <AirExtrasForm air={desk.air} /> : <Alert tone="warning" title="Run the rate import before editing air extras." />;
}
