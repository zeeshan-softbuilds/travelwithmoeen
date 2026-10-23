import { loadRateDesk } from "@/components/office/rates/load-rates";
import { RateTable } from "@/components/office/rates/RateTable";

export default async function RatesVehiclesPage() {
  const desk = await loadRateDesk();
  return (
    <RateTable
      kind="vehicle"
      noun="vehicle rates"
      searchLabel="Search place or vehicle"
      filters={["place"]}
      columns={[
        { key: "place", label: "Place", type: "text" },
        { key: "startCity", label: "Start", type: "text" },
        { key: "vehicle", label: "Vehicle", type: "text" },
        { key: "rent", label: "Rent", type: "money" },
        { key: "fuel", label: "Fuel", type: "money" },
        { key: "toll", label: "Toll", type: "money" },
        { key: "seats", label: "Seats", type: "count" },
        { key: "live", label: "On", type: "switch" },
      ]}
      rows={desk.vehicles.map((row) => ({ id: row.id, values: { place: row.place, startCity: row.startCity, vehicle: row.vehicle, rent: row.rent, fuel: row.fuel, toll: row.toll, seats: row.seats, live: row.live } }))}
      nameKeys={["place", "startCity", "vehicle"]}
    />
  );
}
