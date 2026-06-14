import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  GSAPCard,
  GSAPCardContent,
  GSAPCardHeader,
  GSAPCardTitle,
  GSAPCardDescription,
} from '@/components/animations/GSAPCard';
import { GradientBackground, ParticleSystem, FloatingOrbs } from '@/components/ui/visual-enhancements';
import { RippleEffect } from '@/components/ui/micro-interactions';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type PageState = 'loading' | 'success' | 'error' | 'already_confirmed';

interface AppConfig {
  /** Success message. Falls back to a generic "you can log in now" when omitted. */
  message?: string;
  /**
   * Return CTA. Omit entirely for apps with no button (e.g. CalcReno, which has no
   * app-store build yet — a `calcreno://` deep-link button would just dead-end).
   */
  cta?: {
    label: string;
    /** External URL or custom scheme (deep link). */
    href?: string;
    /** Internal SPA route — used for RenoHub itself. */
    internal?: string;
  };
}

// Per-app content for this universal confirmation page. The `?app=` query param
// (set by each app's emailRedirectTo) selects the entry. Add every app that points
// its Supabase confirm/redirect links at www.renohub.org/auth/confirm here.
const APP_CONFIG: Record<string, AppConfig> = {
  renohub: { cta: { label: 'Przejdź do panelu', internal: '/dashboard' } },
  renotimeline: { cta: { label: 'Przejdź do RenoTimeline', href: 'https://www.renotimeline.com' } },
  renoscout: { cta: { label: 'Przejdź do RenoScout', href: 'https://renoscout.pl' } },
  // No button — CalcReno users just return to the mobile app to log in.
  calcreno: { message: 'Twoje konto zostało aktywowane. Wróć do aplikacji CalcReno i zaloguj się.' },
};

const Confirm = () => {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appParam = searchParams.get('app');
  const appConfig = appParam ? APP_CONFIG[appParam] : undefined;
  const confirmedMessage = appConfig?.message ?? 'Twoje konto zostało aktywowane. Możesz teraz się zalogować.';

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.2 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Supabase's detectSessionInUrl processes the URL hash during client initialization
    // and stores the session before this component mounts. Use getSession() to read it.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        setErrorMessage('Link potwierdzający jest nieprawidłowy lub wygasł.');
        setPageState('error');
      } else {
        // Universal confirmation page for every app — show the "done" state and
        // offer a per-app return CTA instead of redirecting to the RenoHub root.
        setPageState('success');
      }
    });
  }, []);

  const backgroundEffects = useMemo(() => (
    <>
      <ParticleSystem count={30} speed={20} size="sm" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
      <FloatingOrbs count={6} size="md" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
    </>
  ), []);

  const renderReturnButton = () => {
    // Known app: render its CTA, or nothing (CalcReno has no button).
    if (appConfig) {
      const cta = appConfig.cta;
      if (!cta) {
        return null;
      }
      return (
        <button
          onClick={() => {
            if (cta.internal) {
              navigate(cta.internal);
            } else if (cta.href) {
              window.location.href = cta.href;
            }
          }}
          className="w-full bg-gradient-to-r from-reno-purple to-reno-blue text-white font-bold py-3 px-6 rounded-lg border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 mt-4"
        >
          {cta.label}
        </button>
      );
    }
    // Unknown / missing app param — fall back to the RenoHub login.
    return (
      <button
        onClick={() => navigate('/login')}
        className="text-reno-blue hover:text-reno-purple transition-colors text-sm"
      >
        Przejdź do logowania
      </button>
    );
  };

  const renderCardContent = () => {
    if (pageState === 'loading') {
      return (
        <div className="text-center py-8">
          <p className="text-gray-300">Weryfikowanie emaila...</p>
        </div>
      );
    }

    if (pageState === 'error') {
      return (
        <div className="text-center space-y-4 py-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-red-400">{errorMessage}</p>
          <p className="text-gray-400 text-sm">
            Spróbuj zarejestrować się ponownie lub skontaktuj się z pomocą techniczną.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-reno-blue hover:text-reno-purple transition-colors text-sm"
          >
            Wróć do logowania
          </button>
        </div>
      );
    }

    if (pageState === 'already_confirmed') {
      return (
        <div className="text-center space-y-4 py-4">
          <div className="text-4xl">✅</div>
          <p className="text-gray-300 text-sm">Twój email był już wcześniej potwierdzony.</p>
          {renderReturnButton()}
        </div>
      );
    }

    // success state
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-4xl">🎉</div>
        <p className="text-gray-300 text-sm">
          {confirmedMessage}
        </p>
        {renderReturnButton()}
      </div>
    );
  };

  const cardTitle =
    pageState === 'loading'
      ? 'Weryfikacja emaila'
      : pageState === 'error'
      ? 'Błąd weryfikacji'
      : pageState === 'already_confirmed'
      ? 'Już potwierdzono'
      : 'Email potwierdzony!';

  const cardDescription =
    pageState === 'loading'
      ? 'Trwa weryfikacja Twojego adresu email...'
      : pageState === 'error'
      ? 'Wystąpił problem z linkiem potwierdzającym'
      : pageState === 'already_confirmed'
      ? 'Twoje konto jest już aktywne.'
      : '';

  return (
    <GradientBackground
      colors={['from-black', 'via-slate-900', 'to-black']}
      direction="to-br"
      animated={true}
      speed={30}
      className="min-h-screen relative"
    >
      {backgroundEffects}

      <section
        ref={sectionRef}
        className="min-h-screen flex items-center justify-center px-4 relative"
      >
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="gradient-text">RenoHub</span>
          </h1>

          <div ref={cardRef} className="max-w-md mx-auto">
            <RippleEffect>
              <GSAPCard
                className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-2xl hover:shadow-reno-purple/30 transition-all duration-300"
                hover="glow"
                trigger="scroll"
              >
                <GSAPCardHeader className="text-center">
                  <GSAPCardTitle className="text-white text-2xl md:text-3xl mb-2">
                    {cardTitle}
                  </GSAPCardTitle>
                  {cardDescription && (
                    <GSAPCardDescription className="text-gray-300 text-base">
                      {cardDescription}
                    </GSAPCardDescription>
                  )}
                </GSAPCardHeader>

                <GSAPCardContent>
                  {renderCardContent()}
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>
          </div>
        </div>
      </section>
    </GradientBackground>
  );
};

export default Confirm;
