import { readFile } from "fs/promises";
import { inflateRawSync } from "zlib";

const GRADES = ["Deluxe", "Premier", "Executive", "Luxury", "Ultra Luxury"] as const;
const SHEETS = ["Road_DB ISB", "Road_DB LHE", "Air_DB"] as const;
const SWAT = "Swat Kalam & Malam Jabba";
const TAOBAT_SHEET = "Neelum Taobat Arang Kel";
const TAOBAT = "Taobat";
const INFANT_EXTRA = 800;

export type ParsedHotel = {
  place: string;
  startCity: string;
  grade: string;
  twin: number;
  triple: number;
  hotelName: string;
  offered: boolean;
};

export type ParsedVehicle = {
  place: string;
  startCity: string;
  mode: "road" | "air";
  vehicle: string;
  rent: number;
  fuel: number;
  toll: number;
  seats: number;
  live: boolean;
};

export type ParsedAir = {
  islamabadTicket: number;
  lahoreAdd: number;
  karachiAdd: number;
  welcomePack: number;
  entry: number;
  infantExtra: number;
  sticker: number;
};

export type ParsedJeep = {
  place: string;
  mode: "road" | "air" | "both";
  label: string;
  people: number;
  amount: number;
  live: boolean;
};

export type ParsedRates = {
  hotels: ParsedHotel[];
  vehicles: ParsedVehicle[];
  air: ParsedAir;
  jeeps: ParsedJeep[];
  unplaced: string[];
};

type CellMap = Map<string, string>;

function columnRow(ref: string) {
  const column = ref.replace(/[0-9]/g, "");
  const row = Number(ref.replace(/[A-Z]/g, ""));
  let index = 0;
  for (const char of column) index = index * 26 + char.charCodeAt(0) - 64;
  return { index, row };
}

function textOf(node: string, tag: string) {
  const match = node.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match?.[1] ?? "";
}

function decodeXml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function unzip(buffer: Buffer) {
  const files = new Map<string, Buffer>();
  let offset = 0;
  while (offset + 30 < buffer.length) {
    const signature = buffer.readUInt32LE(offset);
    if (signature !== 0x04034b50) break;
    const method = buffer.readUInt16LE(offset + 8);
    const compressed = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer.subarray(offset + 30, offset + 30 + nameLength).toString("utf8");
    const start = offset + 30 + nameLength + extraLength;
    const data = buffer.subarray(start, start + compressed);
    files.set(name, method === 0 ? Buffer.from(data) : inflateRawSync(data));
    offset = start + compressed;
  }
  return files;
}

function sharedStrings(xml: string) {
  const values: string[] = [];
  for (const item of xml.match(/<si\b[\s\S]*?<\/si>/g) ?? []) {
    const texts = [...item.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((match) => decodeXml(match[1] ?? ""));
    values.push(texts.join(""));
  }
  return values;
}

function sheetCells(xml: string, strings: string[]) {
  const cells: CellMap = new Map();
  let maxRow = 1;
  for (const cell of xml.match(/<c\b[^>]*\/>|<c\b[^>]*>[\s\S]*?<\/c>/g) ?? []) {
    const ref = cell.match(/\br="([A-Z]+)(\d+)"/);
    if (!ref?.[1] || !ref[2]) continue;
    const { index, row } = columnRow(`${ref[1]}${ref[2]}`);
    maxRow = Math.max(maxRow, row);
    const type = cell.match(/\bt="([^"]+)"/)?.[1];
    const cached = textOf(cell, "v");
    let value = "";
    if (type === "s" && cached) value = strings[Number(cached)] ?? "";
    else if (type === "inlineStr") value = decodeXml(textOf(cell, "t"));
    else if (cached) value = cached;
    if (value !== "") cells.set(`${row}:${index}`, value);
  }
  return { cells, maxRow };
}

function cell(cells: CellMap, row: number, column: number) {
  return (cells.get(`${row}:${column}`) ?? "").trim();
}

function amount(value: string) {
  if (!value) return 0;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : 0;
}

function officeVehicle(name: string) {
  return name.trim().toLowerCase() === "parado" ? "Prado" : name.trim();
}

function gradeFromKey(key: string, twin: number, triple: number) {
  const split = key.lastIndexOf("_");
  const place = split === -1 ? key : key.slice(0, split).trim();
  const grade = split === -1 ? "" : key.slice(split + 1).trim();
  if (GRADES.includes(grade as (typeof GRADES)[number])) return { place, grade };
  if (place === "Skardu & Hunza" && twin === 24000 && triple === 28000) return { place, grade: "Executive" };
  return { place, grade: "" };
}

function sheetMode(name: string): { startCity: string; mode: "road" | "air" } {
  if (name === "Road_DB LHE") return { startCity: "Lahore", mode: "road" };
  if (name === "Air_DB") return { startCity: "Air", mode: "air" };
  return { startCity: "Islamabad", mode: "road" };
}

