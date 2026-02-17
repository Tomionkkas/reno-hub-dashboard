import { SEOHead } from '@/components/ui/seo-head';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Link } from 'react-router-dom';

const renoscoutDescription = `
RenoScout to nowoczesna platforma AI, która rewolucjonizuje proces wyszukiwania, analizy i oceny okazji inwestycyjnych na rynku nieruchomości w Polsce. Automatycznie zbiera dane o nieruchomościach, analizuje trendy rynkowe i generuje scoring inwestycji, pomagając użytkownikom szybko znaleźć najlepsze oferty do remontu i inwestycji. Idealne narzędzie dla inwestorów, flipperów i wszystkich, którzy chcą podejmować decyzje oparte na danych.`;

export default function RenoScoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex flex-col">
      <SEOHead
        title="RenoScout – AI dla inwestorów nieruchomości | RenoHub"
        description="RenoScout – platforma AI do wyszukiwania i analizy okazji inwestycyjnych na rynku nieruchomości. Automatyzacja, scoring, dane rynkowe. Już wkrótce!"
        keywords="RenoScout, inwestycje, nieruchomości, AI, analiza rynku, scoring, remonty"
      />
      <style>{`
        @keyframes breathing-glow {
          0%, 100% {
            transform: scale(1);
            text-shadow: 0 0 24px #a78bfa66, 0 0 0 #fff0;
          }
          50% {
            transform: scale(1.08);
            text-shadow: 0 0 48px #a78bfa, 0 0 8px #fff8;
          }
        }
      `}</style>
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up">
        <AnimatedCard className="glass-card border-white/10 hover:border-blue-400/60 transition-colors hover:shadow-2xl hover:shadow-blue-400/20 max-w-xl w-full text-center animate-scale-in">
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-2 hover-lift animate-glow-pulse shadow-xl border border-blue-300/60">
              <OptimizedImage
                src="/Renoscout logo.png"
                alt="RenoScout application icon"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">RenoScout</h1>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm hover-lift transition-all duration-300 hover:bg-reno-mint/30">Web App</span>
              <span className="px-3 py-1 bg-purple-200/20 text-purple-500 rounded-full text-sm hover-lift transition-all duration-300 hover:bg-purple-200/30">AI</span>
            </div>
            <p className="text-gray-300 text-base md:text-lg mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>{renoscoutDescription}</p>
            <div className="flex flex-col items-center justify-center w-full">
              <div
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{
                  animation: "breathing-glow 2.8s ease-in-out infinite",
                  display: "inline-block",
                }}
              >
                Wkrótce dostępne
              </div>
              <span className="text-gray-400 text-sm">Aplikacja już wkrótce dostępna na platformie RenoHub.</span>
            </div>
          </div>
        </AnimatedCard>
        <Link to="/" className="mt-8">
          <EnhancedButton variant="outline" className="hover-glow text-white border-white/20 hover:border-blue-400/60 animate-fade-in-up" aria-label="Powrót na stronę główną">
            Powrót na stronę główną
          </EnhancedButton>
        </Link>
      </main>
    </div>
  );
} 