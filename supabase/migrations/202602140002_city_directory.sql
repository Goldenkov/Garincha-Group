create table city_directory (
  id bigserial primary key,
  city text not null,
  region text not null,
  federal_district text,
  population bigint,
  created_at timestamptz not null default now(),
  unique(city, region)
);

create index idx_city_directory_region on city_directory(region);
create index idx_city_directory_fd on city_directory(federal_district);

create or replace view city_directory_analytics as
select
  coalesce(federal_district, 'external') as federal_district,
  count(*) as cities_count,
  sum(coalesce(population, 0)) as total_population
from city_directory
group by coalesce(federal_district, 'external');