function workbookSheets(files: Map<string, Buffer>) {
  const workbook = files.get("xl/workbook.xml")?.toString("utf8") ?? "";
  const rels = files.get("xl/_rels/workbook.xml.rels")?.toString("utf8") ?? "";
  const targets = new Map<string, string>();
  for (const rel of rels.match(/<Relationship\b[^>]*>/g) ?? []) {
    const id = rel.match(/\bId="([^"]+)"/)?.[1];
    const target = rel.match(/\bTarget="([^"]+)"/)?.[1];
    if (id && target) targets.set(id, target.startsWith("xl/") ? target : `xl/${target}`);
  }
  const sheets = new Map<string, string>();
  for (const sheet of workbook.match(/<sheet\b[^>]*>/g) ?? []) {
    const name = sheet.match(/\bname="([^"]+)"/)?.[1];
    const id = sheet.match(/\br:id="([^"]+)"/)?.[1];
    const target = id ? targets.get(id) : undefined;
    if (name && target) sheets.set(name, target);
  }
  return sheets;
}

function readSheet(files: Map<string, Buffer>, path: string, strings: string[]) {
  const xml = files.get(path)?.toString("utf8");
  if (!xml) return { cells: new Map<string, string>(), maxRow: 1 };
  return sheetCells(xml, strings);
}

function replaceTaobat<T extends { place: string }>(rows: T[]) {
  const swat = rows.filter((row) => row.place === SWAT).map((row) => ({ ...row, place: TAOBAT }));
  return [...rows.filter((row) => row.place !== TAOBAT_SHEET), ...swat];
}

const JEEPS: ParsedJeep[] = [
  { place: "Kalash Valley & Chitral", mode: "road", label: "4x4 jeep (3 days)", people: 6, amount: 90000, live: true },
  { place: "Minimarg Astor Valley", mode: "road", label: "4x4 jeep (3 days)", people: 6, amount: 90000, live: true },
  { place: "Kumrat and Katora Lake", mode: "road", label: "4x4 jeep", people: 6, amount: 16200, live: true },
  { place: "Fairy Meadows Nanga Base Camp", mode: "both", label: "Jeep plus porter (Raikot)", people: 6, amount: 18200, live: true },
];

export async function readRateWorkbook(filePath: string): Promise<ParsedRates> {
  const files = unzip(await readFile(filePath));
  const strings = sharedStrings(files.get("xl/sharedStrings.xml")?.toString("utf8") ?? "");
  const sheets = workbookSheets(files);
  const hotels: ParsedHotel[] = [];
  const vehicles: ParsedVehicle[] = [];
  const unplaced: string[] = [];
  let air: ParsedAir = {
    islamabadTicket: 0,
    lahoreAdd: 0,
    karachiAdd: 0,
    welcomePack: 0,
    entry: 0,
    infantExtra: INFANT_EXTRA,
    sticker: 0,
  };

  for (const name of SHEETS) {
    const path = sheets.get(name);
    if (!path) {
      unplaced.push(`${name} is missing.`);
      continue;
    }
    const { cells, maxRow } = readSheet(files, path, strings);
    const { startCity, mode } = sheetMode(name);
    let placeAbove = "";
    for (let row = 2; row <= maxRow; row += 1) {
      let place = cell(cells, row, 1);
      const vehicle = cell(cells, row, 2);
      const rent = amount(cell(cells, row, 3));
      const toll = amount(cell(cells, row, 4));
      const fuel = amount(cell(cells, row, 5));
      const seats = amount(cell(cells, row, 6));
      if (place) placeAbove = place;
      else if (vehicle && (rent || fuel || seats)) {
        if (placeAbove) place = placeAbove;
        else unplaced.push(`${name} row ${row} has no place.`);
      }
      if (place && vehicle) {
        const live = !(rent === 0 && fuel === 0 && toll === 0) && seats > 0;
        vehicles.push({
          place,
          startCity,
          mode,
          vehicle: officeVehicle(vehicle),
          rent,
          fuel,
          toll,
          seats,
          live,
        });
      }

      const key = cell(cells, row, 9);
      if (key) {
        const twin = amount(cell(cells, row, 10));
        const triple = amount(cell(cells, row, 11));
        const named = gradeFromKey(key, twin, triple);
        if (!named.place || !named.grade) unplaced.push(`${name} hotel row ${row} has no place.`);
        else {
          hotels.push({
            place: named.place,
            startCity,
            grade: named.grade,
            twin,
            triple,
            hotelName: cell(cells, row, 12),
            offered: named.grade !== "Premier",
          });
        }
      }
    }

    if (name === "Air_DB") {
      const labels = new Map<string, number>();
      for (let row = 2; row <= maxRow; row += 1) {
        const label = cell(cells, row, 14);
        if (label) labels.set(label, amount(cell(cells, row, 15)));
      }
      const required = [
        ["Ticket-ISB", "islamabadTicket"],
        ["KHI-Add", "karachiAdd"],
        ["LHE-Add", "lahoreAdd"],
        ["Pack", "welcomePack"],
        ["Entry", "entry"],
        ["Sticker", "sticker"],
      ] as const;
      air = { ...air };
      for (const [label, field] of required) {
        if (!labels.has(label)) unplaced.push(`Air_DB has no ${label} amount.`);
        else air[field] = labels.get(label) ?? 0;
      }
    }
  }

  return {
    hotels: replaceTaobat(hotels),
    vehicles: replaceTaobat(vehicles),
    air,
    jeeps: JEEPS,
    unplaced,
  };
}
