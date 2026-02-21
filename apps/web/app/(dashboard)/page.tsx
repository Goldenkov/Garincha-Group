'use client';

import { useMemo, useState } from 'react';
import { MapView } from '@/components/map-view';
import { sampleClients } from '@/lib/mock-data';
import type { Segment } from '@/lib/types';

const segmentOptions: Segment[] = ['dealer', 'distributor', 'retail', 'partner'];
const statusOptions = ['active', 'prospect', 'churn_risk'] as const;

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<'all' | Segment>('all');
  const [status, setStatus] = useState<'all' | (typeof statusOptions)[number]>('all');

  const filteredClients = useMemo(() => {
    return sampleClients.filter((client) => {
      const queryOk =
        query.trim().length === 0 ||
        client.name.toLowerCase().includes(query.toLowerCase()) ||
        client.city.toLowerCase().includes(query.toLowerCase());
      const segmentOk = segment === 'all' || client.segment === segment;
      const statusOk = status === 'all' || client.status === status;
      return queryOk && segmentOk && statusOk;
    });
  }, [query, segment, status]);

  const aggregates = useMemo(() => {
    const totalRevenue = filteredClients.reduce((acc, client) => acc + (client.revenue_mrr ?? 0), 0);
    const dealers = filteredClients.filter((client) => client.segment === 'dealer').length;

    return {
      total: filteredClients.length,
      dealers,
      revenue: totalRevenue
    };
  }, [filteredClients]);

  return (
    <main className="p-4 md:p-8 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">GG Territory Map</h1>
        <p className="text-slate-400">MVP dashboard: карта РФ, фильтры клиентов, кластеры и базовая аналитика.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-lg border border-slate-700 bg-slate-900 p-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск: город или клиент"
          className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
        />

        <select
          value={segment}
          onChange={(event) => setSegment(event.target.value as 'all' | Segment)}
          className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="all">Все сегменты</option>
          {segmentOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as 'all' | (typeof statusOptions)[number])}
          className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="all">Все статусы</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="text-xs text-slate-300 flex items-center">Найдено клиентов: {filteredClients.length}</div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        <MapView clients={filteredClients} />
        <aside className="rounded-lg border border-slate-700 p-4 bg-slate-900">
          <h2 className="font-medium mb-2">Агрегаты (по фильтру)</h2>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Клиентов: {aggregates.total}</li>
            <li>Дилеров: {aggregates.dealers}</li>
            <li>Выручка MRR: {aggregates.revenue.toLocaleString('ru-RU')} ₽</li>
            <li>План/Факт: 91% (mock)</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
