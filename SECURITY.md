# Security model (MVP)

## Threat model (short)
- Cross-tenant data leakage is the main risk.
- Unauthorized write operations by lower roles.
- Token/secret leakage from client or logs.
- Abuse of import endpoints (massive payloads / malformed CSV).

## Controls in MVP
- **Row Level Security (RLS)** enabled on all tenant-bound tables.
- Tenant scoping via `organization_id` + DB session setting `app.current_org_id`.
- Audit trail for `clients` and `territories` through DB triggers (`audit_log`).
- CSP header set in Next.js middleware.
- Input validation on CSV import (required columns, enum checks, lat/lon bounds, payload/row limits).
- GeoJSON validation on territory import (Polygon/MultiPolygon only, coordinate bounds, feature count limits).
- Basic API rate limiting on import endpoints to reduce brute-force/malformed upload abuse.
- Request traceability via `request_id` in JSON responses for audit and incident triage.

## Hardening required before production
- Replace mock auth context with real Supabase Auth JWT claims and `auth.uid()` integration.
- Add API rate limiting (e.g., Upstash Redis sliding window) for import/search endpoints.
- Add CSRF strategy for state-changing endpoints if cookie session is used.
- Enforce strict CSP (remove `unsafe-inline`/`unsafe-eval`), add nonce strategy.
- Rotate secrets via vault, never expose service role key to browser.
- Add database backups, PITR, and SIEM log shipping.
