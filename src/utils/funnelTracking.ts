// src/utils/funnelTracking.ts
import { supabase } from '@/integrations/supabase/client';

export type FunnelEvent =
  | 'promo_view'
  | 'promo_click'
  | 'demo_start'
  | 'demo_complete'
  | 'signup_view'
  | 'signup_complete';

export type FunnelSource =
  | 'calc_card'
  | 'calc_toast'
  | 'hub_appswitcher'
  | 'renoscout_page'
  | 'email';

const SESSION_KEY = 'renoscout_session_id';

/** Stable anonymous id for stitching a visitor's funnel steps together. */
export function getFunnelSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode / SSR) — use a throwaway id.
    return '00000000-0000-0000-0000-000000000000';
  }
}

/**
 * Fire-and-forget funnel event. Never throws, never blocks the UI.
 * No-ops silently if the edge function is not deployed yet (Plan 2).
 *
 * `userId` is forwarded as a top-level column (not metadata) so a
 * `signup_complete` event can be tied to the resulting profile for
 * true-conversion attribution. Pass null/omit for anonymous events.
 */
export function track(
  eventType: FunnelEvent,
  source: FunnelSource,
  metadata: Record<string, unknown> = {},
  userId: string | null = null,
): void {
  try {
    const session_id = getFunnelSessionId();
    // Intentionally not awaited — analytics must not block rendering.
    void supabase.functions
      .invoke('renoscout-funnel-event', {
        body: { event_type: eventType, source, session_id, user_id: userId, metadata },
      })
      .catch(() => {
        /* swallow — function may not be deployed yet (Plan 2) */
      });
  } catch {
    /* never let tracking break the page */
  }
}
