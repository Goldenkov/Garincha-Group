# GG Territory Map MVP

Multi-tenant SaaS MVP for managing sales territories across Russia with map visualization, segmentation, KPI analytics, and tenant-safe data boundaries.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind
- MapLibre GL JS + OSM raster tiles
- PostgreSQL 16 + PostGIS (Supabase-compatible SQL model with RLS)
- Docker Compose local run
- Vitest + Playwright smoke tests (prepared)

## Quick start
```bash
cp .env.example .env
docker compose up --build
```
Open: http://localhost:3000/dashboard

## Repository structure
- `apps/web` — frontend app + API routes (CSV import, territory import)
  - Dashboard shell with navigation: `/dashboard`, `/dashboard/clients`, `/dashboard/territories`, `/dashboard/admin`
- `supabase/migrations` — SQL schema, RLS, triggers, indexes
- `supabase/seed` — seed data (2 orgs, 5 branches, 8 territories, 200 clients + city directory)
- `scripts` — helper scripts (city catalog parser/validator, geo simplify)
- `data/geo` — lightweight geojson samples

## Import your 1343-line city catalog (raw text)
Parser accepts both your raw table format (`Город / Регион / Федеральный округ / Население`) and already-normalized CSV (`city,region,federal_district,population`), including:
- tab-separated columns,
- escaped `\n` payloads copied from messengers,
- populations with spaces (`1 938 280`),
- `-` in federal district.

```bash
# 1) Save raw table to file (UTF-8)
node scripts/parse-city-catalog.mjs ./city-source.txt ./supabase/seed/city_population_seed.csv 1343

# 2) Validate row count before DB bootstrap
node scripts/validate-city-seed.mjs ./supabase/seed/city_population_seed.csv 1343
```

If validator fails, DB seed will be incomplete.

> Note: the repository currently contains a demo subset in `supabase/seed/city_population_seed.csv`. Replace it with your full 1343-row export before `docker compose up`, otherwise DB initialization now fails fast by design.

## CSV import (clients)
```bash
curl -X POST http://localhost:3000/api/clients/import \
  -H "Content-Type: text/csv" \
  --data-binary @./sample-clients.csv
```
Required fields: `name,segment,status,city,lat,lon`.

Validation rules (MVP hardening):
- `segment` must be one of `dealer|distributor|retail|partner`;
- `status` must be one of `active|prospect|churn_risk`;
- `lat/lon` validated as numeric WGS84 coordinates;
- CSV upload limit: 5000 rows and ~2MB payload.
- API rate limiting: 20 requests/minute per client IP for `/api/clients/import`.
- Structured API responses include `request_id` for traceability in logs/support.

## Territory import (GeoJSON)
```bash
curl -X POST http://localhost:3000/api/territories \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест территория","geojson":{}}'
```

Territory validation rules: `Polygon|MultiPolygon` only, WGS84 coordinate ranges check, closed linear rings, max 200 geometries per request, and 30 requests/minute per client IP.

## RLS verification (Org A must not see Org B)
```sql
set app.current_org_id = '11111111-1111-1111-1111-111111111111';
select count(*) from clients;

set app.current_org_id = '22222222-2222-2222-2222-222222222222';
select count(*) from clients;
```

## Add your organization
```sql
insert into organizations(name) values ('New Org') returning id;
insert into billing_accounts(organization_id, plan, subscription_status, seats, feature_flags)
values ('<org-id>','trial','trialing',3,'{}');
```

## Replace tiles
Change raster source URL in `apps/web/components/map-view.tsx` from OSM to commercial or self-hosted tiles.

## Deploy notes
- Build web image from `apps/web/Dockerfile`.
- Use managed Postgres + PostGIS in production.
- Route DB with SSL and secure secrets.

## Geo attribution
Current sample uses OpenStreetMap tiles and lightweight handcrafted demo boundaries. Keep attribution/license text when replacing with official/open boundary datasets.
