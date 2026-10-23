import { SeasonForm } from "@/components/office/rates/LegacyRateForms";
import { loadRateDesk } from "@/components/office/rates/load-rates";

export default async function RatesMarginPage() {
  const desk = await loadRateDesk();
  return <SeasonForm percent={desk.seasonPercent} />;
}
