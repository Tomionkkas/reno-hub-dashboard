// src/pages/RenoScout.tsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEOHead } from '@/components/ui/seo-head';
import { RenoScoutDemo } from '@/components/renoscout/RenoScoutDemo';
import { track } from '@/utils/funnelTracking';

gsap.registerPlugin(ScrollTrigger);

const GRAD = 'linear-gradient(135deg, #6366F1 0%, #FF6B35 100%)';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: 'Automatyczne wyszukiwanie',
    description: 'AI skanuje portale ogłoszeniowe 24/7, zbiera oferty i filtruje je pod kątem potencjału inwestycyjnego.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Analiza rynku',
    description: 'Porównanie z cenami transakcyjnymi w okolicy, trendy i mediany — w jednym widoku.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Scoring inwestycji',
    description: 'Każda nieruchomość dostaje wynik 0–10: potencjał, rentowność i ryzyko w jednej liczbie.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Raporty na żądanie',
    description: 'Generuj raport ROI dla dowolnej oferty — gotowy do prezentacji partnerom i bankom.',
  },
];

const audiences = [
  { label: 'Inwestorzy', desc: 'Znajdź okazje zanim zrobi to konkurencja' },
  { label: 'Flipperzy', desc: 'Szybka analiza potencjału remontowego i ROI' },
  { label: 'Agenci', desc: 'Dane rynkowe dla lepszych rekomendacji' },
];

const OFFER_LINE = 'Tydzień gratis · +1 miesiąc za konto przed startem';

export default function RenoScoutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    track('promo_view', 'renoscout_page');
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.querySelectorAll('.hero-item'), {
        y: 20, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      });
      gsap.from(featuresRef.current?.querySelectorAll('.feature-card'), {
        y: 30, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top bottom-=100' },
      });
    });
    return () => ctx.revert();
  }, []);

  const onTryClick = () => track('promo_click', 'renoscout_page');

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white">
      <SEOHead
        title="RenoScout – AI znajduje okazje inwestycyjne | RenoHub"
        description="RenoScout wyszukuje okazje na portalach ogłoszeniowych, liczy ROI i ocenia inwestycję wynikiem 0–10. Wypróbuj za darmo — tydzień gratis."
        keywords="RenoScout, inwestycje, nieruchomości, AI, analiza ROI, scoring, flip, okazje"
      />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-14 pb-12 md:pt-24 md:pb-16 px-4 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(99,102,241,0.18)' }} />
        <div className="absolute top-24 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(255,107,53,0.12)' }} />

        <p className="hero-item text-xs font-mono tracking-[2px] uppercase text-white/50 mb-4">
          ⟶ AI · Inwestycje · Nieruchomości
        </p>

        <h1 className="hero-item text-4xl md:text-6xl font-bold mb-4 leading-tight max-w-3xl">
          Okazje pod remont.{' '}
          <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Zanim znikną.
          </span>
        </h1>

        <p className="hero-item text-gray-300 text-base md:text-xl max-w-2xl leading-relaxed mb-4">
          RenoScout (AI) przegląda portale ogłoszeniowe, liczy ROI i ocenia każdą ofertę wynikiem inwestycyjnym 0–10.
        </p>

        <div className="hero-item mb-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#6366F1]/40 bg-[#6366F1]/10 text-[#A5B4FC]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
            Wkrótce — aplikacja nie jest jeszcze dostępna
          </span>
        </div>

        <div className="hero-item flex gap-2 justify-center mb-5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/15 text-white/80">Web App</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/15 text-white/80">AI</span>
        </div>

        <div className="hero-item flex flex-col items-center gap-2 mb-8">
          <Link
            to="/register?ref=renoscout_page"
            onClick={onTryClick}
            className="inline-block bg-white text-[#0A0B1E] font-semibold rounded-full px-8 py-4 text-[15px] hover:bg-white/90 transition-colors"
          >
            Załóż konto przed startem →
          </Link>
          <p className="text-xs text-white/50">{OFFER_LINE}</p>
        </div>

        {/* Embedded scripted demo (replaces the old static frame) */}
        <div className="hero-item w-full">
          <RenoScoutDemo />
        </div>
      </section>

      {/* ── § 01 — MOŻLIWOŚCI ─────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-12 md:py-20 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs font-mono tracking-[2px] uppercase text-white/50 mb-3 text-center">§ 01 — Możliwości</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">Co potrafi RenoScout?</h2>

          <div className="grid grid-cols-2 gap-3 md:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card group relative p-4 md:p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white mb-3 md:mb-4"
                  style={{ background: GRAD }}
                >
                  {f.icon}
                </div>
                <h3 className="text-sm md:text-lg font-bold text-white mb-1 md:mb-2">{f.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── § 02 — DLA KOGO ───────────────────────────────────────────── */}
      <section className="py-10 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-xs font-mono tracking-[2px] uppercase text-white/50 mb-3 text-center">§ 02 — Dla kogo</p>
          <h2 className="text-3xl font-bold text-white text-center mb-8 md:mb-10">Idealne narzędzie dla</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {audiences.map((a, i) => (
              <div key={i} className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <p
                  className="text-base font-bold mb-1"
                  style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  {a.label}
                </p>
                <p className="text-sm text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="relative rounded-3xl border border-white/10 bg-[#12142b] p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: GRAD }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Wypróbuj RenoScout za darmo</h2>
              <p className="text-gray-300 text-base mb-2 max-w-md mx-auto">
                Tydzień gratis dla każdego. Załóż konto przed startem i dostań dodatkowy miesiąc.
              </p>
              <p className="text-xs text-white/50 mb-6">{OFFER_LINE}</p>
              <Link
                to="/register?ref=renoscout_page"
                onClick={onTryClick}
                className="inline-block bg-white text-[#0A0B1E] font-semibold rounded-full px-8 py-4 text-[15px] hover:bg-white/90 transition-colors"
              >
                Załóż konto RenoScout →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
