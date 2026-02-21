import type { ClientPoint } from './types';

export const sampleClients: ClientPoint[] = [
  { id: '1', name: 'ООО Волга Трейд', city: 'Нижний Новгород', segment: 'dealer', status: 'active', lat: 56.3269, lon: 44.0059, revenue_mrr: 240000 },
  { id: '2', name: 'Сибирь Дистрибьюшн', city: 'Новосибирск', segment: 'distributor', status: 'active', lat: 55.0084, lon: 82.9357, revenue_mrr: 310000 },
  { id: '3', name: 'Урал Партнер', city: 'Екатеринбург', segment: 'partner', status: 'prospect', lat: 56.8389, lon: 60.6057, revenue_mrr: null }
];
