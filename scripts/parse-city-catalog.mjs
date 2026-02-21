import fs from 'node:fs';

const HEADER = 'city,region,federal_district,population';

function normalizeInput(raw) {
  // Supports both true newlines and escaped "\\n" payloads from messengers.
  const withNewlines = raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw;
  return withNewlines.includes('\\t') ? withNewlines.replace(/\\t/g, '\t') : withNewlines;
}

function normalizePopulation(input) {
  const cleaned = String(input ?? '').replace(/[^\d]/g, '');
  return cleaned.length > 0 ? cleaned : '';
}

function splitRawColumns(line) {
  // 1) TSV first, 2) fallback to 2+ spaces delimiter.
  const tsv = line.split('\t').map((p) => p.trim());
  if (tsv.length >= 3) return tsv;
  return line.split(/\s{2,}/).map((p) => p.trim());
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  result.push(current.trim());
  return result;
}

function normalizeRow(cityRaw, regionRaw, federalDistrictRaw = '', populationRaw = '') {
  const city = cityRaw.trim();
  const region = regionRaw.trim();
  const federalDistrict = federalDistrictRaw.trim() === '-' ? '' : federalDistrictRaw.trim();
  const population = normalizePopulation(populationRaw);

  if (!city || !region) return null;
  return { city, region, federalDistrict, population };
}

export function parseCatalog(raw) {
  const normalized = normalizeInput(raw)
    .replace(/\u00a0/g, ' ') // nbsp
    .replace(/\r/g, '');

  const lines = normalized
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== HEADER)
    .filter((line) => !line.startsWith('Город\tРегион'))
    .filter((line) => !line.startsWith('Город  Регион'));

  const seen = new Set();
  const rows = [];

  for (const line of lines) {
    let parts;

    if (line.includes(',') && !line.includes('\t')) {
      parts = parseCsvLine(line);
    } else {
      parts = splitRawColumns(line);
    }

    if (parts.length < 2) continue;

    const row = normalizeRow(parts[0] ?? '', parts[1] ?? '', parts[2] ?? '', parts[3] ?? '');
    if (!row) continue;

    const key = `${row.city}|${row.region}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push(row);
  }

  return rows;
}

function esc(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function toCsv(rows) {
  const body = rows
    .map((row) => [row.city, row.region, row.federalDistrict, row.population].map(esc).join(','))
    .join('\n');
  return `${HEADER}\n${body}\n`;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || 'supabase/seed/city_population_seed.csv';
  const minRows = Number(process.argv[4] || 1343);

  if (!inputPath) {
    console.error('Usage: node scripts/parse-city-catalog.mjs <input.txt|input.csv> [output.csv] [minRows]');
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const rows = parseCatalog(raw);

  if (rows.length < minRows) {
    console.error(`Parsed only ${rows.length} rows (< ${minRows}). Check source format.`);
    process.exit(2);
  }

  fs.writeFileSync(outputPath, toCsv(rows), 'utf8');
  console.log(`Parsed ${rows.length} city rows -> ${outputPath}`);
}
