// src/components/renoscout/DemoPropertyCard.tsx
import { VERDICT } from './demoTheme';
import { formatPln, roomsLabel, type DemoListing, type DemoSource } from '@/data/renoscoutDemoListings';

const SOURCE_LABEL: Record<DemoSource, string> = {
  otodom: 'Otodom',
  olx: 'OLX',
  'nieruchomosci-online': 'N-Online',
};

interface Props {
  listing: DemoListing;
  onAnalyze: (listing: DemoListing) => void;
}

export function DemoPropertyCard({ listing, onAnalyze }: Props) {
  const v = VERDICT[listing.verdict];
  return (
    <div className="rounded-2xl overflow-hidden bg-[#12142b] border border-white/10 flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <img src={listing.image} alt="" className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white/90">
          {SOURCE_LABEL[listing.source]}
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="text-lg font-bold text-white">{formatPln(listing.price)}</div>
          <div className="text-[11px] text-white/70">
            {Math.round(listing.price / listing.sizeSqm).toLocaleString('pl-PL')} zł/m²
          </div>
        </div>
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[11px] font-bold"
          style={{ background: `${v.color}22`, color: v.color }}
        >
          {listing.score.toFixed(1)} · {v.label}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-semibold text-white line-clamp-2">{listing.title}</h3>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/70">{listing.sizeSqm} m²</span>
          <span className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-white/70">{roomsLabel(listing.rooms)}</span>
        </div>
        <button
          onClick={() => onAnalyze(listing)}
          className="mt-auto w-full rounded-xl py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #FF6B35 100%)' }}
        >
          Analizuj
        </button>
      </div>
    </div>
  );
}
