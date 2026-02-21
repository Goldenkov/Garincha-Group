const roadmap = [
  'Импорт MultiPolygon GeoJSON с валидацией структуры и SRID',
  'Назначение ответственного (branch / manager / partner)',
  'Пересчёт KPI по территории (#клиентов, MRR, coverage)',
  'Point-in-polygon привязка клиента к territory_id'
];

export default function TerritoriesPage() {
  return (
    <main className="space-y-4 p-4 md:p-8">
      <div>
        <h2 className="text-2xl font-semibold">Territories</h2>
        <p className="text-slate-400">GeoJSON import endpoint: <code>/api/territories</code>.</p>
      </div>

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h3 className="mb-2 font-medium">MVP scope</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {roadmap.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-sky-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
        <p>Для загрузки территории отправьте <code>name</code> и <code>geojson</code> в API.</p>
      </section>
    </main>
  );
}
