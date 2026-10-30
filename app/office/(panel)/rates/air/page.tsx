import { AirExtrasForm } from "@/components/office/rates/AirExtrasForm";
import { loadRateDesk } from "@/components/office/rates/load-rates";
import { Alert } from "@/components/office/ui/Alert";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getSavedBy } from "@/lib/http/office-session";

export default async function RatesAirPage() {
  const [desk, savedBy] = await Promise.all([loadRateDesk(), getSavedBy("air_extra")]);
  return desk.air ? <AirExtrasForm air={desk.air} savedBy={savedByText(savedBy[""], requestTime())} /> : <Alert tone="warning" title="Run the rate import before editing air extras." />;
}
