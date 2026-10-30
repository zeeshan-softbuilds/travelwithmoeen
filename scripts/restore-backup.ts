import { readFileSync } from "fs";
import { getTableColumns, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { BACKUP_FORMAT, BACKUP_TABLES, type BackupFile } from "../lib/office/backup";

const CHUNK = 100;

function usage(): never {
  console.error("Usage: npm run db:restore -- <backup.json> --yes");
  console.error("DATABASE_URL in .env is the database that will be replaced.");
  process.exit(1);
}

function toRows(table: (typeof BACKUP_TABLES)[number][1], rows: Record<string, unknown>[]) {
  const dateKeys = Object.entries(getTableColumns(table))
    .filter(([, column]) => column.columnType === "PgTimestamp")
    .map(([key]) => key);
  return rows.map((row) => {
    const copy = { ...row };
    for (const key of dateKeys) {
      if (typeof copy[key] === "string") copy[key] = new Date(copy[key] as string);
    }
    return copy;
  });
}

function isSerialId(table: (typeof BACKUP_TABLES)[number][1]) {
  const id = (getTableColumns(table) as Record<string, { columnType: string } | undefined>).id;
  return id?.columnType === "PgSerial";
}

async function main() {
  const [file, flag] = process.argv.slice(2);
  if (!file || flag !== "--yes") usage();

  const backup = JSON.parse(readFileSync(file, "utf8")) as BackupFile;
  if (backup.format !== BACKUP_FORMAT) {
    throw new Error(`${file} is not a ${BACKUP_FORMAT} file.`);
  }
  const target = new URL(process.env.DATABASE_URL ?? "");
  console.log(`Restoring ${file} (taken ${backup.createdAt}) into ${target.hostname}${target.pathname}`);

  await db.transaction(async (tx) => {
    for (const [, table] of [...BACKUP_TABLES].reverse()) {
      await tx.delete(table);
    }
    for (const [name, table] of BACKUP_TABLES) {
      const rows = toRows(table, backup.tables[name] ?? []);
      for (let i = 0; i < rows.length; i += CHUNK) {
        await tx.insert(table).values(rows.slice(i, i + CHUNK) as never);
      }
      // Only a serial id has a sequence to move on. tours has a text id, and photos, reviews, slides,
      // and site_settings set their own whole-number ids, so they are left alone.
      if (isSerialId(table)) {
        await tx.execute(
          sql`select setval(pg_get_serial_sequence(${name}, 'id'), coalesce(max(id), 1), max(id) is not null) from ${sql.identifier(name)}`,
        );
      }
      console.log(`${name}: ${rows.length} rows`);
    }
  });
  console.log("Restore finished.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
