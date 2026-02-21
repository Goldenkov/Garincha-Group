const adminModules = [
  { title: 'Users & Roles', note: 'owner/admin/manager/viewer с org-изоляцией' },
  { title: 'Billing & Feature Flags', note: 'trial/pro/enterprise + module toggles' },
  { title: 'Audit Log', note: 'изменения клиентов и территорий через DB triggers' }
];

export default function AdminPage() {
  return (
    <main className="space-y-4 p-4 md:p-8">
      <div>
        <h2 className="text-2xl font-semibold">Admin</h2>
        <p className="text-slate-400">Операционный контур multi-tenant SaaS и контроль доступа.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        {adminModules.map((module) => (
          <article key={module.title} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
            <h3 className="font-medium">{module.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{module.note}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
