import { supabase } from '@/integrations/supabase/client';
import type { CalculationResult, RoomInputs } from './renovationCalculator';

export async function addToCalculatorWaitlist(
  email: string,
  result: CalculationResult,
  inputs: RoomInputs
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('calculator-signup', {
      body: {
        email: email.trim().toLowerCase(),
        result,
        inputs,
      },
    });

    if (error) return { success: false, error: error.message };
    if (data?.success) return { success: true };

    return { success: false, error: data?.error ?? 'Unknown error' };
  } catch {
    return { success: false, error: 'Network error' };
  }
}
