import { writeFile } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { airExtras, hotelRates, jeepLines, seasons, tours, vehicleRates } from "@/lib/db/schema";
import { readRateWorkbook } from "@/lib/excel-rates";

export const RATE_WORKBOOK = path.join(process.cwd(), "resources", "Trip Cost Calculator Final - Copy.xlsx");

export async function importRates(filePath = RATE_WORKBOOK) {
  const parsed = await readRateWorkbook(filePath);
  const report = path.join(path.dirname(filePath), "import-report.txt");
  await writeFile(report, parsed.unplaced.join("\n"), "utf8");
  await db.delete(hotelRates);
  await db.delete(vehicleRates);
  await db.delete(airExtras);
  await db.delete(jeepLines);
  if (parsed.hotels.length > 0) await db.insert(hotelRates).values(parsed.hotels);
  if (parsed.vehicles.length > 0) await db.insert(vehicleRates).values(parsed.vehicles);
  await db.insert(airExtras).values(parsed.air);
  if (parsed.jeeps.length > 0) await db.insert(jeepLines).values(parsed.jeeps);
  const [season] = await db.select({ id: seasons.id }).from(seasons).limit(1);
  if (!season) await db.insert(seasons).values({ percent: 20 });
  await db.update(tours).set({ priceSource: "website" }).where(eq(tours.code, "201"));
  return parsed.unplaced;
}
