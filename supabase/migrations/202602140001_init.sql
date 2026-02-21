create extension if not exists postgis;
create extension if not exists pgcrypto;

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table profiles (
  user_id uuid primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','viewer')),
  full_name text not null
);

create table branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  city text not null,
  lat numeric not null,
  lon numeric not null,
  created_at timestamptz not null default now()
);

create table territories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  responsible_type text not null check (responsible_type in ('branch','manager','partner')),
  responsible_id uuid,
  geom geometry(MultiPolygon, 4326) not null,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  segment text not null check (segment in ('dealer','distributor','retail','partner')),
  status text not null,
  city text not null,
  lat numeric not null,
  lon numeric not null,
  branch_id uuid references branches(id),
  territory_id uuid references territories(id),
  manager_user_id uuid,
  revenue_mrr numeric,
  updated_at timestamptz not null default now()
);

create table audit_log (
  id bigserial primary key,
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  diff jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table billing_accounts (
  organization_id uuid primary key references organizations(id) on delete cascade,
  plan text not null check (plan in ('trial','pro','enterprise')),
  subscription_status text not null check (subscription_status in ('trialing','active','past_due','canceled')),
  seats int not null default 3,
  feature_flags jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index idx_clients_org on clients(organization_id);
create index idx_clients_filters on clients(organization_id, segment, status, city);
create index idx_branches_org on branches(organization_id);
create index idx_territories_org on territories(organization_id);
create index idx_territories_geom on territories using gist(geom);
create index idx_audit_org on audit_log(organization_id, created_at desc);

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table branches enable row level security;
alter table territories enable row level security;
alter table clients enable row level security;
alter table audit_log enable row level security;
alter table billing_accounts enable row level security;

create function app_current_org() returns uuid language sql stable as $$
  select nullif(current_setting('app.current_org_id', true), '')::uuid;
$$;

create policy org_isolation_profiles on profiles using (organization_id = app_current_org());
create policy org_isolation_branches on branches using (organization_id = app_current_org()) with check (organization_id = app_current_org());
create policy org_isolation_territories on territories using (organization_id = app_current_org()) with check (organization_id = app_current_org());
create policy org_isolation_clients on clients using (organization_id = app_current_org()) with check (organization_id = app_current_org());
create policy org_isolation_audit on audit_log using (organization_id = app_current_org()) with check (organization_id = app_current_org());
create policy org_isolation_billing on billing_accounts using (organization_id = app_current_org()) with check (organization_id = app_current_org());
create policy org_isolation_orgs on organizations using (id = app_current_org());

create function audit_entity_changes() returns trigger language plpgsql as $$
declare
  org_id uuid;
begin
  org_id := coalesce(new.organization_id, old.organization_id);
  insert into audit_log(organization_id, actor_user_id, action, entity_type, entity_id, diff)
  values (
    org_id,
    nullif(current_setting('app.current_user_id', true), '')::uuid,
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
  );
  return coalesce(new, old);
end $$;

create trigger trg_audit_clients after insert or update or delete on clients
for each row execute function audit_entity_changes();

create trigger trg_audit_territories after insert or update or delete on territories
for each row execute function audit_entity_changes();

create function assign_client_territory() returns trigger language plpgsql as $$
begin
  if new.territory_id is null then
    select t.id into new.territory_id
    from territories t
    where t.organization_id = new.organization_id
      and st_contains(t.geom, st_setsrid(st_makepoint(new.lon, new.lat), 4326))
    limit 1;
  end if;
  return new;
end $$;

create trigger trg_assign_territory before insert or update of lat, lon on clients
for each row execute function assign_client_territory();
