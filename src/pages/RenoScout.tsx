import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEOHead } from '@/components/ui/seo-head';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { ProgressIndicator } from '@/components/ui/user-feedback';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'Automatyczne wyszukiwanie',
    description: 'AI skanuje rynek nieruchomości 24/7, automatycznie zbierając oferty z wielu źródeł i filtrując je pod kątem potencjału inwestycyjnego.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Analiza rynku',
    description: 'Głęboka analiza trendów cenowych, historii transakcji i porównanie z rynkiem lokalnym — wszystko w jednym miejscu.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Scoring inwestycji',
    description: 'Każda nieruchomość otrzymuje automatyczny wynik inwestycyjny oparty na danych — potencjał wzrostu, rentowność i ryzyko w jednej liczbie.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Raporty na żądanie',
    description: 'Generuj szczegółowe raporty inwestycyjne dla dowolnej nieruchomości — gotowe do prezentacji partnerom i bankom.',
  },
];

const audiences = [
  { label: 'Inwestorzy', desc: 'Znajdź okazje zanim zrobi to konkurencja' },
  { label: 'Flipperzy', desc: 'Szybka analiza potencjału remontowego' },
  { label: 'Agenci', desc: 'Dane rynkowe dla lepszych rekomendacji' },
];

export default function RenoScoutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current?.querySelectorAll('.hero-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );

      gsap.fromTo(
        featuresRef.current?.querySelectorAll('.feature-card'),
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top bottom-=100' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#060d1a] text-white">
      <SEOHead
        title="RenoScout – AI dla inwestorów nieruchomości | RenoHub"
        description="RenoScout – platforma AI do wyszukiwania i analizy okazji inwestycyjnych na rynku nieruchomości. Automatyzacja, scoring, dane rynkowe. Już wkrótce!"
        keywords="RenoScout, inwestycje, nieruchomości, AI, analiza rynku, scoring, remonty"
      />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-24 pb-20 px-4 flex flex-col items-center text-center overflow-hidden">

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="hero-item w-24 h-24 bg-gradient-to-br from-[#0c2340] via-[#0e3158] to-[#0a2540] rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-cyan-500/30 relative">
          <OptimizedImage
            src="/Renoscout logo.png"
            alt="RenoScout"
            className="w-16 h-16 object-contain"
          />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-semibold rounded-full">
            Wkrótce
          </span>
        </div>

        {/* Title */}
        <h1 className="hero-item text-5xl md:text-6xl font-bold mb-4 gradient-text">RenoScout</h1>

        {/* Subtitle */}
        <p className="hero-item text-xl md:text-2xl text-gray-300 font-medium mb-6 max-w-xl">
          AI-powered platforma inwestycji w nieruchomości
        </p>

        {/* Tags */}
        <div className="hero-item flex gap-2 justify-center mb-8">
          <Badge className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Web App</Badge>
          <Badge className="px-3 py-1 bg-purple-500/20 text-purple-400 border-purple-500/30">AI</Badge>
          <Badge className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Beta wkrótce</Badge>
        </div>

        {/* Description */}
        <p className="hero-item text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
          RenoScout automatycznie wyszukuje, analizuje i ocenia okazje inwestycyjne na polskim rynku nieruchomości.
          Scoring AI, analiza trendów i automatyczne raporty — wszystko w jednym miejscu.
        </p>

        {/* Progress */}
        <div className="hero-item w-full max-w-sm mb-10">
          <ProgressIndicator
            progress={60}
            label="Postęp rozwoju"
            showPercentage={true}
            animated={true}
          />
        </div>

        {/* CTA */}
        <div className="hero-item flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <EnhancedButton
              variant="outline"
              className="border-white/20 text-white hover:border-cyan-400/60 hover:text-cyan-400 transition-colors"
            >
              ← Powrót na stronę główną
            </EnhancedButton>
          </Link>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-20 px-4 relative">
        <div className="container mx-auto max-w-5xl">

          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[3px] uppercase text-cyan-400 mb-3">Możliwości</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Co potrafi RenoScout?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card group relative p-6 rounded-2xl border border-white/8 bg-white/3 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#0d2535] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:border-cyan-400/60 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[3px] uppercase text-cyan-400 mb-3">Dla kogo</p>
            <h2 className="text-3xl font-bold text-white">Idealne narzędzie dla</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {audiences.map((a, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0d1526] border border-white/8 hover:border-cyan-500/30 transition-colors text-center"
              >
                <p className="text-base font-bold text-cyan-400 mb-1">{a.label}</p>
                <p className="text-sm text-gray-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMING SOON BANNER ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0d1f3c] to-[#0a1628] p-10 text-center overflow-hidden">

            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/15 border border-purple-400/30 rounded-full text-purple-300 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                W trakcie rozwoju — 60%
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Wkrótce dostępny
              </h2>
              <p className="text-gray-400 text-base mb-8 max-w-md mx-auto">
                RenoScout jest aktualnie w fazie intensywnego rozwoju. Wróć wkrótce lub zapisz się na newsletter CalcReno, aby być pierwszym w RenoHub.
              </p>

              <Link to="/">
                <EnhancedButton className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold px-8">
                  Powrót na stronę główną
                </EnhancedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
