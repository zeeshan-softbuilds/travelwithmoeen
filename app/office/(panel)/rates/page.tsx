import { loadRateDesk } from "@/components/office/rates/load-rates";
import { RateTable } from "@/components/office/rates/RateTable";
import { savedByCells } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getSavedBy } from "@/lib/http/office-session";
import { Alert } from "@/components/office/ui/Alert";

// Hotel rates by place, start city, and grade, with twin and 3-share (BR-84). The catalog is T-39.
export default async function RatesHotelsPage() {
  const [desk, savedBy] = await Promise.all([loadRateDesk(), getSavedBy("hotel_rate")]);
  return (
    <>
      <Alert tone="info" title="Hotel nights use these grade rates">
        A quote prices a hotel night from the place, start city, and grade: the twin rate for two or fewer in a room, the 3-share rate for more.
      </Alert>
      <RateTable
        kind="hotel"
        noun="hotel rates"
        searchLabel="Search place or hotel"
        filters={["place", "grade"]}
        columns={[
          { key: "place", label: "Place", type: "text" },
          { key: "startCity", label: "Start", type: "text" },
          { key: "grade", label: "Grade", type: "text" },
          { key: "twin", label: "Twin", type: "money" },
          { key: "triple", label: "3-share", type: "money" },
          { key: "hotelName", label: "Hotel", type: "name" },
          { key: "offered", label: "Offered", type: "switch" },
        ]}
        rows={desk.hotels.map((row) => ({ id: row.id, values: { place: row.place, startCity: row.startCity, grade: row.grade, twin: row.twin, triple: row.triple, hotelName: row.hotelName, offered: row.offered } }))}
        savedBy={savedByCells(savedBy, requestTime())}
        nameKeys={["place", "startCity", "grade"]}
      />
    </>
  );
}
