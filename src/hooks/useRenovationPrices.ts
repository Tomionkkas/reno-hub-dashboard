import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MaterialPrices, DEFAULT_PRICES, PricingTier } from '../utils/renovationCalculator';

// Same Supabase instance as CalcReno pricing
const pricingClient = createClient(
  'https://ylnwebtgfngnvmmkyuya.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbndlYnRnZm5nbnZtbWt5dXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjA2OTMsImV4cCI6MjA3OTczNjY5M30.VNLZcnVgyFKdBTRkEoTyuUu_N8loHJ3Pq2Vfvxe3iC4',
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Maps DB material codes to the keys used in renovationCalculator.ts
const MATERIAL_MAPPING: Record<string, keyof MaterialPrices> = {
  floor_panels: 'floorPanels',
  underlayment: 'underlayment',
  paint: 'paint',
  drywall: 'drywall',
  cw_profile: 'cwProfiles',
  uw_profile: 'uwProfiles',
  mineral_wool: 'mineralWool',
  tn_screws: 'tnScrews',
  wall_plaster: 'wallPlaster',
  finishing_plaster: 'finishingPlaster',
  osb: 'osb',
  osb_screws: 'osbScrews',
  baseboard: 'baseboards',
  baseboard_ends: 'baseboardEnds',
  cd_profile: 'cdProfiles',
  ud_profile: 'udProfiles',
  hanger: 'hangers',
  gypsum: 'gypsum',
  plaster: 'plaster',
  socket: 'sockets',
  switch: 'switches',
  'cable_1.5': 'cable15',
  'cable_2.5': 'cable25',
  junction_box: 'junctionBox',
};

export function useRenovationPrices(tier: PricingTier) {
  const [prices, setPrices] = useState<MaterialPrices>(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      setLoading(true);
      try {
        const { data, error } = await pricingClient
          .from('material_prices')
          .select(`
            budget_price,
            mid_range_price,
            premium_price,
            materials!inner (
              code
            )
          `);

        if (error || !data || cancelled) return;

        const priceKey =
          tier === 'budget'
            ? 'budget_price'
            : tier === 'mid_range'
            ? 'mid_range_price'
            : 'premium_price';

        const fetched: Partial<MaterialPrices> = {};
        data.forEach((row: any) => {
          const code = row.materials?.code;
          if (!code) return;
          let price = row[priceKey];
          if (price == null) {
            price = row.mid_range_price ?? row.budget_price ?? row.premium_price;
          }
          if (price != null) {
            const appKey = MATERIAL_MAPPING[code];
            if (appKey) fetched[appKey] = Number(price);
          }
        });

        if (!cancelled) {
          setPrices(prev => ({ ...prev, ...fetched }));
        }
      } catch {
        // Silently fall back to DEFAULT_PRICES
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrices();
    return () => {
      cancelled = true;
    };
  }, [tier]);

  return { prices, loading };
}
