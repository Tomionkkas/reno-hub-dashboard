import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { GradientBackground } from '@/components/ui/visual-enhancements';
import { FileText, CreditCard, DollarSign, Smartphone, AlertTriangle, Mail } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <GradientBackground
      colors={['from-black', 'via-slate-900', 'to-black']}
      direction="to-br"
      animated={false}
      className="min-h-screen relative"
    >
      <SEOHead
        title="Warunki Użytkowania - RenoHub"
        description="Warunki użytkowania aplikacji CalcReno i platformy RenoHub. Dowiedz się o subskrypcjach, płatnościach i zasadach korzystania."
        keywords="warunki użytkowania, regulamin, CalcReno, RenoHub, subskrypcja, App Store"
      />

      <Navigation />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-reno-purple to-reno-blue mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Warunki Użytkowania
            </h1>
            <p className="text-gray-400">
              Ostatnia aktualizacja: 18 maja 2026
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Akceptacja */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-reno-purple" />
                1. Akceptacja
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed">
                <p>
                  Pobierając lub korzystając z aplikacji <strong className="text-white">CalcReno</strong>, akceptujesz
                  niniejsze Warunki Użytkowania. Jeśli nie zgadzasz się z tymi warunkami, prosimy o nieinstalowanie
                  ani niekorzystanie z aplikacji.
                </p>
              </div>
            </section>

            {/* Subskrypcja */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-reno-purple" />
                2. Subskrypcja
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  CalcReno oferuje subskrypcje z automatycznym odnowieniem. Subskrypcja zostanie automatycznie
                  odnowiona, chyba że zostanie anulowana co najmniej{' '}
                  <strong className="text-white">24 godziny przed końcem bieżącego okresu</strong>.
                </p>
                <p>
                  Możesz zarządzać subskrypcją i ją anulować w dowolnym momencie w{' '}
                  <strong className="text-white">ustawieniach konta App Store</strong>. Anulowanie wchodzi
                  w życie z końcem bieżącego okresu rozliczeniowego — do tego czasu zachowujesz pełny dostęp.
                </p>
              </div>
            </section>

            {/* Płatności */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-reno-purple" />
                3. Płatności
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  Opłata zostanie naliczona na <strong className="text-white">konto Apple ID</strong> w momencie
                  potwierdzenia zakupu. Ceny są wyświetlane w aplikacji i mogą się różnić w zależności od regionu.
                </p>
                <p>
                  Całość rozliczeń i przetwarzania płatności odbywa się za pośrednictwem Apple przez App Store.
                  RenoHub nie przechowuje danych płatniczych użytkownika.
                </p>
              </div>
            </section>

            {/* Korzystanie z aplikacji */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-reno-purple" />
                4. Korzystanie z aplikacji
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  Możesz korzystać z CalcReno wyłącznie w celach <strong className="text-white">osobistych, niekomercyjnych</strong>,
                  związanych z planowaniem remontów. Zabrania się:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kopiowania, modyfikowania lub rozpowszechniania jakiejkolwiek części aplikacji</li>
                  <li>Inżynierii wstecznej ani prób wyodrębnienia kodu źródłowego</li>
                  <li>Korzystania z aplikacji w celach niezgodnych z prawem</li>
                  <li>Zakłócania prawidłowego działania aplikacji lub jej serwerów</li>
                </ul>
              </div>
            </section>

            {/* Zastrzeżenie */}
            <section className="glass-card p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                5. Zastrzeżenie odpowiedzialności
              </h2>
              <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                <p>
                  CalcReno dostarcza wyłącznie <strong className="text-yellow-400">szacunkowe obliczenia</strong>.
                  Wszystkie wyliczenia, ilości materiałów i kosztorysy mają charakter orientacyjny i służą
                  jedynie celom planistycznym.
                </p>
                <p>
                  Nie ponosimy <strong className="text-white">żadnej odpowiedzialności</strong> za decyzje —
                  finansowe, kontraktowe ani inne — podjęte na podstawie obliczeń dostarczonych przez aplikację.
                  Przed przystąpieniem do prac remontowych zawsze weryfikuj szacunki z wykwalifikowanymi specjalistami.
                </p>
              </div>
            </section>

            {/* Kontakt */}
            <section className="glass-card p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-reno-purple" />
                6. Kontakt
              </h2>
              <div className="text-gray-300 text-sm leading-relaxed">
                <p>W przypadku pytań dotyczących niniejszych Warunków Użytkowania skontaktuj się z nami:</p>
                <ul className="list-none space-y-2 ml-4 mt-3">
                  <li>
                    E-mail:{' '}
                    <a href="mailto:airize.technologies@gmail.com" className="text-reno-purple hover:underline">
                      airize.technologies@gmail.com
                    </a>
                  </li>
                  <li>
                    Strona:{' '}
                    <a href="https://renohub.org" className="text-reno-purple hover:underline">
                      renohub.org
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* Powrót do strony głównej */}
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

export default TermsOfUse;
