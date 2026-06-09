// src/components/renoscout/RenoScoutDemo.tsx
import { useMemo, useState } from 'react';
import { DEMO_CITIES, DEMO_LISTINGS, type DemoListing } from '@/data/renoscoutDemoListings';
import { DemoPropertyCard } from './DemoPropertyCard';
import { DemoVerdictModal } from './DemoVerdictModal';
import { track } from '@/utils/funnelTracking';

type Phase = 'idle' | 'searching' | 'results';

export function RenoScoutDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [city, setCity] = useState<string>('Kraków');
  const [budget, setBudget] = useState<number>(600000);
  const [active, setActive] = useState<DemoListing | null>(null);
  const [completed, setCompleted] = useState(false);

  const results = useMemo(() => {
    const matched = DEMO_LISTINGS
      .filter((l) => l.city === city && l.price <= budget * 1.15)
      .sort((a, b) => b.score - a.score);
    if (matched.length >= 3) return matched;
    // Always show a satisfying grid: top listings by score regardless of filter.
    return [...DEMO_LISTINGS].sort((a, b) => b.score - a.score).slice(0, 6);
  }, [city, budget]);

  function runSearch() {
    track('demo_start', 'renoscout_page', { city, budget });
    setPhase('searching');
    window.setTimeout(() => setPhase('results'), 1100);
  }

  function analyze(listing: DemoListing) {
    setActive(listing);
    if (!completed) {
      track('demo_complete', 'renoscout_page', { listingId: listing.id });
      setCompleted(true);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#0c0e22]/80 backdrop-blur p-4 sm:p-5 shadow-2xl">
      {/* Fake app chrome */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <span className="ml-3 text-xs text-white/40">renoscout.app — demo</span>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-white/30"
          aria-label="Miasto"
        >
          {DEMO_CITIES.map((c) => <option key={c} value={c} className="bg-[#12142b]">{c}</option>)}
        </select>
        <select
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 outline-none focus:border-white/30"
          aria-label="Budżet"
        >
          <option value={400000} className="bg-[#12142b]">do 400 tys. zł</option>
          <option value={600000} className="bg-[#12142b]">do 600 tys. zł</option>
          <option value={800000} className="bg-[#12142b]">do 800 tys. zł</option>
          <option value={1200000} className="bg-[#12142b]">do 1,2 mln zł</option>
        </select>
        <button
          onClick={runSearch}
          disabled={phase === 'searching'}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #FF6B35 100%)' }}
        >
          {phase === 'searching' ? 'Szukam…' : 'Szukaj okazji'}
        </button>
      </div>

      {/* Body */}
      {phase === 'idle' && (
        <p className="text-center text-sm text-white/40 py-10">
          Wybierz miasto i budżet, a AI pokaże okazje ze scoringiem inwestycyjnym.
        </p>
      )}

      {phase === 'searching' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse">
              <div className="aspect-video bg-white/10" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
                <div className="h-8 bg-white/10 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === 'results' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {results.map((l, i) => (
            <div
              key={l.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${i * 90}ms`, animationFillMode: 'backwards' }}
            >
              <DemoPropertyCard listing={l} onAnalyze={analyze} />
            </div>
          ))}
        </div>
      )}

      {active && <DemoVerdictModal listing={active} onClose={() => setActive(null)} />}
    </div>
  );
}
