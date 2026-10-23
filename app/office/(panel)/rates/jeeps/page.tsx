import { loadRateDesk } from "@/components/office/rates/load-rates";
import { RateTable } from "@/components/office/rates/RateTable";

export default async function RatesJeepsPage() {
  const desk = await loadRateDesk();
  return (
    <RateTable
      kind="jeep"
      noun="jeep lines"
      searchLabel="Search jeep line or place"
      columns={[
        { key: "label", label: "Jeep line", type: "text" },
        { key: "place", label: "Place", type: "text" },
        { key: "mode", label: "Mode", type: "text" },
        { key: "amount", label: "Amount", type: "money" },
        { key: "live", label: "On", type: "switch" },
      ]}
      rows={desk.jeeps.map((row) => ({ id: row.id, values: { label: row.label, place: row.place, mode: row.mode, amount: row.amount, live: row.live } }))}
      nameKeys={["label", "place"]}
    />
  );
}
