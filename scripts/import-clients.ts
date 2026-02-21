import fs from 'node:fs';
import { parse } from 'csv-parse/sync';

const file = process.argv[2];
if (!file) {
  console.error('Usage: ts-node scripts/import-clients.ts <path-to-csv>');
  process.exit(1);
}

const csv = fs.readFileSync(file, 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });
console.log(`Parsed ${rows.length} rows. First row:`, rows[0]);
