import { QuoteForm } from "@/components/office/rates/LegacyRateForms";
import { loadRateDesk } from "@/components/office/rates/load-rates";

export default async function RatesQuotePage() {
  const desk = await loadRateDesk();
  const places = [...new Set(desk.hotels.map((row) => row.place))];
  return <QuoteForm places={places} vehicles={desk.vehicles} margin={desk.seasonPercent} />;
}
