import { loadRateDesk } from "@/components/office/rates/load-rates";
import { RateTable } from "@/components/office/rates/RateTable";
import { savedByCells } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getSavedBy } from "@/lib/http/office-session";

export default async function RatesJeepsPage() {
  const [desk, savedBy] = await Promise.all([loadRateDesk(), getSavedBy("jeep_line")]);
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
      savedBy={savedByCells(savedBy, requestTime())}
      nameKeys={["label", "place"]}
    />
  );
}
