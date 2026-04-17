import { supabase } from '@/integrations/supabase/client';
import type { RoomKey } from './templateGenerator';

export async function templateSignup(
  email: string,
  selectedRooms: RoomKey[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('template-signup', {
      body: { email: email.trim().toLowerCase(), selectedRooms },
    });
    if (error) return { success: false, error: error.message };
    if (data?.success) return { success: true };
    return { success: false, error: data?.error ?? 'Unknown error' };
  } catch (err) {
    console.error('[templateSignup] error:', err);
    return { success: false, error: 'Network error' };
  }
}
