import { loadRateDesk } from "@/components/office/rates/load-rates";
import { MarginForm } from "@/components/office/rates/MarginForm";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getSavedBy } from "@/lib/http/office-session";

export default async function RatesMarginPage() {
  const [desk, savedBy] = await Promise.all([loadRateDesk(), getSavedBy("margin")]);
  return <MarginForm margin={desk.seasonPercent} savedBy={savedByText(savedBy[""], requestTime())} />;
}
