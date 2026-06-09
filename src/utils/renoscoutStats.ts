// src/utils/renoscoutStats.ts
import { supabase } from '@/integrations/supabase/client';

export interface FunnelStats {
  success: boolean;
  byEvent: Record<string, number>;
  bySource: Record<string, Record<string, number>>;
  byDay: Record<string, number>;
  cohortCount: number;
  totalProfiles: number;
  launch_date: string | null;
  error?: string;
}

/** Calls the admin-gated stats function. The user's JWT is sent automatically by supabase-js. */
export async function fetchFunnelStats(launchDate: string | null): Promise<FunnelStats> {
  const { data, error } = await supabase.functions.invoke('renoscout-funnel-stats', {
    body: { launch_date: launchDate },
  });
  if (error) {
    // 403 etc. surface as FunctionsHttpError; treat as access denied / unavailable.
    return { success: false, byEvent: {}, bySource: {}, byDay: {}, cohortCount: 0, totalProfiles: 0, launch_date: launchDate, error: error.message };
  }
  return data as FunnelStats;
}
