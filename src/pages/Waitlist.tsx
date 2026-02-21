import { useState } from 'react';
import { Bell, Zap, Shield, Lock, Calculator, ClipboardList, PackageCheck, Play } from 'lucide-react';
import { DemoModal } from '@/components/ui/DemoModal';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import { SEOHead } from '@/components/ui/seo-head';
import { GradientBackground } from '@/components/ui/visual-enhancements';
import { AppShowcaseStrip } from '@/components/sections/AppShowcaseStrip';
import { supabase } from '@/integrations/supabase/client';

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

const features = [
  {
    icon: <Calculator className="w-5 h-5 text-cyan-400" />,
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Precyzyjne obliczenia',
    description: 'Oblicz dokładne ilości materiałów budowlanych — farby, płytki, panele, gips i więcej — bez żadnych pomyłek.',
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-purple-400" />,
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Zarządzanie projektami',
    description: 'Twórz wiele projektów, zapisuj obliczenia i wracaj do nich w każdej chwili. Wszystko w jednej aplikacji.',
  },
  {
    icon: <PackageCheck className="w-5 h-5 text-emerald-400" />,
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Gotowe listy zakupów',
    description: 'Generuj gotowe listy zakupów z ilościami i jednostkami. Udostępniaj je wykonawcom lub jedź od razu do sklepu.',
  },
];

const steps = [
  { number: '01', title: 'Zapisz się', description: 'Podaj imię i e-mail poniżej. Zajmuje to 30 sekund.' },
  { number: '02', title: 'Dostań powiadomienie', description: 'Poinformujemy Cię e-mailem, gdy beta będzie gotowa.' },
  { number: '03', title: 'Uzyskaj wczesny dostęp', description: 'Jako pierwszy przetestujesz aplikację i wpłyniesz na jej rozwój.' },
];

export default function WaitlistPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setFormState('loading');
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { firstName: firstName.trim(), email: email.trim() },
      });

      if (error) throw new Error(error.message);

      if (data?.alreadySubscribed) {
        setFormState('duplicate');
      } else {
        setFormState('success');
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17946979757/yGBiCICctvwbEK3b5O1C',
          });
          window.gtag('event', 'waitlist_signup', {
            app: 'calcreno',
          });
        }
      }
    } catch {
      setErrorMsg('Coś poszło nie tak. Spróbuj ponownie.');
      setFormState('error');
    }
  };

  return (
    <GradientBackground
      colors={['from-black', 'via-slate-900', 'to-black']}
      direction="to-br"
      animated={false}
      className="min-h-screen relative"
    >
      <SEOHead
        title="Dołącz do listy oczekujących – CalcReno | RenoHub"
        description="CalcReno — mobilny kalkulator materiałów budowlanych — jest w przygotowaniu. Zapisz się i bądź pierwszym, który dowie się o starcie."
        keywords="CalcReno, kalkulator budowlany, lista oczekujących, wczesny dostęp, beta"
      />

      <Navigation />

      <main className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* ── Desktop: 2-col hero | Mobile: single col ── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">

            {/* Left: form content */}
            <div>
              {/* Logo */}
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-2xl" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-900 via-[#0c3050] to-cyan-800 rounded-2xl flex items-center justify-center shadow-2xl border border-cyan-500/40">
                    <img
                      src="/calcreno-logo-full-transparent.webp"
                      alt="CalcReno"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="text-center lg:text-left mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Bądź <span className="text-cyan-400">pierwszym!</span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                  CalcReno jest w drodze. Zapisz się i dostań dostęp, zanim aplikacja trafi do wszystkich.
                </p>
              </div>

              {/* Benefit chips */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-medium text-cyan-400">
                  <Bell className="w-3 h-3" /> Beta powiadomienia
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-medium text-purple-400">
                  <Zap className="w-3 h-3" /> Wczesny dostęp
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                  <Shield className="w-3 h-3" /> Zero spamu
                </span>
                {/* Mobile-only demo trigger */}
                <button
                  onClick={() => setShowDemo(true)}
                  className="lg:hidden relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-900/40 hover:from-indigo-400 hover:to-purple-400 transition-all duration-200 demo-glow"
                >
                  <Play className="w-3 h-3 fill-white" /> Zobacz Demo
                </button>
              </div>

              {/* Form card */}
              <div className="bg-[#0b1120] border border-cyan-500/25 rounded-2xl p-6 sm:p-8">

                {/* Success */}
                {formState === 'success' && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 mb-5">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-white font-bold text-xl mb-1.5">Jesteś na liście, {firstName}.</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Gdy CalcReno będzie gotowe — będziesz jednym z pierwszych, który to zobaczy.
                    </p>
                  </div>
                )}

                {/* Duplicate */}
                {formState === 'duplicate' && (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 mb-5">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <p className="text-white font-bold text-lg mb-1.5">Już jesteś na liście!</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Ten adres jest już zarejestrowany. Damy Ci znać przy starcie.
                    </p>
                  </div>
                )}

                {/* Form */}
                {(formState === 'idle' || formState === 'loading' || formState === 'error') && (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-2">
                        Imię
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="np. Marcin"
                        required
                        disabled={formState === 'loading'}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all duration-200 disabled:opacity-50 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-2">
                        Adres e-mail
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="np. marcin@example.com"
                        required
                        disabled={formState === 'loading'}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all duration-200 disabled:opacity-50 text-base"
                      />
                    </div>

                    {formState === 'error' && (
                      <p className="text-red-400 text-sm">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'loading' || !firstName.trim() || !email.trim()}
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-40 transition-all duration-200 shadow-lg shadow-cyan-900/40"
                    >
                      {formState === 'loading' ? (
                        <>
                          <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Zapisywanie...
                        </>
                      ) : (
                        <>
                          Zapisz mnie na listę
                          <span className="transition-transform duration-200 group-hover:translate-x-1 inline-block">→</span>
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600 pt-1">
                      <Lock className="w-3 h-3" /> Bez spamu. Tylko ważne info. Rezygnacja w każdej chwili.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Right: app showcase — desktop only */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="w-full">
                <AppShowcaseStrip tabs={['calcreno']} />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

          {/* ── Desktop: features + steps side by side | Mobile: stacked ── */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Features */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white text-center lg:text-left mb-6">
                Co zyskujesz z CalcReno?
              </h2>
              <div className="space-y-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-cyan-500/25 transition-colors"
                  >
                    <div className={`flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl border ${f.iconBg}`}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white text-center lg:text-left mb-6">
                Jak to działa?
              </h2>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div key={step.number} className="flex items-start gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-900/40">
                      {step.number}
                    </div>
                    <div className="pt-1.5">
                      <h3 className="text-white font-semibold mb-0.5">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
      <DemoModal open={showDemo} onClose={() => setShowDemo(false)} />
    </GradientBackground>
  );
}
