import Link from 'next/link';
import type { ReactNode } from 'react';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/clients', label: 'Clients' },
  { href: '/dashboard/territories', label: 'Territories' },
  { href: '/dashboard/admin', label: 'Admin' }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sky-400">GG Territory Map</p>
            <h1 className="text-lg font-semibold">Sales Coverage Control Center</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-slate-200 transition hover:border-sky-500 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </div>
  );
}
