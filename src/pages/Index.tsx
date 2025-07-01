
import Navigation from '@/components/Navigation';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card';
import { FloatingShapes } from '@/components/ui/floating-shapes';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { Link } from 'react-router-dom';
import { Calculator, Clock, Wrench, Users, Star, CheckCircle, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <FloatingShapes count={8} />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in-up">
              <TypingAnimation 
                texts={[
                  "Zarządzaj projektami remontowymi profesjonalnie",
                  "Planuj, kalkuluj, kontroluj - wszystko w jednym miejscu",
                  "Jedna platforma - wszystkie Twoje aplikacje remontowe"
                ]}
                className="gradient-text"
              />
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
              Kompletna platforma do zarządzania projektami remontowymi. 
              Kalkulatory kosztów, harmonogramy prac, zarządzanie zespołem - wszystko w jednym miejscu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Link to="/register">
                <EnhancedButton size="lg" variant="gradient" className="text-lg px-8 py-4 hover-lift">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Rozpocznij za darmo
                </EnhancedButton>
              </Link>
              <Link to="/login">
                <EnhancedButton size="lg" variant="outline" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 hover-lift">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Mam już konto
                </EnhancedButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6 animate-fade-in-up">
              Wszystko czego potrzebujesz
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Nasze aplikacje pokrywają każdy aspekt projektów remontowych - od planowania po realizację
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={0} className="glass-card border-white/10 card-hover">
              <AnimatedCardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-reno-purple to-reno-blue rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <AnimatedCardTitle className="text-white">CalcReno</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">
                  Zaawansowany kalkulator remontowy do precyzyjnego wyliczania kosztów materiałów i pracy
                </AnimatedCardDescription>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Kalkulacje per pomieszczenie
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Baza kosztów materiałów
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Eksport raportów PDF
                  </li>
                </ul>
              </AnimatedCardContent>
            </AnimatedCard>

            <AnimatedCard delay={200} className="glass-card border-white/10 card-hover">
              <AnimatedCardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-reno-blue to-reno-mint rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <AnimatedCardTitle className="text-white">RenoTimeline</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">
                  Zarządzanie harmonogramem prac remontowych z automatycznym śledzeniem postępu
                </AnimatedCardDescription>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Harmonogram Gantta
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Śledzenie zadań
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Powiadomienia o terminach
                  </li>
                </ul>
              </AnimatedCardContent>
            </AnimatedCard>

            <AnimatedCard delay={400} className="glass-card border-white/10 card-hover">
              <AnimatedCardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-reno-mint to-reno-purple rounded-lg flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <AnimatedCardTitle className="text-white">RenoTools</AnimatedCardTitle>
                <AnimatedCardDescription className="text-gray-300">
                  Zestaw narzędzi pomocniczych do codziennych zadań remontowych
                </AnimatedCardDescription>
              </AnimatedCardHeader>
              <AnimatedCardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Konwertery jednostek
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Kalkulatory specjalistyczne
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Baza wiedzy technicznej
                  </li>
                </ul>
              </AnimatedCardContent>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-8">
                Dlaczego RenoApp?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-reno-purple to-reno-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Oszczędność czasu</h3>
                    <p className="text-gray-300">Automatyzuj powtarzalne zadania i skup się na tym, co najważniejsze</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-reno-blue to-reno-mint rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Precyzyjne kalkulacje</h3>
                    <p className="text-gray-300">Dokładne wyliczenia kosztów oparte na aktualnych cenach rynkowych</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-reno-mint to-reno-purple rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Współpraca zespołowa</h3>
                    <p className="text-gray-300">Zarządzaj zespołem, przydzielaj zadania i śledź postępy w czasie rzeczywistym</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card border-white/10 p-6 text-center card-hover">
                  <div className="text-3xl font-bold gradient-text mb-2">95%</div>
                  <div className="text-gray-300 text-sm">Dokładność kalkulacji</div>
                </div>
                <div className="glass-card border-white/10 p-6 text-center card-hover">
                  <div className="text-3xl font-bold gradient-text mb-2">40%</div>
                  <div className="text-gray-300 text-sm">Oszczędność czasu</div>
                </div>
                <div className="glass-card border-white/10 p-6 text-center card-hover">
                  <div className="text-3xl font-bold gradient-text mb-2">10k+</div>
                  <div className="text-gray-300 text-sm">Zrealizowanych projektów</div>
                </div>
                <div className="glass-card border-white/10 p-6 text-center card-hover">
                  <div className="text-3xl font-bold gradient-text mb-2">4.9</div>
                  <div className="text-gray-300 text-sm flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    Ocena użytkowników
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <AnimatedCard className="max-w-4xl mx-auto glass-card border-white/10 p-12">
            <AnimatedCardContent>
              <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Zacznij już dziś!
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Dołącz do tysięcy profesjonalistów, którzy już korzystają z RenoApp 
                do zarządzania swoimi projektami remontowymi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <EnhancedButton size="lg" variant="gradient" className="text-lg px-8 py-4 hover-lift">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Rozpocznij bezpłatny okres próbny
                  </EnhancedButton>
                </Link>
                <EnhancedButton size="lg" variant="outline" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10 hover-lift">
                  Zobacz demo
                </EnhancedButton>
              </div>
            </AnimatedCardContent>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 relative">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold gradient-text mb-4">RenoApp</div>
          <p className="text-gray-400 mb-6">
            Profesjonalne zarządzanie projektami remontowymi
          </p>
          <div className="text-gray-500 text-sm">
            © 2024 RenoApp. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
