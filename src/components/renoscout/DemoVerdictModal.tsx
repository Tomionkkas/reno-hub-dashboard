// src/components/renoscout/DemoVerdictModal.tsx
import { useEffect } from 'react';
import { VERDICT } from './demoTheme';
import { DemoScoreGauge } from './DemoScoreGauge';
import { formatPln, roomsLabel, type DemoListing } from '@/data/renoscoutDemoListings';

interface Props {
  listing: DemoListing;
  onClose: () => void;
}

export function DemoVerdictModal({ listing, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const v = VERDICT[listing.verdict];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#12142b] text-white shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xl leading-none flex items-center justify-center"
          aria-label="Zamknij"
        >
          ×
        </button>

        {/* Image header */}
        <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-3xl">
          <img src={listing.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12142b] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4">
            <div className="text-2xl font-bold">{formatPln(listing.price)}</div>
            <div className="text-xs text-white/70">
              {Math.round(listing.price / listing.sizeSqm).toLocaleString('pl-PL')} zł/m² · {listing.sizeSqm} m² · {roomsLabel(listing.rooms)}
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Gauge + verdict */}
          <div className="flex items-center gap-4">
            <DemoScoreGauge score={listing.score} verdict={listing.verdict} />
            <div className="space-y-2">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                style={{ background: `${v.color}22`, color: v.color }}
              >
                {v.label}
              </span>
              <p className="text-sm text-white/70">Pewność {Math.round(listing.confidence * 100)}%</p>
              <p className="text-sm text-white/70">Najlepiej: <span className="text-white font-medium">{listing.lean}</span></p>
            </div>
          </div>

          {/* Market / yield row */}
          <div className="grid grid-cols-3 gap-2">
            <Stat
              value={`${listing.vsMarketPct > 0 ? '+' : ''}${listing.vsMarketPct}%`}
              sub={listing.vsMarketPct < 0 ? 'poniżej rynku' : 'powyżej rynku'}
              good={listing.vsMarketPct < 0}
            />
            <Stat value={`${listing.grossYieldPct}%`} sub="yield brutto" />
            <Stat value={String(listing.compsCount)} sub="porównań" />
          </div>

          {/* Reasoning */}
          <p className="text-sm text-white/80 leading-relaxed">{listing.reasoning}</p>

          {/* Advantages / risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Zalety</p>
              <ul className="space-y-1.5">
                {listing.advantages.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/80">
                    <span className="text-emerald-400">✓</span>{a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wide">Ryzyka</p>
              <ul className="space-y-1.5">
                {listing.risks.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/80">
                    <span className="text-red-400">✕</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, sub, good }: { value: string; sub: string; good?: boolean }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-2 py-3 text-center">
      <div className={`text-lg font-bold ${good ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
      <div className="text-[10px] text-white/50 mt-0.5">{sub}</div>
    </div>
  );
}
