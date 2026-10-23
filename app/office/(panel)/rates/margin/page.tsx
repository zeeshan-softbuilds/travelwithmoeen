import { loadRateDesk } from "@/components/office/rates/load-rates";
import { MarginForm } from "@/components/office/rates/MarginForm";

export default async function RatesMarginPage() {
  const desk = await loadRateDesk();
  return <MarginForm margin={desk.seasonPercent} />;
}
