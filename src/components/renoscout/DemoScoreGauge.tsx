// src/components/renoscout/DemoScoreGauge.tsx
import { VERDICT, type VerdictKind } from './demoTheme';

interface Props {
  score: number;       // 0–10
  verdict: VerdictKind;
}

export function DemoScoreGauge({ score, verdict }: Props) {
  const color = VERDICT[verdict].color;
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));
  const ring = `conic-gradient(${color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`;

  return (
    <div className="relative w-28 h-28 shrink-0" aria-label={`Wynik ${score} na 10`}>
      <div className="w-28 h-28 rounded-full" style={{ background: ring }} />
      <div className="absolute inset-[10px] rounded-full bg-[#12142b] flex flex-col items-center justify-center">
        <span className="text-3xl font-bold leading-none" style={{ color }}>
          {score.toFixed(1)}
        </span>
        <span className="mt-1 text-[10px] font-semibold tracking-[2px] text-white/50">WYNIK</span>
      </div>
    </div>
  );
}
