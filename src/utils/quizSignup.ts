import { supabase } from '@/integrations/supabase/client';
import type { RoomType, SizeRange, Standard, Condition, CostRange } from './quizLookupTable';

export interface QuizAnswers {
  room: RoomType;
  size: SizeRange;
  standard: Standard;
  condition: Condition;
  timing: 'month' | 'half_year' | 'year_plus' | 'checking';
}

export async function quizSignup(
  email: string,
  answers: QuizAnswers,
  costRange: CostRange
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('quiz-signup', {
      body: { email: email.trim().toLowerCase(), answers, costRange },
    });
    if (error) return { success: false, error: error.message };
    if (data?.success) return { success: true };
    return { success: false, error: data?.error ?? 'Unknown error' };
  } catch (err) {
    console.error('[quizSignup] error:', err);
    return { success: false, error: 'Network error' };
  }
}
