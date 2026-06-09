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

// Public project config (same values as src/integrations/supabase/client.ts — both
// are shipped to the browser anyway). Duplicated here so the wrapper can issue a
// plain fetch and sidestep supabase.functions.invoke (see note below).
const SUPABASE_URL = 'https://kralcmyhjvoiywcpntkg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYWxjbXloanZvaXl3Y3BudGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzM3OTAsImV4cCI6MjA3MTQ0OTc5MH0.10JbU5SR2bwJyGorKifCVqCqQcnbBR4xup7NnYxz3AE';
const SESSION_STORAGE_KEY = 'sb-kralcmyhjvoiywcpntkg-auth-token';

const empty = (launchDate: string | null, error: string): FunnelStats => ({
  success: false, byEvent: {}, bySource: {}, byDay: {}, cohortCount: 0,
  totalProfiles: 0, launch_date: launchDate, error,
});

/**
 * Resolve the current access token WITHOUT risking the supabase-js auth lock
 * deadlocking forever: race getSession() against a short timeout, then fall back
 * to reading the persisted session straight from localStorage (lock-free).
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const viaSession = await Promise.race([
      supabase.auth.getSession().then((r) => r.data.session?.access_token ?? null),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    if (viaSession) return viaSession;
  } catch {
    /* fall through to storage */
  }
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) return (JSON.parse(raw)?.access_token as string) ?? null;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Calls the admin-gated stats function via a plain fetch.
 *
 * We deliberately do NOT use supabase.functions.invoke here: with a live session
 * (and especially multiple app tabs open) invoke/getSession can deadlock on the
 * Web Locks auth lock and hang the dashboard on "Ładowanie…" indefinitely. A raw
 * fetch with an explicit token and a hard timeout is robust and can never hang.
 */
export async function fetchFunnelStats(launchDate: string | null): Promise<FunnelStats> {
  const token = await getAccessToken();
  if (!token) return empty(launchDate, 'no-session');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/renoscout-funnel-stats`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ launch_date: launchDate }),
      signal: controller.signal,
    });
    if (!res.ok) {
      // 403 (not an admin) and any other non-2xx surface as access denied / unavailable.
      return empty(launchDate, `http-${res.status}`);
    }
    return (await res.json()) as FunnelStats;
  } catch (err) {
    const msg = (err as Error)?.name === 'AbortError' ? 'timeout' : ((err as Error)?.message ?? 'error');
    return empty(launchDate, msg);
  } finally {
    clearTimeout(timeout);
  }
}
