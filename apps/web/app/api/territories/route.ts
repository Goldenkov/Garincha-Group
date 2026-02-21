import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { jsonError, jsonOk } from '@/lib/api-response';

const payloadSchema = z.object({
  name: z.string().min(2).max(160),
  geojson: z.record(z.any())
});

const maxFeatures = 200;

function isValidLngLat(pair: unknown): pair is [number, number] {
  if (!Array.isArray(pair) || pair.length < 2) return false;
  const lng = Number(pair[0]);
  const lat = Number(pair[1]);
  return Number.isFinite(lng) && Number.isFinite(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
}

function validateRing(ring: unknown): boolean {
  if (!Array.isArray(ring) || ring.length < 4) return false;
  if (!ring.every((point) => isValidLngLat(point))) return false;

  const first = ring[0] as [number, number];
  const last = ring[ring.length - 1] as [number, number];
  return Number(first[0]) === Number(last[0]) && Number(first[1]) === Number(last[1]);
}

function isPolygonCoordinates(coordinates: unknown): boolean {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return false;
  return coordinates.every((ring) => validateRing(ring));
}

function isMultiPolygonCoordinates(coordinates: unknown): boolean {
  if (!Array.isArray(coordinates) || coordinates.length === 0) return false;
  return coordinates.every((polygon) => isPolygonCoordinates(polygon));
}

function extractGeometries(geojson: Record<string, unknown>): Array<Record<string, unknown>> {
  const type = geojson.type;

  if (type === 'FeatureCollection') {
    const features = Array.isArray(geojson.features) ? geojson.features : [];
    return features
      .map((feature) => (feature && typeof feature === 'object' ? (feature as Record<string, unknown>).geometry : null))
      .filter((geometry): geometry is Record<string, unknown> => Boolean(geometry && typeof geometry === 'object'));
  }

  if (type === 'Feature') {
    const geometry = geojson.geometry;
    return geometry && typeof geometry === 'object' ? [geometry as Record<string, unknown>] : [];
  }

  return [geojson];
}

export async function POST(req: Request) {

  const clientIp = getClientIp(req);
  const limiter = checkRateLimit(`territories-import:${clientIp}`, 30, 60_000);

  if (!limiter.allowed) {
    return jsonError(req, 429, 'Too many territory requests. Please retry later.', {}, {
      'Retry-After': String(limiter.retryAfterSec),
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  let rawPayload: unknown;
  try {
    rawPayload = await req.json();
  } catch {
    return jsonError(req, 400, 'Malformed JSON payload', {}, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  const parsed = payloadSchema.safeParse(rawPayload);

  if (!parsed.success) {
    return jsonError(req, 400, 'name and geojson are required', { issues: parsed.error.issues }, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  const { name, geojson } = parsed.data;
  const geometries = extractGeometries(geojson);

  if (geometries.length === 0) {
    return jsonError(req, 400, 'GeoJSON has no geometry', {}, { 'X-RateLimit-Remaining': String(limiter.remaining) });
  }

  if (geometries.length > maxFeatures) {
    return jsonError(req, 400, `Too many features. Max ${maxFeatures}, got ${geometries.length}`, {}, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  const invalidIdx = geometries.findIndex((geometry) => {
    const geometryType = geometry.type;
    if (geometryType === 'Polygon') return !isPolygonCoordinates(geometry.coordinates);
    if (geometryType === 'MultiPolygon') return !isMultiPolygonCoordinates(geometry.coordinates);
    return true;
  });

  if (invalidIdx >= 0) {
    return jsonError(req, 400, `Invalid geometry at index ${invalidIdx}. Only Polygon/MultiPolygon with valid WGS84 coordinates are allowed.`, {}, {
      'X-RateLimit-Remaining': String(limiter.remaining)
    });
  }

  return jsonOk(req, {
    message: 'Territory accepted for import',
    territory_name: name,
    geometries: geometries.length,
    geometry_type: geometries.length === 1 ? geometries[0].type : 'mixed'
  }, { 'X-RateLimit-Remaining': String(limiter.remaining) });
}
