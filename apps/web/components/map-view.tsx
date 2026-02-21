'use client';

import { useEffect, useMemo, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ClientPoint } from '@/lib/types';

type MapViewProps = {
  clients: ClientPoint[];
};

export function MapView({ clients }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);

  const geojson = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: clients.map((client) => ({
        type: 'Feature' as const,
        properties: {
          id: client.id,
          name: client.name,
          city: client.city,
          segment: client.segment,
          status: client.status,
          revenue_mrr: client.revenue_mrr
        },
        geometry: { type: 'Point' as const, coordinates: [client.lon, client.lat] }
      }))
    }),
    [clients]
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      },
      center: [90, 61],
      zoom: 2.6
    });

    map.on('load', () => {
      map.addSource('clients', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterRadius: 50
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'clients',
        filter: ['has', 'point_count'],
        paint: { 'circle-color': '#0ea5e9', 'circle-radius': 16 }
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'clients',
        filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },
        paint: { 'text-color': '#ffffff' }
      });

      map.addLayer({
        id: 'client-points',
        type: 'circle',
        source: 'clients',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'segment'],
            'dealer',
            '#22c55e',
            'distributor',
            '#eab308',
            'partner',
            '#a855f7',
            '#38bdf8'
          ],
          'circle-radius': 6,
          'circle-stroke-color': '#0f172a',
          'circle-stroke-width': 1
        }
      });

      map.on('click', 'client-points', (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== 'Point') return;

        const props = feature.properties ?? {};
        const coordinates = [...feature.geometry.coordinates] as [number, number];

        new maplibregl.Popup({ closeButton: true })
          .setLngLat(coordinates)
          .setHTML(
            `<div style="font-size:12px"><strong>${props.name ?? ''}</strong><br/>${props.city ?? ''}<br/>${props.segment ?? ''} · ${props.status ?? ''}<br/>MRR: ${props.revenue_mrr ?? '—'}</div>`
          )
          .addTo(map);
      });

      map.on('mouseenter', 'client-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'client-points', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [geojson]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.getSource('clients')) return;
    const source = map.getSource('clients') as maplibregl.GeoJSONSource;
    source.setData(geojson);
  }, [geojson]);

  return <div className="h-[70vh] w-full rounded-lg border border-slate-700" ref={mapRef} />;
}
