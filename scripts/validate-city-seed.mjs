import fs from 'node:fs';

const path = process.argv[2] || 'supabase/seed/city_population_seed.csv';
const expectedRows = Number(process.argv[3] || 1343);

const data = fs.readFileSync(path, 'utf8').trim().split(/\r?\n/);
if (data.length < 2) {
  console.error('Seed CSV is empty');
  process.exit(1);
}

const header = data[0];
if (header !== 'city,region,federal_district,population') {
  console.error(`Unexpected header: ${header}`);
  process.exit(2);
}

const rowCount = data.length - 1;
if (rowCount !== expectedRows) {
  console.error(`Seed has ${rowCount} rows, expected exactly ${expectedRows}`);
  process.exit(3);
}

console.log(`City seed OK: ${rowCount} rows`);
