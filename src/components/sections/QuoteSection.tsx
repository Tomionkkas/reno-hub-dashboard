const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';

export default function QuoteSection() {
  return (
    <section
      className="px-5 md:px-14 py-28 border-t border-b border-white/[0.06]"
      style={{ background: '#0A0B1E' }}
    >
      <div className="max-w-[1040px] mx-auto">
        <p className="eyebrow mb-10" style={{ fontFamily: 'ui-monospace, monospace' }}>
          § Fragment — z pola
        </p>

        <blockquote
          className="m-0 text-white font-normal"
          style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.2, letterSpacing: '-0.03em', maxWidth: 960 }}
        >
          „Odkładałam remont rok, bo nie wiedziałam, od czego zacząć.{' '}
          <em
            style={{
              fontStyle: 'italic',
              background: GRAD,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Zaczęłam od liczb
          </em>{' '}
          — i nagle wszystko się ułożyło."
        </blockquote>

        <div className="flex items-center gap-4 mt-10">
          <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: GRAD }} />
          <div>
            <p className="text-[15px] font-medium text-white m-0">Anna K.</p>
            <p className="text-[13px] text-[#6B7280] m-0">Mieszkanie 62 m² · Warszawa, Praga</p>
          </div>
        </div>
      </div>
    </section>
  );
}
