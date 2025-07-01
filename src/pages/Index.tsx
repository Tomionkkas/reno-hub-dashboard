import Navigation from '@/components/Navigation';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { SkipLink } from '@/components/ui/accessibility-skip-link';
import { SEOHead } from '@/components/ui/seo-head';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { usePerformanceMonitor } from '@/hooks/use-performance';
import { Link } from 'react-router-dom';
import { Folder, BarChart, CreditCard, DollarSign, UserCircle, Check, X } from 'lucide-react';

const Index = () => {
  usePerformanceMonitor('Index');

  const heroTexts = [
    "Jedna platforma – wszystkie Twoje aplikacje remontowe",
    "Zarządzaj projektami remontowymi profesjonalnie",
    "Obliczaj materiały i kontroluj koszty",
    "Planuj, realizuj, oszczędzaj"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      <SEOHead 
        title="RenoApp - Platforma aplikacji remontowych"
        description="Jedna platforma – wszystkie Twoje aplikacje remontowe. CalcReno do obliczeń materiałów i RenoTimeline do zarządzania projektami."
        keywords="remont, aplikacje remontowe, kalkulatory budowlane, zarządzanie projektami remontowymi, CalcReno, RenoTimeline"
      />
      
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Navigation />
      
      {/* Hero Section with Enhanced Visuals */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden" aria-labelledby="hero-heading">
        {/* Enhanced Floating Background Elements */}
        <FloatingShapes count={8} className="opacity-30" />
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-reno-purple/20 rounded-full blur-xl animate-float-random"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-reno-blue/20 rounded-full blur-lg animate-float-random" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 bg-reno-mint/20 rounded-full blur-md animate-float-random" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-reno-purple/10 to-reno-blue/10 rounded-full blur-2xl animate-glow-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
            <span className="gradient-text">RenoApp</span>
          </h1>
          
          {/* Enhanced Hero Description with Typing Animation */}
          <div className="text-xl md:text-2xl text-gray-300 mb-8 min-h-[3rem] flex items-center justify-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <TypingAnimation 
              texts={heroTexts}
              className="gradient-text font-semibold"
              speed={80}
              deleteSpeed={40}
              pauseDuration={3000}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{animationDelay: '400ms'}}>
            <Link to="/register">
              <EnhancedButton 
                size="xl" 
                variant="floating" 
                className="animate-glow-pulse w-full sm:w-auto"
                aria-label="Start using RenoApp"
              >
                Zacznij teraz
              </EnhancedButton>
            </Link>
            <EnhancedButton 
              size="xl" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover-glow w-full sm:w-auto"
              aria-label="View available applications"
            >
              Zobacz aplikacje
            </EnhancedButton>
          </div>
        </div>
      </section>

      {/* Apps Section with Enhanced Cards */}
      <main id="main-content">
        <section className="py-20 px-4 relative" aria-labelledby="apps-heading">
          <div className="container mx-auto">
            <h2 id="apps-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">Nasze Aplikacje</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <AnimatedCard className="glass-card border-white/10 hover:border-reno-purple/50 transition-colors hover:shadow-2xl hover:shadow-reno-purple/20" delay={0} hover="glow" role="article" aria-labelledby="calcreno-title">
                <AnimatedCardHeader>
                  <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-4 hover-lift animate-glow-pulse">
                    <OptimizedImage 
                      src="/placeholder.svg" 
                      alt="CalcReno application icon" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <AnimatedCardTitle id="calcreno-title" className="text-white text-xl md:text-2xl">CalcReno</AnimatedCardTitle>
                  <AnimatedCardDescription className="text-gray-300 text-sm md:text-base">
                    Narzędzie do obliczeń materiałów budowlanych. Zaplanuj projekt i oblicz dokładne ilości potrzebnych materiałów.
                  </AnimatedCardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm hover-lift transition-all duration-300 hover:bg-reno-mint/30">Mobile</span>
                    <span className="px-3 py-1 bg-reno-purple/20 text-reno-blue rounded-full text-sm hover-lift transition-all duration-300 hover:bg-reno-purple/30">iOS/Android</span>
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>

              <AnimatedCard className="glass-card border-white/10 hover:border-reno-purple/50 transition-colors hover:shadow-2xl hover:shadow-reno-blue/20" delay={200} hover="glow" role="article" aria-labelledby="renotimeline-title">
                <AnimatedCardHeader>
                  <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-4 hover-lift animate-glow-pulse" style={{animationDelay: '0.5s'}}>
                    <OptimizedImage 
                      src="/placeholder.svg" 
                      alt="RenoTimeline application icon" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <AnimatedCardTitle id="renotimeline-title" className="text-white text-xl md:text-2xl">RenoTimeline</AnimatedCardTitle>
                  <AnimatedCardDescription className="text-gray-300 text-sm md:text-base">
                    Narzędzie do zarządzania projektami remontowymi. Planuj etapy, śledź postępy i kontroluj koszty.
                  </AnimatedCardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm hover-lift transition-all duration-300 hover:bg-reno-mint/30">Web App</span>
                    <span className="px-3 py-1 bg-reno-purple/20 text-reno-blue rounded-full text-sm hover-lift transition-all duration-300 hover:bg-reno-purple/30">Browser</span>
                  </div>
                </AnimatedCardContent>
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-black/20 relative" aria-labelledby="features-heading">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-reno-purple/5 rounded-full blur-3xl animate-float-random"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-reno-blue/5 rounded-full blur-2xl animate-float-random" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 text-white animate-fade-in">Dlaczego RenoApp?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: CreditCard, title: "Bezpieczne przechowywanie", desc: "Twoje projekty są bezpiecznie zapisane w chmurze", delay: 0 },
                { icon: DollarSign, title: "Kontrola kosztów", desc: "Śledź wydatki i optymalizuj budżet remontowy", delay: 100 },
                { icon: UserCircle, title: "Szybki dostęp", desc: "Dostęp do wszystkich projektów z jednego miejsca", delay: 200 }
              ].map((feature, index) => (
                <div key={index} className="text-center animate-fade-in-up group" style={{animationDelay: `${feature.delay}ms`}}>
                  <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 hover-lift group-hover:animate-glow-pulse transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm md:text-base">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4" aria-labelledby="pricing-heading">
          <div className="container mx-auto">
            <h2 id="pricing-heading" className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">Plany Subskrypcyjne</h2>
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Tier */}
              <AnimatedCard className="glass-card border-white/10" delay={0}>
                <AnimatedCardHeader>
                  <AnimatedCardTitle className="text-white text-xl md:text-2xl">Free</AnimatedCardTitle>
                  <AnimatedCardDescription className="text-gray-300">Podstawowe funkcje</AnimatedCardDescription>
                  <div className="text-2xl md:text-3xl font-bold text-white">0 zł<span className="text-base md:text-lg text-gray-300">/mies</span></div>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <ul className="space-y-3 text-gray-300 mb-6 text-sm md:text-base">
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Dostęp do podstawowych funkcji
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Maksymalnie 3 projekty
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Ograniczone eksporty
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      Brak premium wsparcia
                    </li>
                  </ul>
                  <EnhancedButton className="w-full" variant="outline">
                    Zacznij za darmo
                  </EnhancedButton>
                </AnimatedCardContent>
              </AnimatedCard>

              {/* Pro Tier */}
              <AnimatedCard className="glass-card border-reno-purple relative scale-105 hover:scale-110 transition-transform duration-300" delay={200}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-white text-sm animate-bounce-gentle">
                  Najpopularniejszy
                </div>
                <AnimatedCardHeader>
                  <AnimatedCardTitle className="text-white text-xl md:text-2xl">Pro</AnimatedCardTitle>
                  <AnimatedCardDescription className="text-gray-300">Jedna aplikacja, pełen dostęp</AnimatedCardDescription>
                  <div className="text-2xl md:text-3xl font-bold text-white">20-40 zł<span className="text-base md:text-lg text-gray-300">/app/mies</span></div>
                  <p className="text-sm text-gray-400">Roczna płatność: -20%</p>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <ul className="space-y-3 text-gray-300 mb-6 text-sm md:text-base">
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Pełen dostęp do wybranej aplikacji
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Nielimitowane projekty
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Eksport do PDF/Excel
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Standardowe wsparcie
                    </li>
                  </ul>
                  <EnhancedButton className="w-full" variant="gradient">
                    Wybierz plan Pro
                  </EnhancedButton>
                </AnimatedCardContent>
              </AnimatedCard>

              {/* Expert Tier */}
              <AnimatedCard className="glass-card border-white/10" delay={400}>
                <AnimatedCardHeader>
                  <AnimatedCardTitle className="text-white text-xl md:text-2xl">Expert</AnimatedCardTitle>
                  <AnimatedCardDescription className="text-gray-300">Dla zespołów i firm</AnimatedCardDescription>
                  <div className="text-2xl md:text-3xl font-bold text-white">200-220 zł<span className="text-base md:text-lg text-gray-300">/mies</span></div>
                  <p className="text-sm text-gray-400">Roczna płatność: -25% | Do 3 użytkowników</p>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <ul className="space-y-3 text-gray-300 mb-6 text-sm md:text-base">
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Dostęp do wszystkich aplikacji
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Wsparcie dla 2-3 użytkowników
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Premium wsparcie techniczne
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      Wczesny dostęp do nowości
                    </li>
                    <li className="flex items-center gap-2 hover-lift">
                      <Check className="w-4 h-4 text-reno-mint flex-shrink-0" />
                      API dostęp
                    </li>
                  </ul>
                  <EnhancedButton className="w-full" variant="outline">
                    Skontaktuj się
                  </EnhancedButton>
                </AnimatedCardContent>
              </AnimatedCard>
            </div>
            
            {/* Special Offer Banner */}
            <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '600ms'}}>
              <div className="inline-block bg-gradient-to-r from-reno-purple to-reno-blue rounded-xl p-4 hover-lift">
                <p className="text-white font-semibold text-sm md:text-base">
                  🚀 Oferta startowa: -30% na pierwsze 6 miesięcy dla wszystkich planów!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-reno-purple to-reno-blue animated-gradient relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white/30 rounded-full animate-float-random"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 border border-white/30 rounded-full animate-float-random" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-white/30 rounded-full animate-float-random" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">Gotowy na start?</h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>Dołącz do tysięcy zadowolonych użytkowników</p>
            <div className="animate-scale-in" style={{animationDelay: '400ms'}}>
              <Link to="/register">
                <EnhancedButton size="xl" className="bg-white text-reno-purple hover:bg-gray-100 font-semibold hover:scale-110 transition-all duration-300 hover:shadow-2xl">
                  Zarejestruj się teraz
                </EnhancedButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/30 relative" role="contentinfo">
        <div className="container mx-auto text-center">
          <div className="text-xl md:text-2xl font-bold gradient-text mb-4 animate-fade-in hover-lift">RenoApp</div>
          <p className="text-gray-400 mb-6 animate-fade-in-up text-sm md:text-base" style={{animationDelay: '100ms'}}>Jedna platforma – wszystkie Twoje aplikacje remontowe</p>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-gray-400 animate-fade-in-up" style={{animationDelay: '200ms'}} aria-label="Footer navigation">
            <a href="#" className="nav-link hover:text-white transition-colors hover:gradient-text">Regulamin</a>
            <a href="#" className="nav-link hover:text-white transition-colors hover:gradient-text">Polityka prywatności</a>
            <a href="#" className="nav-link hover:text-white transition-colors hover:gradient-text">Kontakt</a>
          </nav>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
};

export default Index;
