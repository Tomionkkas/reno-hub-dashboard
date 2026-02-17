
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GSAPCard, GSAPCardContent, GSAPCardDescription, GSAPCardHeader, GSAPCardTitle } from '@/components/animations/GSAPCard';
import { RippleEffect, MagneticEffect } from '@/components/ui/micro-interactions';
import { GradientBackground, ParticleSystem, FloatingOrbs, GlowEffect } from '@/components/ui/visual-enhancements';
import { FloatingElements } from '@/components/ui/professional-polish';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'sonner';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Zalogowano pomyślnie!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('[Login] Login error:', error);

      // Show more specific error messages
      if (error?.message?.includes('Nie można połączyć się z serwerem')) {
        toast.error('Błąd połączenia z serwerem. Sprawdź połączenie internetowe.');
      } else if (error?.message?.includes('Invalid login credentials')) {
        toast.error('Nieprawidłowy email lub hasło.');
      } else if (error?.message) {
        toast.error(`Błąd: ${error.message}`);
      } else {
        toast.error('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out"
        }
      );

      // Animate login card
      gsap.fromTo(
        cardRef.current,
        {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationY: 20
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <GradientBackground
      colors={['from-black', 'via-slate-900', 'to-black']}
      direction="to-br"
      animated={true}
      speed={30}
      className="min-h-screen relative"
    >
      {/* Enhanced Background Effects - Memoized to prevent re-renders */}
      {useMemo(() => (
        <>
          <ParticleSystem count={50} speed={20} size="sm" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
          <FloatingOrbs count={12} size="md" colors={['#00D4FF', '#FF0080', '#7F67FF']} />
          <FloatingElements count={20} elements={['star', 'circle', 'triangle']}>
            <div />
          </FloatingElements>
        </>
      ), [])}

      <section
        ref={sectionRef}
        className="min-h-screen flex items-center justify-center px-4 relative"
        aria-labelledby="login-heading"
      >
        <div className="container mx-auto text-center relative z-10">
          <h1
            ref={titleRef}
            id="login-heading"
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            <span className="gradient-text">RenoHub</span>
          </h1>

          <div ref={cardRef} className="max-w-md mx-auto">
            <RippleEffect>
              <GSAPCard
                className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-2xl hover:shadow-reno-purple/30 transition-all duration-300"
                hover="glow"
                trigger="scroll"
                role="article"
                aria-labelledby="login-form-title"
              >
                <GSAPCardHeader className="text-center">
                  <GSAPCardTitle id="login-form-title" className="text-white text-2xl md:text-3xl mb-2">
                    Zaloguj się
                  </GSAPCardTitle>
                  <GSAPCardDescription className="text-gray-300 text-base">
                    Wprowadź swoje dane aby uzyskać dostęp do konta
                  </GSAPCardDescription>
                </GSAPCardHeader>

                <GSAPCardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 focus:ring-reno-purple/20 transition-all duration-300"
                        placeholder="twoj@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white font-medium">Hasło</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 focus:ring-reno-purple/20 transition-all duration-300"
                        placeholder="Wprowadź hasło"
                      />
                    </div>

                    <LoadingButton
                      type="submit"
                      className="w-full bg-gradient-to-r from-reno-purple to-reno-blue hover:from-reno-blue hover:to-reno-purple text-white font-bold text-lg shadow-2xl hover:shadow-reno-purple/20 border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
                      loading={isLoading}
                      loadingText="Logowanie..."
                    >
                      Zaloguj się
                    </LoadingButton>
                  </form>

                  <div className="mt-8 text-center space-y-3">
                    <p className="text-gray-400">
                      Nie masz konta?{' '}
                      <Link to="/register" className="text-reno-blue hover:text-reno-purple transition-colors font-medium hover-lift">
                        Zarejestruj się
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500">
                      Demo: admin@renohub.com / user@test.com
                    </p>
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>
          </div>
        </div>
      </section>
    </GradientBackground>
  );
};

export default Login;
