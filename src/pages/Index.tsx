
import Navigation from '@/components/Navigation';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card';
import { Link } from 'react-router-dom';
import { Folder, BarChart, CreditCard, DollarSign, UserCircle, Check, X } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-reno-purple/10 rounded-full floating-element"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-reno-blue/10 rounded-full floating-element" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-reno-mint/10 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in-down">
            <span className="gradient-text">RenoApp</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            Jedna platforma – wszystkie Twoje aplikacje remontowe
          </p>
          <div className="flex gap-4 justify-center animate-scale-in" style={{animationDelay: '400ms'}}>
            <Link to="/register">
              <EnhancedButton size="xl" variant="floating">
                Zacznij teraz
              </EnhancedButton>
            </Link>
            <EnhancedButton 
              size="xl" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            >
              Zobacz aplikacje
            </EnhancedButton>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">Nasze Aplikacje</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedCard className="glass-card border-white/10 hover:border-reno-purple/50 transition-colors" delay={0}>
              <AnimatedCardHeader>
                <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-4 hover-lift">
                  <img 
                    src="/placeholder.svg" 
                    alt="CalcReno Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <AnimatedCardTitle className="text-white text-2xl">CalcReno</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">
                  Narzędzie do obliczeń materiałów budowlanych. Zaplanuj projekt i oblicz dokładne ilości potrzebnych materiałów.
                </AnimatedCardDescription>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm hover-lift">Mobile</span>
                  <span className="px-3 py-1 bg-reno-purple/20 text-reno-blue rounded-full text-sm hover-lift">iOS/Android</span>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>

            <AnimatedCard className="glass-card border-white/10 hover:border-reno-purple/50 transition-colors" delay={200}>
              <AnimatedCardHeader>
                <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-4 hover-lift">
                  <img 
                    src="/placeholder.svg" 
                    alt="RenoTimeline Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <AnimatedCardTitle className="text-white text-2xl">RenoTimeline</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">
                  Narzędzie do zarządzania projektami remontowymi. Planuj etapy, śledź postępy i kontroluj koszty.
                </AnimatedCardDescription>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm hover-lift">Web App</span>
                  <span className="px-3 py-1 bg-reno-purple/20 text-reno-blue rounded-full text-sm hover-lift">Browser</span>
                </div>
              </AnimatedCardContent>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white animate-fade-in">Dlaczego RenoApp?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CreditCard, title: "Bezpieczne przechowywanie", desc: "Twoje projekty są bezpiecznie zapisane w chmurze" },
              { icon: DollarSign, title: "Kontrola kosztów", desc: "Śledź wydatki i optymalizuj budżet remontowy" },
              { icon: UserCircle, title: "Szybki dostęp", desc: "Dostęp do wszystkich projektów z jednego miejsca" }
            ].map((feature, index) => (
              <div key={index} className="text-center animate-fade-in-up stagger-animation">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text animate-fade-in">Plany Subskrypcyjne</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <AnimatedCard className="glass-card border-white/10" delay={0}>
              <AnimatedCardHeader>
                <AnimatedCardTitle className="text-white text-2xl">Free</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">Podstawowe funkcje</AnimatedCardDescription>
                <div className="text-3xl font-bold text-white">0 zł<span className="text-lg text-gray-300">/mies</span></div>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Dostęp do podstawowych funkcji
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Maksymalnie 3 projekty
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Ograniczone eksporty
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <X className="w-4 h-4 text-red-400" />
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
                <AnimatedCardTitle className="text-white text-2xl">Pro</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">Jedna aplikacja, pełen dostęp</AnimatedCardDescription>
                <div className="text-3xl font-bold text-white">20-40 zł<span className="text-lg text-gray-300">/app/mies</span></div>
                <p className="text-sm text-gray-400">Roczna płatność: -20%</p>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Pełen dostęp do wybranej aplikacji
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Nielimitowane projekty
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Eksport do PDF/Excel
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
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
                <AnimatedCardTitle className="text-white text-2xl">Expert</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">Dla zespołów i firm</AnimatedCardDescription>
                <div className="text-3xl font-bold text-white">200-220 zł<span className="text-lg text-gray-300">/mies</span></div>
                <p className="text-sm text-gray-400">Roczna płatność: -25% | Do 3 użytkowników</p>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Dostęp do wszystkich aplikacji
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Wsparcie dla 2-3 użytkowników
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Premium wsparcie techniczne
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Wczesny dostęp do nowości
                  </li>
                  <li className="flex items-center gap-2 hover-lift">
                    <Check className="w-4 h-4 text-reno-mint" />
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
              <p className="text-white font-semibold">
                🚀 Oferta startowa: -30% na pierwsze 6 miesięcy dla wszystkich planów!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-reno-purple to-reno-blue animated-gradient">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 animate-fade-in">Gotowy na start?</h2>
          <p className="text-xl text-white/80 mb-8 animate-fade-in-up" style={{animationDelay: '200ms'}}>Dołącz do tysięcy zadowolonych użytkowników</p>
          <div className="animate-scale-in" style={{animationDelay: '400ms'}}>
            <Link to="/register">
              <EnhancedButton size="xl" className="bg-white text-reno-purple hover:bg-gray-100 font-semibold">
                Zarejestruj się teraz
              </EnhancedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/30">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold gradient-text mb-4 animate-fade-in">RenoApp</div>
          <p className="text-gray-400 mb-6 animate-fade-in-up" style={{animationDelay: '100ms'}}>Jedna platforma – wszystkie Twoje aplikacje remontowe</p>
          <div className="flex justify-center gap-8 text-sm text-gray-400 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <a href="#" className="nav-link hover:text-white transition-colors">Regulamin</a>
            <a href="#" className="nav-link hover:text-white transition-colors">Polityka prywatności</a>
            <a href="#" className="nav-link hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
