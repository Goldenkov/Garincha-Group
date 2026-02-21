import { sampleClients } from '@/lib/mock-data';

export default function ClientsPage() {
  return (
    <main className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-slate-400">CSV import endpoint: /api/clients/import</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-2 text-left">Название</th>
              <th className="p-2 text-left">Город</th>
              <th className="p-2 text-left">Сегмент</th>
              <th className="p-2 text-left">Статус</th>
              <th className="p-2 text-right">MRR</th>
            </tr>
          </thead>
          <tbody>
            {sampleClients.map((client) => (
              <tr key={client.id} className="border-t border-slate-800">
                <td className="p-2">{client.name}</td>
                <td className="p-2">{client.city}</td>
                <td className="p-2">{client.segment}</td>
                <td className="p-2">{client.status}</td>
                <td className="p-2 text-right">{client.revenue_mrr?.toLocaleString('ru-RU') ?? '—'} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
