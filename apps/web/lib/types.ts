export type Segment = 'dealer' | 'distributor' | 'retail' | 'partner';

export interface ClientPoint {
  id: string;
  name: string;
  city: string;
  segment: Segment;
  status: string;
  lat: number;
  lon: number;
  revenue_mrr: number | null;
}
