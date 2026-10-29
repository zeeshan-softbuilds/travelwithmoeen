import { loadRateDesk } from "@/components/office/rates/load-rates";
import { QuoteScreen } from "@/components/office/rates/QuoteScreen";

export default async function RatesQuotePage() {
  const desk = await loadRateDesk();
  const places = [...new Set(desk.hotels.map((row) => row.place))];
  const vehicles = [...new Set(desk.vehicles.filter((row) => row.live).map((row) => row.vehicle))];
  return <QuoteScreen places={places} vehicles={vehicles} margin={desk.seasonPercent} />;
}
