import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  getCostRange, getExplanation,
  type RoomType, type SizeRange, type Standard, type Condition, type CostRange,
} from '../utils/quizLookupTable';
import { quizSignup, type QuizAnswers } from '../utils/quizSignup';

type Timing = 'month' | 'half_year' | 'year_plus' | 'checking';

const STEPS = [
  {
    key: 'room' as const,
    question: 'Co remontujesz?',
    options: [
      { value: 'lazienka' as RoomType, label: 'Łazienka' },
      { value: 'kuchnia'  as RoomType, label: 'Kuchnia' },
      { value: 'salon'    as RoomType, label: 'Salon' },
      { value: 'cale'     as RoomType, label: 'Całe mieszkanie' },
      { value: 'inne'     as RoomType, label: 'Inne' },
    ],
  },
  {
    key: 'size' as const,
    question: 'Jaki metraż?',
    options: [
      { value: 'small'  as SizeRange, label: 'Do 10m²' },
      { value: 'medium' as SizeRange, label: '10–20m²' },
      { value: 'large'  as SizeRange, label: '20–40m²' },
      { value: 'xlarge' as SizeRange, label: 'Powyżej 40m²' },
    ],
  },
  {
    key: 'standard' as const,
    question: 'Jaki standard?',
    options: [
      { value: 'ekonomiczny' as Standard, label: 'Ekonomiczny' },
      { value: 'sredni'      as Standard, label: 'Średni' },
      { value: 'premium'     as Standard, label: 'Premium' },
    ],
  },
  {
    key: 'condition' as const,
    question: 'Stan obecny?',
    options: [
      { value: 'deweloperski' as Condition, label: 'Stan deweloperski' },
      { value: 'generalny'    as Condition, label: 'Remont generalny' },
      { value: 'odswiezenie'  as Condition, label: 'Odświeżenie' },
      { value: 'niewiem'      as Condition, label: 'Nie wiem' },
    ],
  },
  {
    key: 'timing' as const,
    question: 'Kiedy planujesz?',
    options: [
      { value: 'month'     as Timing, label: 'W ciągu miesiąca' },
      { value: 'half_year' as Timing, label: '3–6 miesięcy' },
      { value: 'year_plus' as Timing, label: 'Za rok+' },
      { value: 'checking'  as Timing, label: 'Tylko sprawdzam' },
    ],
  },
] as const;

type StepKey = typeof STEPS[number]['key'];
type Answers = Partial<Record<StepKey, string>>;

type Phase = 'quiz' | 'result' | 'done';

function fmt(n: number) {
  return new Intl.NumberFormat('pl-PL').format(Math.round(n));
}

export default function QuizRemontowy() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>('quiz');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [costRange, setCostRange] = useState<CostRange | null>(null);

  const currentStep = STEPS[step];

  const handleOption = (value: string) => {
    const next = { ...answers, [currentStep.key]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      const range = getCostRange(
        next.room as RoomType,
        next.size as SizeRange,
        next.standard as Standard,
        next.condition as Condition
      );
      setCostRange(range);
      setPhase('result');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setEmailError('Podaj poprawny adres email'); return; }
    setEmailError('');
    setPhase('done');
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: 'AW-17946979757/yGBiCICctvwbEK3b5O1C' });
    }
    if (costRange) {
      quizSignup(email, answers as QuizAnswers, costRange).catch(console.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Ile kosztuje Twój remont? Sprawdź w 2 minuty | RenoHub</title>
        <meta
          name="description"
          content="5 pytań, spersonalizowany wynik, darmowy kosztorys na email. Sprawdź ile kosztuje remont Twojego mieszkania."
        />
      </Helmet>

      <main className="min-h-screen bg-gray-950 text-white pb-24">
        <div className="max-w-xl mx-auto px-4 pt-16">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Ile kosztuje Twój remont?
            </h1>
            <p className="text-gray-400">
              5 pytań, spersonalizowany wynik, darmowy kosztorys na email
            </p>
          </div>

          {/* Quiz phase */}
          {phase === 'quiz' && (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-5">
              {/* Progress bar */}
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? 'bg-teal-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[11px] uppercase tracking-widest text-gray-500">
                Pytanie {step + 1} z {STEPS.length}
              </p>
              <p className="text-lg font-semibold text-white">{currentStep.question}</p>

              <div className="space-y-2">
                {currentStep.options.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleOption(opt.value)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-gray-200 text-sm font-medium hover:border-teal-500 hover:bg-teal-500/10 hover:text-teal-300 transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ← Wstecz
                </button>
              )}
            </div>
          )}

          {/* Result phase — cost range + email gate */}
          {phase === 'result' && costRange && (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="text-center space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  Twój remont to prawdopodobnie
                </p>
                <p className="text-4xl font-bold text-teal-400 tracking-tight">
                  {fmt(costRange.min)} – {fmt(costRange.max)} zł
                </p>
                <p className="text-xs text-gray-500">materiały · bez robocizny · stawki 2026</p>
              </div>

              <p className="text-sm text-gray-400">
                {getExplanation(
                  answers.room as RoomType,
                  answers.size as SizeRange,
                  answers.standard as Standard
                )}
              </p>

              <div className="border-t border-white/5 pt-5 space-y-3">
                <p className="text-sm font-semibold text-white">
                  Pobierz szczegółowy kosztorys z listą materiałów
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
                  <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    Pobierz kosztorys na email →
                  </button>
                  <p className="text-xs text-gray-500">
                    Wysyłając, zgadzasz się na otrzymywanie informacji o CalcReno.{' '}
                    <a href="/privacy-policy" className="underline hover:text-gray-300">
                      Polityka prywatności
                    </a>
                  </p>
                </form>
              </div>
            </div>
          )}

          {/* Done phase — full breakdown on screen */}
          {phase === 'done' && costRange && (
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
                  <span className="text-teal-400 text-xl">✓</span>
                </div>
                <p className="font-semibold text-white text-lg">Kosztorys wysłany!</p>
                <p className="text-sm text-gray-400">Sprawdź skrzynkę — pełny kosztorys jest już w drodze.</p>
              </div>

              <div className="border border-gray-800 rounded-xl p-4 space-y-3">
                <p className="text-[11px] uppercase tracking-widest text-gray-500">Twój wynik</p>
                <p className="text-3xl font-bold text-teal-400">
                  {fmt(costRange.min)} – {fmt(costRange.max)} zł
                </p>
                <p className="text-xs text-gray-500">materiały · bez robocizny</p>
              </div>

              <div className="space-y-2">
                {Object.entries(answers).map(([key, value]) => {
                  const stepDef = STEPS.find(s => s.key === key);
                  const optDef = stepDef?.options.find(o => o.value === value);
                  if (!stepDef || !optDef) return null;
                  return (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{stepDef.question}</span>
                      <span className="text-gray-300 font-medium">{optDef.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href="/kalkulator-remontu"
                  className="w-full text-center bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  Oblicz dokładny kosztorys →
                </a>
                <button
                  type="button"
                  onClick={() => { setStep(0); setAnswers({}); setPhase('quiz'); setEmail(''); }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Sprawdź dla innego pomieszczenia
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
