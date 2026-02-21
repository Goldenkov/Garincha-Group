insert into organizations (id, name) values
('11111111-1111-1111-1111-111111111111','Garincha North'),
('22222222-2222-2222-2222-222222222222','Garincha East');

insert into profiles(user_id, organization_id, role, full_name) values
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1','11111111-1111-1111-1111-111111111111','owner','Owner A'),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2','11111111-1111-1111-1111-111111111111','manager','Manager A'),
('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1','22222222-2222-2222-2222-222222222222','owner','Owner B');

insert into branches(id, organization_id, name, city, lat, lon) values
('30000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Москва HQ','Москва',55.7558,37.6176),
('30000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','СПБ Branch','Санкт-Петербург',59.9343,30.3351),
('30000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','Казань Branch','Казань',55.7961,49.1064),
('30000000-0000-0000-0000-000000000004','22222222-2222-2222-2222-222222222222','Новосибирск Hub','Новосибирск',55.0084,82.9357),
('30000000-0000-0000-0000-000000000005','22222222-2222-2222-2222-222222222222','Хабаровск Hub','Хабаровск',48.4802,135.0719);

insert into territories(id, organization_id, name, responsible_type, responsible_id, geom) values
('40000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','ЦФО-1','branch','30000000-0000-0000-0000-000000000001', st_geomfromtext('MULTIPOLYGON(((34 52,42 52,42 58,34 58,34 52)))',4326)),
('40000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','СЗФО-1','branch','30000000-0000-0000-0000-000000000002', st_geomfromtext('MULTIPOLYGON(((27 57,36 57,36 62,27 62,27 57)))',4326)),
('40000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','ПФО-1','manager','aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', st_geomfromtext('MULTIPOLYGON(((45 53,56 53,56 58,45 58,45 53)))',4326)),
('40000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','ЮФО-1','partner',null, st_geomfromtext('MULTIPOLYGON(((36 43,47 43,47 48,36 48,36 43)))',4326)),
('40000000-0000-0000-0000-000000000005','22222222-2222-2222-2222-222222222222','СФО-1','branch','30000000-0000-0000-0000-000000000004', st_geomfromtext('MULTIPOLYGON(((73 52,89 52,89 58,73 58,73 52)))',4326)),
('40000000-0000-0000-0000-000000000006','22222222-2222-2222-2222-222222222222','ДФО-1','branch','30000000-0000-0000-0000-000000000005', st_geomfromtext('MULTIPOLYGON(((125 45,142 45,142 54,125 54,125 45)))',4326)),
('40000000-0000-0000-0000-000000000007','22222222-2222-2222-2222-222222222222','УФО-1','manager',null, st_geomfromtext('MULTIPOLYGON(((58 54,68 54,68 60,58 60,58 54)))',4326)),
('40000000-0000-0000-0000-000000000008','22222222-2222-2222-2222-222222222222','СКФО-1','partner',null, st_geomfromtext('MULTIPOLYGON(((41 42,49 42,49 46,41 46,41 42)))',4326));

insert into billing_accounts(organization_id, plan, subscription_status, seats, feature_flags) values
('11111111-1111-1111-1111-111111111111','pro','active',20,'{"territory_draw": true, "advanced_analytics": true, "crm_sync": false}'::jsonb),
('22222222-2222-2222-2222-222222222222','trial','trialing',5,'{"territory_draw": false, "advanced_analytics": false, "crm_sync": false}'::jsonb);

insert into clients(organization_id, name, segment, status, city, lat, lon, branch_id, manager_user_id, revenue_mrr)
select
  case when gs <= 120 then '11111111-1111-1111-1111-111111111111'::uuid else '22222222-2222-2222-2222-222222222222'::uuid end,
  'Client ' || gs,
  (array['dealer','distributor','retail','partner'])[1 + (gs % 4)],
  (array['active','prospect','churn_risk'])[1 + (gs % 3)],
  (array['Москва','Санкт-Петербург','Казань','Новосибирск','Екатеринбург','Хабаровск'])[1 + (gs % 6)],
  43 + random() * 20,
  30 + random() * 110,
  case when gs <= 120 then (array['30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003'])[(gs % 3)+1]::uuid
       else (array['30000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000005'])[(gs % 2)+1]::uuid end,
  case when gs <= 120 then 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2'::uuid else null end,
  (50000 + (random() * 400000))::numeric
from generate_series(1,200) gs;

copy city_directory(city, region, federal_district, population)
from '/docker-entrypoint-initdb.d/02-seed/city_population_seed.csv'
with (format csv, header true);


-- Prevent partial city imports from silently passing local bootstrap.
do $$
declare
  city_rows integer;
begin
  select count(*) into city_rows from city_directory;
  if city_rows <> 1343 then
    raise exception 'city_directory must contain exactly 1343 rows, got %', city_rows;
  end if;
end $$;
