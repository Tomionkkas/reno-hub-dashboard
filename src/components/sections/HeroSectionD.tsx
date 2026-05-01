import { useState } from 'react';
import { NewsletterModal } from '@/components/ui/newsletter-modal';

const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';

export default function HeroSectionD() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <section
      className="relative px-5 md:px-14 pt-32 pb-28 border-b border-white/[0.06] overflow-hidden"
      style={{ background: '#0A0B1E' }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '15%', right: '-10%', width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(127,103,255,0.18) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          top: '50%', left: '-15%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative max-w-[1168px] mx-auto">
        {/* Eyebrow */}
        <p className="eyebrow mb-10" style={{ fontFamily: 'ui-monospace, monospace' }}>
          ⟶ Remont · Planowanie · Budżet · Ludzie
        </p>

        {/* Headline */}
        <h1
          className="font-bold text-white m-0"
          style={{
            fontSize: 'clamp(64px, 11vw, 140px)',
            lineHeight: 0.9,
            letterSpacing: '-0.055em',
            maxWidth: 1100,
          }}
        >
          Remont bez
          <br />
          <em
            className="not-italic"
            style={{
              fontStyle: 'italic',
              fontWeight: 400,
              background: GRAD,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            chaosu.
          </em>
        </h1>

        {/* Two-column lower block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20 items-end">
          {/* Left: description */}
          <div>
            <p
              className="text-[#B8BCC8] m-0"
              style={{ fontSize: 20, lineHeight: 1.5, maxWidth: 480 }}
            >
              RenoHub to rodzina aplikacji, które pomagają zaplanować remont — od pierwszego
              kosztorysu, przez harmonogram, po decyzje inwestycyjne. Jedno konto. Trzy
              narzędzia. Spokój.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="lg:text-right">
            <p
              className="eyebrow mb-4"
              style={{ fontFamily: 'ui-monospace, monospace' }}
            >
              Dostępne wiosną 2026
            </p>
            <button
              onClick={() => setNewsletterOpen(true)}
              className="bg-white text-[#0A0B1E] font-semibold rounded-full px-8 py-5 text-[15px] hover:bg-white/90 transition-colors cursor-pointer border-0"
            >
              Dołącz do listy oczekujących →
            </button>
            <div className="flex items-center gap-2 mt-4 lg:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] flex-shrink-0" />
              <span className="text-[13px] text-[#6B7280]">+1 840 osób czeka · 3 miesiące gratis przy rejestracji</span>
            </div>
          </div>
        </div>
      </div>

      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </section>
  );
}
