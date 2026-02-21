import { parse } from 'csv-parse/sync';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { jsonError, jsonOk } from '@/lib/api-response';

const required = ['name', 'segment', 'status', 'city', 'lat', 'lon'] as const;
const allowedSegments = new Set(['dealer', 'distributor', 'retail', 'partner']);
const allowedStatuses = new Set(['active', 'prospect', 'churn_risk']);
const maxRows = 5000;
const maxPayloadBytes = 2 * 1024 * 1024;

type CsvRow = Record<(typeof required)[number], string>;

function toNumber(value: string): number | null {
  const normalized = String(value ?? '').replace(',', '.').trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(req: Request) {

  const clientIp = getClientIp(req);
  const limiter = checkRateLimit(`clients-import:${clientIp}`, 20, 60_000);

  if (!limiter.allowed) {
    return jsonError(req, 429, 'Too many import requests. Please retry later.', {}, {
      'Retry-After': String(limiter.retryAfterSec),
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  const body = await req.text();

  if (body.length > maxPayloadBytes) {
    return jsonError(req, 413, `Payload too large. Max ${maxPayloadBytes} bytes.`, {}, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  let records: CsvRow[];
  try {
    records = parse(body, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true
    }) as CsvRow[];
  } catch {
    return jsonError(req, 400, 'Malformed CSV payload', {}, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  if (records.length === 0) {
    return jsonError(req, 400, 'CSV is empty', {}, { 'X-RateLimit-Remaining': String(limiter.remaining) });
  }

  if (records.length > maxRows) {
    return jsonError(req, 400, `Too many rows. Max ${maxRows}, got ${records.length}.`, {}, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  const errors: string[] = [];

  records.forEach((row, idx) => {
    required.forEach((key) => {
      if (!String(row[key] ?? '').trim()) {
        errors.push(`Row ${idx + 2}: missing ${key}`);
      }
    });

    const segment = String(row.segment ?? '').trim();
    if (segment && !allowedSegments.has(segment)) {
      errors.push(`Row ${idx + 2}: invalid segment '${segment}'`);
    }

    const status = String(row.status ?? '').trim();
    if (status && !allowedStatuses.has(status)) {
      errors.push(`Row ${idx + 2}: invalid status '${status}'`);
    }

    const lat = toNumber(row.lat);
    const lon = toNumber(row.lon);

    if (lat === null || lat < -90 || lat > 90) {
      errors.push(`Row ${idx + 2}: invalid lat '${row.lat}'`);
    }

    if (lon === null || lon < -180 || lon > 180) {
      errors.push(`Row ${idx + 2}: invalid lon '${row.lon}'`);
    }
  });

  if (errors.length > 0) {
    return jsonError(req, 400, 'CSV validation failed', { errors: errors.slice(0, 100) }, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  return jsonOk(req, { imported: records.length, validated: true }, {
    'X-RateLimit-Remaining': String(limiter.remaining)
  });
}
