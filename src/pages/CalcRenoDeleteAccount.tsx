import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { GradientBackground } from '@/components/ui/visual-enhancements';
import { Trash2, KeyRound, Chrome, Apple, ShieldOff, Mail } from 'lucide-react';

const CalcRenoDeleteAccount = () => (
  <GradientBackground
    colors={['from-black', 'via-slate-900', 'to-black']}
    direction="to-br"
    animated={false}
    className="min-h-screen relative"
  >
    <SEOHead
      title="Usunięcie konta – CalcReno"
      description="Dowiedz się, jak usunąć konto w aplikacji CalcReno. Instrukcja krok po kroku dla kont email oraz Google/Apple."
      keywords="CalcReno, usuń konto, usunięcie konta, RODO, dane użytkownika"
    />

    <Navigation />

    <main className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-reno-purple to-reno-blue mb-6">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Jak usunąć konto w CalcReno
          </h1>
          <p className="text-gray-400 text-sm">
            Usunięcie konta jest trwałe i nieodwracalne. Wszystkie Twoje dane zostaną usunięte.
          </p>
        </div>

        <div className="space-y-6">

          {/* Email + password */}
          <section className="glass-card p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-reno-purple" />
              Konto email + hasło
            </h2>
            <ol className="text-gray-300 text-sm leading-relaxed space-y-2 list-decimal list-inside ml-1">
              <li>Otwórz aplikację <strong className="text-white">CalcReno</strong></li>
              <li>Przejdź do <strong className="text-white">Ustawień</strong> (ikona w prawym górnym rogu ekranu głównego)</li>
              <li>Przewiń do sekcji <strong className="text-white">Konto</strong> i wybierz <strong className="text-white">Usuń konto</strong></li>
              <li>Wprowadź swoje <strong className="text-white">hasło</strong> w celu weryfikacji tożsamości</li>
              <li>Wpisz <strong className="text-white">USUŃ KONTO</strong> w polu potwierdzenia</li>
              <li>Naciśnij przycisk <strong className="text-white">Usuń konto</strong></li>
            </ol>
          </section>

          {/* OAuth */}
          <section className="glass-card p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Chrome className="w-5 h-5 text-reno-purple" />
              Konto Google / Apple (OAuth)
            </h2>
            <ol className="text-gray-300 text-sm leading-relaxed space-y-2 list-decimal list-inside ml-1">
              <li>Otwórz aplikację <strong className="text-white">CalcReno</strong></li>
              <li>Przejdź do <strong className="text-white">Ustawień</strong> (ikona w prawym górnym rogu ekranu głównego)</li>
              <li>Przewiń do sekcji <strong className="text-white">Konto</strong> i wybierz <strong className="text-white">Usuń konto</strong></li>
              <li>
                Naciśnij <strong className="text-white">Zaloguj się przez Google</strong> lub{' '}
                <strong className="text-white">Zaloguj się przez Apple</strong> — zostaniesz poproszony
                o potwierdzenie tożsamości przez swojego dostawcę
              </li>
              <li>Wpisz <strong className="text-white">USUŃ KONTO</strong> w polu potwierdzenia</li>
              <li>Naciśnij przycisk <strong className="text-white">Usuń konto</strong></li>
            </ol>
          </section>

          {/* What gets deleted */}
          <section className="glass-card p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <ShieldOff className="w-5 h-5 text-reno-purple" />
              Co zostaje usunięte
            </h2>
            <p className="text-gray-300 text-sm mb-3">Po potwierdzeniu trwale usuwamy:</p>
            <ul className="text-gray-300 text-sm leading-relaxed space-y-2 list-disc list-inside ml-1">
              <li>Wszystkie Twoje projekty remontowe</li>
              <li>Wszystkie pomieszczenia i wyceny materiałów</li>
              <li>Profil konta i dane osobowe</li>
              <li>Dane logowania</li>
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              Żadne dane nie są zachowywane po usunięciu konta.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-card p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-reno-purple" />
              Nie możesz się zalogować?
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Jeśli nie możesz zalogować się do aplikacji i chcesz usunąć konto, skontaktuj się z nami:{' '}
              <a href="mailto:contact@renohub.org" className="text-reno-purple hover:underline">
                contact@renohub.org
              </a>
            </p>
          </section>

        </div>

        <div className="text-center mt-12">
          <a href="/" className="inline-flex items-center gap-2 text-reno-purple hover:text-reno-blue transition-colors">
            ← Powrót do strony głównej
          </a>
        </div>
      </div>
    </main>

    <Footer />
  </GradientBackground>
);

export default CalcRenoDeleteAccount;
