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

const Confirm = () => {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appParam = searchParams.get('app');

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
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (!accessToken) {
      setErrorMessage('Link potwierdzający jest nieprawidłowy.');
      setPageState('error');
      return;
    }

    if (type !== 'signup') {
      setErrorMessage('Nieprawidłowy typ linku.');
      setPageState('error');
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' })
      .then(({ error }) => {
        if (error) {
          if (error.message.toLowerCase().includes('already')) {
            setPageState('already_confirmed');
          } else {
            setErrorMessage('Link potwierdzający wygasł lub jest nieprawidłowy.');
            setPageState('error');
          }
        } else {
          if (appParam === 'renohub') {
            navigate('/dashboard');
          } else {
            setPageState('success');
          }
        }
      });
  }, []);

  const backgroundEffects = useMemo(() => (
    <>
      <ParticleSystem count={30} speed={20} size="sm" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
      <FloatingOrbs count={6} size="md" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
    </>
  ), []);

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
        </div>
      );
    }

    if (pageState === 'already_confirmed') {
      return (
        <div className="text-center space-y-4 py-4">
          <div className="text-4xl">✅</div>
          <p className="text-gray-300 text-sm">Twój email był już wcześniej potwierdzony.</p>
          {appParam === 'calcreno' && (
            <button
              onClick={() => { window.location.href = 'calcreno://'; }}
              className="w-full bg-gradient-to-r from-reno-purple to-reno-blue text-white font-bold py-3 px-6 rounded-lg border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 mt-4"
            >
              Otwórz CalcReno
            </button>
          )}
          {(!appParam || appParam === 'renohub') && (
            <button
              onClick={() => navigate('/login')}
              className="text-reno-blue hover:text-reno-purple transition-colors text-sm"
            >
              Przejdź do logowania
            </button>
          )}
        </div>
      );
    }

    // success state
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-4xl">🎉</div>
        <p className="text-gray-300 text-sm">
          Twoje konto zostało aktywowane. Możesz teraz się zalogować.
        </p>
        {appParam === 'calcreno' && (
          <button
            onClick={() => { window.location.href = 'calcreno://'; }}
            className="w-full bg-gradient-to-r from-reno-purple to-reno-blue text-white font-bold py-3 px-6 rounded-lg border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 mt-4"
          >
            Otwórz CalcReno
          </button>
        )}
        {(!appParam || appParam === 'renohub') && (
          <button
            onClick={() => navigate('/login')}
            className="text-reno-blue hover:text-reno-purple transition-colors text-sm"
          >
            Przejdź do logowania
          </button>
        )}
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
      : 'Witaj w RenoHub!';

  const cardDescription =
    pageState === 'loading'
      ? 'Trwa weryfikacja Twojego adresu email...'
      : pageState === 'error'
      ? 'Wystąpił problem z linkiem potwierdzającym'
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
