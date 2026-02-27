import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type PageState = 'loading' | 'form' | 'success' | 'error';

const ResetPassword = () => {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const appParam = searchParams.get('app');

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

    if (!accessToken || type !== 'recovery') {
      setErrorMessage('Link resetowania hasła jest nieprawidłowy lub wygasł.');
      setPageState('error');
      return;
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' })
      .then(({ error }) => {
        if (error) {
          setErrorMessage('Link resetowania hasła wygasł. Poproś o nowy.');
          setPageState('error');
        } else {
          setPageState('form');
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Hasła nie są identyczne.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      console.error('[ResetPassword] updateUser error:', error);
      if (error.message?.includes('different from the old password')) {
        setErrorMessage('Nowe hasło musi być inne niż obecne.');
      } else if (error.message?.includes('session')) {
        setErrorMessage('Sesja wygasła. Poproś o nowy link resetowania hasła.');
      } else {
        setErrorMessage('Nie udało się zmienić hasła. Spróbuj ponownie.');
      }
    } else if (appParam === 'renohub') {
      navigate('/dashboard');
    } else {
      setPageState('success');
    }
  };

  const renderCardContent = () => {
    if (pageState === 'loading') {
      return (
        <div className="text-center py-8">
          <p className="text-gray-300">Weryfikowanie linku...</p>
        </div>
      );
    }

    if (pageState === 'error') {
      return (
        <div className="text-center space-y-4 py-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-red-400">{errorMessage}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-reno-blue hover:text-reno-purple transition-colors text-sm"
          >
            Wróć do logowania
          </button>
        </div>
      );
    }

    if (pageState === 'success') {
      return (
        <div className="text-center space-y-4 py-4">
          <div className="text-4xl">✅</div>
          <h3 className="text-white text-lg font-semibold">Hasło zostało zmienione</h3>
          <p className="text-gray-300 text-sm">
            Możesz teraz zalogować się przy użyciu nowego hasła.
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
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-medium">Nowe hasło</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 focus:ring-reno-purple/20 transition-all duration-300"
            placeholder="Minimum 8 znaków"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white font-medium">Potwierdź hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 focus:ring-reno-purple/20 transition-all duration-300"
            placeholder="Powtórz hasło"
          />
        </div>

        {errorMessage && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}

        <LoadingButton
          type="submit"
          className="w-full bg-gradient-to-r from-reno-purple to-reno-blue hover:from-reno-blue hover:to-reno-purple text-white font-bold text-lg shadow-2xl hover:shadow-reno-purple/20 border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
          loading={isSubmitting}
          loadingText="Zapisywanie..."
        >
          Zmień hasło
        </LoadingButton>
      </form>
    );
  };

  const backgroundEffects = useMemo(() => (
    <>
      <ParticleSystem count={30} speed={20} size="sm" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
      <FloatingOrbs count={6} size="md" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
    </>
  ), []);

  const cardTitle =
    pageState === 'success'
      ? 'Gotowe!'
      : pageState === 'error'
      ? 'Błąd'
      : 'Ustaw nowe hasło';
  const cardDescription =
    pageState === 'loading'
      ? ''
      : pageState === 'error'
      ? 'Wystąpił problem z linkiem resetowania'
      : pageState === 'success'
      ? ''
      : 'Wprowadź nowe hasło dla swojego konta';

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

export default ResetPassword;
