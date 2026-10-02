import { importRates } from "../lib/import-rates";

async function main() {
  const unplaced = await importRates();
  console.info(unplaced.length === 0 ? "The import report has no unplaced row." : `The import report lists ${unplaced.length} unplaced rows.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
