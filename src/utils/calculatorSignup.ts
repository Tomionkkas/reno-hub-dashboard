import { supabase } from '@/integrations/supabase/client';

export async function addToCalculatorWaitlist(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('calculator-signup', {
      body: { email: email.trim().toLowerCase() },
    });

    if (error) return { success: false, error: error.message };
    if (data?.success) return { success: true };

    return { success: false, error: data?.error ?? 'Unknown error' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
