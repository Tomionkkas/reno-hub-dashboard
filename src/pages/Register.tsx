
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

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, firstName, lastName);
      toast.success('Konto zostało utworzone pomyślnie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Błąd podczas rejestracji. Spróbuj ponownie.');
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

      // Animate register card
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
        aria-labelledby="register-heading"
      >
        <div className="container mx-auto text-center relative z-10">
          <h1 
            ref={titleRef}
            id="register-heading" 
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
                aria-labelledby="register-form-title"
              >
                  <GSAPCardHeader className="text-center">
                    <GSAPCardTitle id="register-form-title" className="text-white text-2xl md:text-3xl mb-2">
                      Utwórz konto
                    </GSAPCardTitle>
                    <GSAPCardDescription className="text-gray-300 text-base">
                      Zarejestruj się aby uzyskać dostęp do aplikacji
                    </GSAPCardDescription>
                  </GSAPCardHeader>
                  
                  <GSAPCardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-white font-medium">Imię</Label>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 focus:ring-reno-purple/20 transition-all duration-300"
                            placeholder="Jan"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white font-medium">Nazwisko</Label>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 focus:ring-reno-purple/20 transition-all duration-300"
                            placeholder="Kowalski"
                          />
                        </div>
                      </div>

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
                      
                      <LoadingButton
                        type="submit"
                        className="w-full bg-gradient-to-r from-reno-purple to-reno-blue hover:from-reno-blue hover:to-reno-purple text-white font-bold text-lg shadow-2xl hover:shadow-reno-purple/20 border-2 border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300"
                        loading={isLoading}
                        loadingText="Tworzę konto..."
                      >
                        Utwórz konto
                      </LoadingButton>
                    </form>
                    
                    <div className="mt-8 text-center space-y-3">
                      <p className="text-gray-400">
                        Masz już konto?{' '}
                        <Link to="/login" className="text-reno-blue hover:text-reno-purple transition-colors font-medium hover-lift">
                          Zaloguj się
                        </Link>
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

export default Register;
