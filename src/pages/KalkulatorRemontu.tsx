import { useState, useRef, useEffect } from 'react';
import { useInView } from '../hooks/useInView';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { Helmet } from 'react-helmet-async';
import {
  calculateRenovation,
  RoomInputs,
  DEFAULT_PRICES,
  MATERIAL_NAMES,
  MATERIAL_UNITS,
} from '../utils/renovationCalculator';
import { useRenovationPrices } from '../hooks/useRenovationPrices';
import { addToCalculatorWaitlist } from '../utils/calculatorSignup';

const DEFAULT_INPUTS: RoomInputs = {
  width: 4,
  length: 5,
  height: 2.5,
  useOsbFloor: false,
  useSuspendedCeiling: false,
  socketsCount: 4,
  switchesCount: 3,
  pricingTier: 'mid_range',
};

export default function KalkulatorRemontu() {
  const [inputs, setInputs] = useState<RoomInputs>(DEFAULT_INPUTS);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { prices, loading: pricesLoading } = useRenovationPrices(inputs.pricingTier);

  const result = calculateRenovation(inputs, pricesLoading ? DEFAULT_PRICES : prices);

  return (
    <>
      <Helmet>
        <title>Kalkulator Kosztów Remontu — Darmowy | CalcReno</title>
        <meta
          name="description"
          content="Oblicz koszt remontu mieszkania w 30 sekund. Darmowy kalkulator materiałów budowlanych — podłoga, ściany, sufit, elektryka. Bez rejestracji."
        />
        <meta property="og:title" content="Darmowy Kalkulator Kosztów Remontu" />
        <meta
          property="og:description"
          content="Sprawdź ile kosztuje remont Twojego mieszkania. Kalkulator materiałów z cenami rynkowymi."
        />
      </Helmet>

      <main className="min-h-screen bg-gray-950 text-white pb-24 lg:pb-0">
        <HeroSection />

        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <InputPanel inputs={inputs} onChange={setInputs} />
          <ResultsPanel
            result={result}
            emailSubmitted={emailSubmitted}
            onEmailSubmit={() => setEmailSubmitted(true)}
          />
        </div>

        <TrustSection />
        <AppTeaserSection />

        <StickyMobileBar result={result} onOpen={() => setSheetOpen(true)} />
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          result={result}
          emailSubmitted={emailSubmitted}
          onEmailSubmit={() => setEmailSubmitted(true)}
        />
      </main>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`text-center py-16 px-4 bg-gradient-to-b from-gray-900 to-gray-950 transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex justify-center mb-6">
        <img
          src="/calcreno-logo-full-transparent.webp"
          alt="CalcReno"
          className="h-16 md:h-20 object-contain opacity-90"
        />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
        Ile kosztuje remont?{' '}
        <span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
          Sprawdź w 30 sekund.
        </span>
      </h1>
      <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
        Darmowy kalkulator materiałów budowlanych — bez konta, bez spamu.
      </p>
    </section>
  );
}

// ── Dimension Input (number input + +/- buttons) ──────────────────────────────

function DimensionInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  unit = 'm',
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  const round = (n: number) => Math.round(n * 100) / 100;

  const decrement = () => onChange(Math.max(min, round(value - step)));
  const increment = () => onChange(Math.min(max, round(value + step)));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') return;
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, round(parsed))));
    }
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrement}
          aria-label={`Zmniejsz ${label}`}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600 text-xl font-light transition-colors flex-shrink-0 select-none"
        >
          −
        </button>
        <div className="relative flex-1">
          <input
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInput}
            className="w-full bg-gray-800 text-white text-center font-semibold text-lg rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            {unit}
          </span>
        </div>
        <button
          type="button"
          onClick={increment}
          aria-label={`Zwiększ ${label}`}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600 text-xl font-light transition-colors flex-shrink-0 select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── Counter Input (+/- for whole numbers) ─────────────────────────────────────

function CounterInput({
  label,
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Zmniejsz ${label}`}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600 text-xl font-light transition-colors flex-shrink-0 select-none"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={e => {
            const v = parseInt(e.target.value);
            if (!isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="flex-1 bg-gray-800 text-white text-center font-semibold text-lg rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Zwiększ ${label}`}
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600 text-xl font-light transition-colors flex-shrink-0 select-none"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3.5 hover:bg-gray-750 active:bg-gray-700 transition-colors text-left"
    >
      <div>
        <span className="text-sm text-white font-medium block">{label}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
      <div
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
          checked ? 'bg-teal-500' : 'bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}

// ── Input Panel ───────────────────────────────────────────────────────────────

function InputPanel({
  inputs,
  onChange,
}: {
  inputs: RoomInputs;
  onChange: (i: RoomInputs) => void;
}) {
  const [ref, inView] = useInView(0.05);
  const set = (key: keyof RoomInputs, value: RoomInputs[keyof RoomInputs]) =>
    onChange({ ...inputs, [key]: value });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`bg-gray-900 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl p-5 md:p-6 space-y-6 transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Pricing tier */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">Poziom cenowy</p>
        <div className="grid grid-cols-3 gap-2">
          {(['budget', 'mid_range', 'premium'] as const).map(tier => (
            <button
              key={tier}
              type="button"
              onClick={() => set('pricingTier', tier)}
              className={`py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                inputs.pricingTier === tier
                  ? 'bg-teal-500 text-white shadow-[0_0_16px_rgba(20,184,166,0.3)]'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300 active:scale-95'
              }`}
            >
              {tier === 'budget' ? 'Budżetowy' : tier === 'mid_range' ? 'Średni' : 'Premium'}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-widest text-gray-500">Wymiary</p>
        <DimensionInput label="Szerokość" value={inputs.width} onChange={v => set('width', v)} min={1} max={30} step={0.1} />
        <DimensionInput label="Długość" value={inputs.length} onChange={v => set('length', v)} min={1} max={30} step={0.1} />
        <DimensionInput label="Wysokość" value={inputs.height} onChange={v => set('height', v)} min={2} max={5} step={0.05} />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Opcje</p>
        <ToggleRow label="Podłoga OSB" description="Wyrównanie podłogi płytami OSB" checked={inputs.useOsbFloor} onChange={v => set('useOsbFloor', v)} />
        <ToggleRow label="Sufit podwieszany" description="Konstrukcja GK na suficie" checked={inputs.useSuspendedCeiling} onChange={v => set('useSuspendedCeiling', v)} />
      </div>

      {/* Electrical */}
      <div className="space-y-4">
        <p className="text-[11px] uppercase tracking-widest text-gray-500">Instalacja elektryczna</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CounterInput label="Gniazdka" value={inputs.socketsCount} onChange={v => set('socketsCount', v)} />
          <CounterInput label="Włączniki" value={inputs.switchesCount} onChange={v => set('switchesCount', v)} />
        </div>
      </div>
    </div>
  );
}

// ── Results Panel ─────────────────────────────────────────────────────────────

type Result = ReturnType<typeof calculateRenovation>;

function ResultsPanel({
  result,
  emailSubmitted,
  onEmailSubmit,
}: {
  result: Result;
  emailSubmitted: boolean;
  onEmailSubmit: () => void;
}) {
  const [ref, inView] = useInView(0.05);
  const [glowBurst, setGlowBurst] = useState(false);

  const animatedTotal = useAnimatedNumber(result.totalCost);
  const animatedPerSqm = useAnimatedNumber(result.costPerSqm);
  const animatedArea = useAnimatedNumber(result.floorArea);

  const prevTotal = useRef(result.totalCost);
  useEffect(() => {
    if (prevTotal.current !== result.totalCost) {
      prevTotal.current = result.totalCost;
      setGlowBurst(true);
      const t = setTimeout(() => setGlowBurst(false), 450);
      return () => clearTimeout(t);
    }
  }, [result.totalCost]);

  const fmt = (n: number) => new Intl.NumberFormat('pl-PL').format(Math.round(n));

  const categories = [
    { key: 'floor', label: 'Podłoga', color: 'bg-teal-500/80' },
    { key: 'walls', label: 'Ściany', color: 'bg-blue-500/80' },
    { key: 'ceiling', label: 'Sufit', color: 'bg-purple-500/80' },
    { key: 'electrical', label: 'Elektryka', color: 'bg-amber-500/80' },
  ] as const;

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`hidden lg:flex flex-col bg-gray-900 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl p-5 md:p-6 space-y-5 transition-all duration-500 ease-out delay-75 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Total cost card */}
      <div
        className={`text-center rounded-xl px-6 py-6 bg-gray-800/60 ${
          glowBurst ? 'animate-glow-burst' : 'animate-glow-pulse'
        }`}
      >
        <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
          Szacowany koszt materiałów
        </p>
        <p className="text-5xl md:text-6xl font-bold text-teal-400 tracking-tight tabular-nums">
          {fmt(animatedTotal)} zł
        </p>
        <p className="text-gray-600 text-sm mt-2 tabular-nums">
          {fmt(animatedPerSqm)} zł/m²&nbsp;&nbsp;·&nbsp;&nbsp;
          {animatedArea.toFixed(2)} m²
        </p>
      </div>

      {/* Category bars */}
      <div className="space-y-3.5">
        {categories.map(({ key, label, color }) => {
          const value = result.categories[key];
          const pct = result.totalCost > 0 ? (value / result.totalCost) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-500 text-[13px]">{label}</span>
                <span className="text-gray-300 font-medium tabular-nums">{fmt(value)} zł</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 ${color} rounded-full transition-[width] duration-[400ms] ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {emailSubmitted ? (
        <DetailedBreakdown result={result} />
      ) : (
        <EmailGate onSubmit={onEmailSubmit} />
      )}
    </div>
  );
}

// ── Email Gate ────────────────────────────────────────────────────────────────

function EmailGate({ onSubmit }: { onSubmit: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Podaj poprawny adres email');
      return;
    }
    setLoading(true);
    setError('');
    const res = await addToCalculatorWaitlist(email);
    setLoading(false);
    if (res.success) {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-17946979757/yGBiCICctvwbEK3b5O1C',
        });
        window.gtag('event', 'calculator_signup', { app: 'calcreno' });
      }
      onSubmit();
    } else {
      setError('Coś poszło nie tak. Spróbuj ponownie.');
    }
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-white">Wyślij ten kosztorys na swój email</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Dostaniesz gotowy kosztorys z listą materiałów i ilościami — zapisz go przed wyjściem.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          inputMode="email"
          placeholder="twoj@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Ładowanie...' : 'Wyślij kosztorys na email →'}
        </button>
      </form>
      <p className="text-xs text-gray-500">Bez spamu. Tylko raz, tylko to co zamówiłeś.</p>
    </div>
  );
}

