import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { GradientBackground } from '@/components/ui/visual-enhancements';
import { Shield, AlertTriangle, Eye, Lock, UserCheck, FileText, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <GradientBackground
      colors={['from-black', 'via-slate-900', 'to-black']}
      direction="to-br"
      animated={false}
      className="min-h-screen relative"
    >
      <SEOHead
        title="Polityka Prywatności - RenoHub"
        description="Polityka prywatności platformy RenoHub oraz aplikacji CalcReno i RenoTimeline. Dowiedz się jak chronimy Twoje dane."
        keywords="polityka prywatności, RODO, ochrona danych, RenoHub, CalcReno, RenoTimeline"
      />

      <Navigation />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-reno-purple to-reno-blue mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Polityka Prywatności
            </h1>
            <p className="text-gray-400">
              Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Beta Warning */}
          <div className="glass-card p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-yellow-500 mb-2">
                  Faza Beta
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  RenoHub oraz wszystkie powiązane aplikacje (CalcReno, RenoTimeline) znajdują się obecnie w fazie beta.
                  Oznacza to, że mogą występować błędy, niedokładności w obliczeniach lub inne problemy techniczne.
                  Korzystasz z platformy na własną odpowiedzialność. Zalecamy weryfikację wszystkich obliczeń
                  i szacunków przed podjęciem decyzji finansowych lub budowlanych.
                </p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Introduction */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-reno-purple" />
                1. Wprowadzenie
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych
                  użytkowników korzystających z platformy RenoHub oraz powiązanych aplikacji:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">RenoHub</strong> – platforma centralna łącząca wszystkie aplikacje remontowe</li>
                  <li><strong className="text-white">CalcReno</strong> – aplikacja do kalkulacji materiałów i kosztów remontowych</li>
                  <li><strong className="text-white">RenoTimeline</strong> – aplikacja do zarządzania projektami remontowymi</li>
                </ul>
                <p>
                  Administratorem danych osobowych jest RenoHub. Kontakt: <a href="mailto:contact@renohub.org" className="text-reno-purple hover:underline">contact@renohub.org</a>
                </p>
              </div>
            </section>

            {/* Data Collection */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Eye className="w-5 h-5 text-reno-purple" />
                2. Jakie dane zbieramy
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>W ramach korzystania z naszych usług możemy zbierać następujące dane:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Dane rejestracyjne: imię, nazwisko, adres e-mail, hasło (zaszyfrowane)</li>
                  <li>Dane projektowe: informacje o projektach remontowych, kalkulacje, harmonogramy</li>
                  <li>Dane techniczne: adres IP, typ przeglądarki, system operacyjny, logi dostępu</li>
                  <li>Dane analityczne: informacje o sposobie korzystania z aplikacji (anonimowe)</li>
                </ul>
              </div>
            </section>

            {/* Data Usage */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Lock className="w-5 h-5 text-reno-purple" />
                3. Cel przetwarzania danych
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>Twoje dane przetwarzamy w następujących celach:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Świadczenie usług platformy RenoHub i powiązanych aplikacji</li>
                  <li>Zarządzanie kontem użytkownika i autentykacja</li>
                  <li>Komunikacja z użytkownikiem (powiadomienia, wsparcie techniczne)</li>
                  <li>Poprawa jakości usług i rozwój nowych funkcjonalności</li>
                  <li>Zapewnienie bezpieczeństwa platformy</li>
                  <li>Wypełnienie obowiązków prawnych</li>
                </ul>
              </div>
            </section>

            {/* User Rights */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-reno-purple" />
                4. Twoje prawa
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>Zgodnie z RODO przysługują Ci następujące prawa:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Prawo dostępu</strong> – możesz uzyskać informacje o przetwarzanych danych</li>
                  <li><strong className="text-white">Prawo do sprostowania</strong> – możesz poprawić nieprawidłowe dane</li>
                  <li><strong className="text-white">Prawo do usunięcia</strong> – możesz żądać usunięcia swoich danych ("prawo do bycia zapomnianym")</li>
                  <li><strong className="text-white">Prawo do ograniczenia przetwarzania</strong> – możesz ograniczyć sposób wykorzystania danych</li>
                  <li><strong className="text-white">Prawo do przenoszenia danych</strong> – możesz otrzymać kopię swoich danych w formacie maszynowym</li>
                  <li><strong className="text-white">Prawo do sprzeciwu</strong> – możesz sprzeciwić się przetwarzaniu danych</li>
                  <li><strong className="text-white">Prawo do cofnięcia zgody</strong> – w każdej chwili możesz wycofać zgodę na przetwarzanie</li>
                </ul>
                <p className="mt-4">
                  Aby skorzystać z powyższych praw, skontaktuj się z nami: <a href="mailto:privacy@renohub.org" className="text-reno-purple hover:underline">privacy@renohub.org</a>
                </p>
              </div>
            </section>

            {/* Beta Disclaimers */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-reno-purple" />
                5. Zastrzeżenia dotyczące fazy Beta
              </h2>
              <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">CalcReno</h3>
                  <p>
                    Aplikacja CalcReno służy do szacunkowych obliczeń materiałów i kosztów remontowych.
                    W fazie beta mogą występować błędy w kalkulacjach, nieprawidłowe ceny materiałów
                    lub niedokładne szacunki ilościowe. <strong className="text-yellow-400">Wszystkie obliczenia należy traktować
                    jako orientacyjne i weryfikować przed podjęciem decyzji zakupowych.</strong>
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">RenoTimeline</h3>
                  <p>
                    Aplikacja RenoTimeline służy do zarządzania harmonogramami projektów remontowych.
                    W fazie beta mogą występować błędy w synchronizacji danych, nieprawidłowe powiadomienia
                    lub problemy z zapisem zmian. <strong className="text-yellow-400">Zalecamy regularne tworzenie kopii zapasowych
                    ważnych danych projektowych.</strong>
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Ogólne zastrzeżenia</h3>
                  <p>
                    RenoHub nie ponosi odpowiedzialności za straty finansowe, opóźnienia projektów
                    lub inne szkody wynikające z błędów w aplikacjach w fazie beta. Korzystając z platformy,
                    akceptujesz ryzyko związane z używaniem oprogramowania w wersji testowej.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-reno-purple" />
                6. Bezpieczeństwo danych
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony danych:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Szyfrowanie danych podczas transmisji (SSL/TLS)</li>
                  <li>Szyfrowanie haseł przy użyciu bezpiecznych algorytmów</li>
                  <li>Regularne aktualizacje zabezpieczeń</li>
                  <li>Kontrola dostępu do danych</li>
                  <li>Monitorowanie i wykrywanie zagrożeń</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                7. Pliki cookies
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  Nasza platforma wykorzystuje pliki cookies w celu zapewnienia prawidłowego funkcjonowania,
                  analizy ruchu oraz personalizacji treści. Korzystając z RenoHub, wyrażasz zgodę na
                  wykorzystanie plików cookies zgodnie z niniejszą polityką.
                </p>
                <p>
                  Możesz zarządzać ustawieniami cookies w swojej przeglądarce. Wyłączenie niektórych cookies
                  może wpłynąć na funkcjonalność platformy.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-reno-purple" />
                8. Kontakt
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>W przypadku pytań dotyczących polityki prywatności lub przetwarzania danych, skontaktuj się z nami:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li>E-mail: <a href="mailto:privacy@renohub.org" className="text-reno-purple hover:underline">privacy@renohub.org</a></li>
                  <li>E-mail ogólny: <a href="mailto:contact@renohub.org" className="text-reno-purple hover:underline">contact@renohub.org</a></li>
                  <li>Strona: <a href="https://renohub.org" className="text-reno-purple hover:underline">renohub.org</a></li>
                </ul>
              </div>
            </section>

            {/* Changes to Policy */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">
                9. Zmiany w polityce prywatności
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej polityce prywatności.
                  O istotnych zmianach będziemy informować użytkowników drogą elektroniczną lub
                  poprzez komunikat na platformie. Zalecamy regularne sprawdzanie tej strony.
                </p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-reno-purple hover:text-reno-blue transition-colors"
            >
              ← Powrót do strony głównej
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </GradientBackground>
  );
};

export default PrivacyPolicy;
