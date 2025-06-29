
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Folder, BarChart, CreditCard, DollarSign, UserCircle, Check, X } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            <span className="gradient-text">RenoApp</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-8 animate-fade-in">
            Jedna platforma – wszystkie Twoje aplikacje remontowe
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Link to="/register">
              <Button size="lg" className="gradient-bg hover:opacity-90 transition-opacity px-8 py-4 text-lg">
                Zacznij teraz
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
              Zobacz aplikacje
            </Button>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Nasze Aplikacje</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="glass-card border-white/10 hover:border-reno-purple/50 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="CalcReno Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <CardTitle className="text-white text-2xl">CalcReno</CardTitle>
                <CardDescription className="text-gray-300">
                  Narzędzie do obliczeń materiałów budowlanych. Zaplanuj projekt i oblicz dokładne ilości potrzebnych materiałów.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm">Mobile</span>
                  <span className="px-3 py-1 bg-reno-purple/20 text-reno-blue rounded-full text-sm">iOS/Android</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-reno-purple/50 transition-colors">
              <CardHeader>
                <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-4">
                  <img 
                    src="/placeholder.svg" 
                    alt="RenoTimeline Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <CardTitle className="text-white text-2xl">RenoTimeline</CardTitle>
                <CardDescription className="text-gray-300">
                  Narzędzie do zarządzania projektami remontowymi. Planuj etapy, śledź postępy i kontroluj koszty.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-reno-mint/20 text-reno-mint rounded-full text-sm">Web App</span>
                  <span className="px-3 py-1 bg-reno-purple/20 text-reno-blue rounded-full text-sm">Browser</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Dlaczego RenoApp?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bezpieczne przechowywanie</h3>
              <p className="text-gray-300">Twoje projekty są bezpiecznie zapisane w chmurze</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Kontrola kosztów</h3>
              <p className="text-gray-300">Śledź wydatki i optymalizuj budżet remontowy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Szybki dostęp</h3>
              <p className="text-gray-300">Dostęp do wszystkich projektów z jednego miejsca</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Plany Subskrypcyjne</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Free</CardTitle>
                <CardDescription className="text-gray-300">Podstawowe funkcje</CardDescription>
                <div className="text-3xl font-bold text-white">0 zł<span className="text-lg text-gray-300">/mies</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Dostęp do podstawowych funkcji
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Maksymalnie 3 projekty
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Ograniczone eksporty
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400" />
                    Brak premium wsparcia
                  </li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  Zacznij za darmo
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="glass-card border-reno-purple relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 gradient-bg rounded-full text-white text-sm">
                Najpopularniejszy
              </div>
              <CardHeader>
                <CardTitle className="text-white text-2xl">Pro</CardTitle>
                <CardDescription className="text-gray-300">Jedna aplikacja, pełen dostęp</CardDescription>
                <div className="text-3xl font-bold text-white">20-40 zł<span className="text-lg text-gray-300">/app/mies</span></div>
                <p className="text-sm text-gray-400">Roczna płatność: -20%</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Pełen dostęp do wybranej aplikacji
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Nielimitowane projekty
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Eksport do PDF/Excel
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Standardowe wsparcie
                  </li>
                </ul>
                <Button className="w-full gradient-bg hover:opacity-90">
                  Wybierz plan Pro
                </Button>
              </CardContent>
            </Card>

            {/* Expert Tier */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Expert</CardTitle>
                <CardDescription className="text-gray-300">Dla zespołów i firm</CardDescription>
                <div className="text-3xl font-bold text-white">200-220 zł<span className="text-lg text-gray-300">/mies</span></div>
                <p className="text-sm text-gray-400">Roczna płatność: -25% | Do 3 użytkowników</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Dostęp do wszystkich aplikacji
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Wsparcie dla 2-3 użytkowników
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Premium wsparcie techniczne
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    Wczesny dostęp do nowości
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-reno-mint" />
                    API dostęp
                  </li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  Skontaktuj się
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Special Offer Banner */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-r from-reno-purple to-reno-blue rounded-xl p-4">
              <p className="text-white font-semibold">
                🚀 Oferta startowa: -30% na pierwsze 6 miesięcy dla wszystkich planów!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-reno-purple to-reno-blue">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Gotowy na start?</h2>
          <p className="text-xl text-white/80 mb-8">Dołącz do tysięcy zadowolonych użytkowników</p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-reno-purple hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Zarejestruj się teraz
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/30">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold gradient-text mb-4">RenoApp</div>
          <p className="text-gray-400 mb-6">Jedna platforma – wszystkie Twoje aplikacje remontowe</p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Regulamin</a>
            <a href="#" className="hover:text-white transition-colors">Polityka prywatności</a>
            <a href="#" className="hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
