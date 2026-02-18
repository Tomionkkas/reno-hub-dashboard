import { Link } from 'react-router-dom';
import { Layers, Clock, BarChart3 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { GradientBackground } from '@/components/ui/visual-enhancements';
import { OptimizedImage } from '@/components/ui/optimized-image';

const problems = [
  {
    icon: <Layers className="w-5 h-5 text-cyan-400" />,
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Rozproszenie narzędzi',
    description: 'Dziesiątki aplikacji, arkuszy i kalkulatorów. Dane giną, praca się dubluje.',
  },
  {
    icon: <Clock className="w-5 h-5 text-purple-400" />,
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Czas tracony na szacowanie',
    description: 'Ręczne obliczenia zajmują godziny. Błędy w wycenach kosztują pieniądze.',
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-rose-400" />,
    iconBg: 'bg-rose-500/10 border-rose-500/20',
    title: 'Brak danych rynkowych',
    description: 'Decyzje inwestycyjne bez pełnych danych to przepis na straty.',
  },
];

const apps = [
  {
    id: 'calcreno',
    title: 'CalcReno',
    description: 'Mobilny kalkulator materiałów budowlanych.',
    image: '/calcreno-logo-full-transparent.webp',
    status: 'Wkrótce',
    statusColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    link: '/waitlist',
    linkLabel: 'Dołącz do listy →',
    external: false,
  },
  {
    id: 'renotimeline',
    title: 'RenoTimeline',
    description: 'Zarządzanie projektami remontowymi.',
    image: '/renotimeline-logo-transparent.webp',
    status: 'Dostępne',
    statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    link: 'https://www.renotimeline.com',
    linkLabel: 'Otwórz →',
    external: true,
  },
  {
    id: 'renoscout',
    title: 'RenoScout',
    description: 'AI do analizy okazji inwestycyjnych.',
    image: '/renoscout-logo.webp',
    status: 'Coming Soon',
    statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    link: '/renoscout',
    linkLabel: 'Dowiedz się →',
    external: false,
  },
];

export default function AboutPage() {
  return (
    <GradientBackground
      colors={['from-black', 'via-slate-900', 'to-black']}
      direction="to-br"
      animated={false}
      className="min-h-screen relative"
    >
      <SEOHead
        title="O nas – RenoHub | Platforma aplikacji remontowych"
        description="RenoHub to platforma łącząca wszystkie narzędzia potrzebne fachowcom i inwestorom remontowym w jednym miejscu. Poznaj naszą misję."
        keywords="RenoHub, o nas, misja, platforma remontowa, CalcReno, RenoTimeline, RenoScout"
      />

      <Navigation />

      <main className="pt-20 md:pt-28 pb-12 md:pb-16 px-4">
        <div className="container mx-auto max-w-4xl">

          {/* Hero */}
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
              O RenoHub
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Jedna platforma —{' '}
              <span className="text-cyan-400">wszystkie Twoje narzędzia</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              RenoHub powstał z jednego przekonania: fachowcy i inwestorzy remontowi zasługują
              na narzędzia klasy enterprise — dostępne od razu, bez skomplikowanego wdrożenia.
            </p>
          </div>

          {/* Problem cards — horizontal layout on mobile */}
          <div className="mb-10 md:mb-16">
            <h2 className="text-xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">
              Dlaczego RenoHub?
            </h2>
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {problems.map((p) => (
                <div
                  key={p.title}
                  className="flex items-start gap-3 md:flex-col md:gap-0 bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/30 transition-colors"
                >
                  <div className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl border md:mb-4 ${p.iconBg}`}>
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-lg mb-1 md:mb-2">{p.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission statement */}
          <div className="bg-gradient-to-r from-reno-purple/20 to-reno-blue/20 border border-white/10 rounded-2xl p-6 md:p-10 mb-10 md:mb-16 text-center">
            <p className="text-white text-base md:text-2xl font-medium leading-relaxed italic">
              "Chcemy, żeby każdy fachowiec i inwestor w Polsce miał dostęp do narzędzi,
              które sprawiają, że praca jest szybsza, dokładniejsza i mniej stresująca."
            </p>
            <p className="text-gray-500 text-sm mt-3">— Zespół RenoHub</p>
          </div>

          {/* Apps — 2-col on mobile, 3-col on desktop */}
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-white text-center mb-6 md:mb-8">
              Nasze aplikacje
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/30 transition-colors flex flex-col"
                >
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl flex items-center justify-center mb-3 border border-cyan-500/40">
                    <OptimizedImage
                      src={app.image}
                      alt={app.title}
                      className="w-7 h-7 md:w-10 md:h-10 object-contain"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <h3 className="text-white font-bold text-sm md:text-lg">{app.title}</h3>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-3 flex-1">{app.description}</p>
                  {app.external ? (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-xs md:text-sm font-semibold hover:text-cyan-300 transition-colors"
                    >
                      {app.linkLabel}
                    </a>
                  ) : (
                    <Link
                      to={app.link}
                      className="text-cyan-400 text-xs md:text-sm font-semibold hover:text-cyan-300 transition-colors"
                    >
                      {app.linkLabel}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </GradientBackground>
  );
}