// ── Detailed Breakdown ────────────────────────────────────────────────────────

function DetailedBreakdown({ result }: { result: Result }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-teal-400">Pełne zestawienie materiałów</p>
      <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-800 divide-y divide-gray-800">
        {Object.entries(result.materials).map(([key, qty]) => (
          <div key={key} className="flex justify-between items-center px-3 py-2.5 text-sm">
            <span className="text-gray-300">{MATERIAL_NAMES[key] || key}</span>
            <span className="text-white font-medium ml-4 whitespace-nowrap">
              {qty} {MATERIAL_UNITS[key] || 'szt'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bottom Sheet (mobile) ─────────────────────────────────────────────────────

function BottomSheet({
  open,
  onClose,
  result,
  emailSubmitted,
  onEmailSubmit,
}: {
  open: boolean;
  onClose: () => void;
  result: Result;
  emailSubmitted: boolean;
  onEmailSubmit: () => void;
}) {
  const fmt = (n: number) => new Intl.NumberFormat('pl-PL').format(Math.round(n));

  const categories = [
    { key: 'floor', label: 'Podłoga', color: 'bg-teal-500/80' },
    { key: 'walls', label: 'Ściany', color: 'bg-blue-500/80' },
    { key: 'ceiling', label: 'Sufit', color: 'bg-purple-500/80' },
    { key: 'electrical', label: 'Elektryka', color: 'bg-amber-500/80' },
  ] as const;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-white/5 rounded-t-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 pb-8 space-y-5" style={{ maxHeight: 'calc(85vh - 24px)' }}>
          {/* Total */}
          <div className="text-center pt-2 pb-4 border-b border-white/5">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1.5">
              Szacowany koszt materiałów
            </p>
            <p className="text-4xl font-bold text-teal-400 tracking-tight tabular-nums">
              {fmt(result.totalCost)} zł
            </p>
            <p className="text-gray-600 text-sm mt-1 tabular-nums">
              {fmt(result.costPerSqm)} zł/m²&nbsp;·&nbsp;{result.floorArea.toFixed(2)} m²
            </p>
          </div>

          {/* Category bars */}
          <div className="space-y-3.5">
            {categories.map(({ key, label, color }) => {
              const value = result.categories[key];
              const pct = result.totalCost > 0 ? (value / result.totalCost) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500 text-[13px]">{label}</span>
                    <span className="text-gray-300 font-medium tabular-nums">{fmt(value)} zł</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 ${color} rounded-full transition-[width] duration-[400ms] ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Email gate or breakdown */}
          {emailSubmitted ? (
            <DetailedBreakdown result={result} />
          ) : (
            <>
              <EmailGate onSubmit={onEmailSubmit} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Trust Section ─────────────────────────────────────────────────────────────

function TrustSection() {
  const [ref, inView] = useInView();
  const items = [
    { icon: CheckIcon, text: 'Obliczenia zgodne z cenami rynkowymi 2026' },
    { icon: LockIcon, text: 'Bez rejestracji — wyniki od razu' },
    { icon: BuildingIcon, text: 'Stworzone w Polsce dla polskiego rynku budowlanego' },
  ];
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`max-w-4xl mx-auto px-4 py-10 transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
            <Icon className="w-4 h-4 text-gray-700 flex-shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
    </svg>
  );
}

// ── App Teaser ────────────────────────────────────────────────────────────────

function AppTeaserSection() {
  const [ref, inView] = useInView();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`max-w-4xl mx-auto px-4 pb-16 transition-all duration-500 ease-out delay-100 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-gray-900 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Chcesz wyliczyć całe mieszkanie?
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            CalcReno pozwala dodać wiele pomieszczeń, narysować plan 2D i eksportować
            kosztorys do PDF. Już wkrótce na iOS i Android.
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <img
            src="/calcreno/screenshots/Cost summary.PNG"
            alt="CalcReno - podsumowanie kosztów remontu"
            className="w-36 md:w-44 rounded-2xl shadow-2xl border border-gray-800 md:rotate-1 transition-transform duration-300 hover:rotate-0"
          />
          <img
            src="/calcreno/screenshots/Material calculator.PNG"
            alt="CalcReno - kalkulator materiałów"
            className="w-36 md:w-44 rounded-2xl shadow-2xl border border-gray-800 md:-rotate-1 transition-transform duration-300 hover:rotate-0"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 items-center">
          <span className="text-gray-600 text-sm w-full text-center sm:w-auto">
            Dostępne wkrótce na:
          </span>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-white/5 rounded-xl text-sm text-gray-400">
            <AppleIcon className="w-4 h-4" />
            App Store
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-white/5 rounded-xl text-sm text-gray-400">
            <PlayIcon className="w-4 h-4" />
            Google Play
          </div>
        </div>
      </div>
    </section>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04l-.03.1zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
    </svg>
  );
}

// ── Sticky Mobile Bar ─────────────────────────────────────────────────────────

function StickyMobileBar({
  result,
  onOpen,
}: {
  result: Result;
  onOpen: () => void;
}) {
  const animatedTotal = useAnimatedNumber(result.totalCost);
  const fmt = (n: number) => new Intl.NumberFormat('pl-PL').format(Math.round(n));

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{ boxShadow: '0 -8px 32px rgba(20,184,166,0.12)' }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center justify-between px-5 py-4 backdrop-blur-xl bg-gray-900/85 border-t border-white/5"
      >
        <div className="text-left">
          <p className="text-teal-400 text-2xl font-bold tracking-tight tabular-nums leading-none">
            {fmt(animatedTotal)} zł
          </p>
          <p className="text-gray-500 text-xs mt-0.5 tabular-nums">
            {fmt(result.costPerSqm)} zł/m²&nbsp;·&nbsp;{result.floorArea.toFixed(2)} m²
          </p>
        </div>
        <div className="bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0">
          Zobacz swój kosztorys →
        </div>
      </button>
    </div>
  );
}
