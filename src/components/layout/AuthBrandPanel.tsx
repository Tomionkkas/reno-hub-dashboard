const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';

const APP_CHIPS = [
  { name: 'CalcReno', color: '#00D4FF' },
  { name: 'RenoTimeline', color: '#00D4AA' },
  { name: 'RenoScout', color: '#FF0080' },
];

export default function AuthBrandPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden"
      style={{ padding: '48px 56px', borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0A0B1E' }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute" style={{
        top: -120, left: -80, width: 480, height: 480,
        background: 'radial-gradient(circle, rgba(127,103,255,0.18) 0%, transparent 60%)',
        filter: 'blur(60px)',
      }} />
      <div className="pointer-events-none absolute" style={{
        bottom: -120, right: -80, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 60%)',
        filter: 'blur(60px)',
      }} />

      {/* Top: logo */}
      <div className="relative flex items-center gap-3">
        <img src="/Renohub-logo.png" alt="RenoHub" className="h-8 w-auto" />
        <span className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.02em' }}>RenoHub</span>
      </div>

      {/* Middle: headline + chips */}
      <div className="relative" style={{ maxWidth: 480 }}>
        <p className="eyebrow mb-7" style={{ fontFamily: 'ui-monospace, monospace' }}>
          ⟶ Platforma remontowa
        </p>
        <h2
          className="text-white font-bold m-0"
          style={{ fontSize: 64, lineHeight: 0.95, letterSpacing: '-0.04em' }}
        >
          Remont bez
          <br />
          <em style={{
            fontStyle: 'italic', fontWeight: 400,
            background: GRAD, WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            chaosu.
          </em>
        </h2>
        <p className="text-[#B8BCC8] mt-7 mb-0" style={{ fontSize: 15, lineHeight: 1.6 }}>
          Trzy aplikacje, jedno konto. Kalkulator, harmonogram i AI scout do mieszkań — w jednym miejscu.
        </p>

        {/* App chips */}
        <div className="flex flex-wrap gap-2.5 mt-8">
          {APP_CHIPS.map(a => (
            <div
              key={a.name}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"
              style={{ fontSize: 12, color: '#B8BCC8', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
              {a.name}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: quote */}
      <div className="relative pt-7" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <blockquote className="m-0 text-[#E5E7EB]" style={{ fontSize: 16, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
          „Odkładałam remont rok. Zaczęłam od liczb — i nagle wszystko się ułożyło."
        </blockquote>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-7 h-7 rounded-full flex-shrink-0" style={{ background: GRAD }} />
          <div>
            <p className="m-0 text-[13px] font-medium text-white">Anna K.</p>
            <p className="m-0 text-[11px] text-[#6B7280]"
               style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}>
              WARSZAWA · 62 m²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
