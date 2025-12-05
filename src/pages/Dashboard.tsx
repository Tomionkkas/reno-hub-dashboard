
import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserApps } from '@/hooks/use-user-apps';
import Navigation from '@/components/Navigation';
import { GSAPCard, GSAPCardContent, GSAPCardDescription, GSAPCardHeader, GSAPCardTitle } from '@/components/animations/GSAPCard';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { RippleEffect, MagneticEffect } from '@/components/ui/micro-interactions';
import { GradientBackground, ParticleSystem, FloatingOrbs, GlowEffect } from '@/components/ui/visual-enhancements';
import { FloatingElements } from '@/components/ui/professional-polish';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Folder, BarChart, CreditCard, DollarSign, Download, Crown, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple fade-in animation for better usability
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );

      // Simple fade-in for stats cards
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-card'),
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2
        }
      );

      // Simple fade-in for app cards
      gsap.fromTo(
        appsRef.current?.querySelectorAll('.app-card'),
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.4
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { apps, allApps, isLoading: appsLoading, error: appsError } = useUserApps();

  if (!user) return null;

  // Update userTier type to include 'expert'
  const userTier: 'free' | 'pro' | 'expert' = user.tier || 'free';
  const projectLimit = userTier === 'free' ? 3 : null;
  
  // Calculate current projects from actual app data
  const currentProjects = allApps.reduce((sum, app) => sum + app.projectCount, 0);
  
  // Calculate active subscriptions count
  const activeSubscriptions = allApps.filter(app => app.status === 'active').length;

  const getTierInfo = () => {
    switch (userTier) {
      case 'free':
        return {
          name: 'Free',
          color: 'bg-gray-600',
          features: ['Podstawowe funkcje', 'Maksymalnie 3 projekty', 'Ograniczone eksporty']
        };
      case 'pro':
        return {
          name: 'Pro',
          color: 'bg-reno-blue',
          features: ['Pełen dostęp do aplikacji', 'Nielimitowane projekty', 'Eksport PDF/Excel']
        };
      case 'expert':
        return {
          name: 'Expert',
          color: 'bg-reno-purple',
          features: ['Wszystkie aplikacje', 'Wsparcie zespołu 2-3 osoby', 'Premium support', 'Wczesny dostęp']
        };
      default:
        return { name: 'Free', color: 'bg-gray-600', features: [] };
    }
  };

  const tierInfo = getTierInfo();

  return (
    <GradientBackground 
      colors={['from-black', 'via-slate-900', 'to-black']} 
      direction="to-br" 
      animated={true}
      speed={30}
      className="min-h-screen relative"
    >
      {/* Subtle background effects for better usability */}
      {useMemo(() => (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900/50 to-black opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </>
      ), [])}

      <Navigation />
      
      <section 
        ref={sectionRef}
        className="pt-24 px-4 relative"
        aria-labelledby="dashboard-heading"
      >
        <div className="container mx-auto">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 
                  ref={titleRef}
                  id="dashboard-heading" 
                  className="text-4xl md:text-5xl font-bold text-white mb-3"
                >
                  Witaj, {user.email}!
                </h1>
                <p className="text-gray-300 text-lg md:text-xl">Zarządzaj swoimi aplikacjami i subskrypcjami</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${tierInfo.color} text-white border-2 border-white/20`}>
                  {userTier === 'expert' && <Crown className="w-4 h-4 mr-1" />}
                  Plan {tierInfo.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning for mock auth users */}
          {user && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) && currentProjects === 0 && (
            <RippleEffect>
              <GSAPCard className="glass-card border-red-500/50 bg-red-500/10 mb-8 hover:border-red-400/60 transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">Uwaga: Używasz mock autoryzacji</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        Twoje projekty są powiązane z kontem Supabase. Zaloguj się przez Supabase Authentication, aby zobaczyć swoje projekty. Obecny ID użytkownika ({user.id}) nie pasuje do ID w bazie danych.
                      </p>
                    </div>
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>
          )}

          {/* Free Tier Upgrade Prompt */}
          {userTier === 'free' && (
                          <RippleEffect>
                <GSAPCard className="glass-card border-yellow-500/50 bg-yellow-500/10 mb-8 hover:border-yellow-400/60 transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">Zwiększ swoje możliwości!</h3>
                      <p className="text-gray-300 text-sm mb-3">
                        {projectLimit 
                          ? `Używasz ${currentProjects} z ${projectLimit} dostępnych projektów. Przejdź na plan Pro lub Expert, aby uzyskać więcej możliwości.`
                          : `Masz ${currentProjects} projektów.`}
                      </p>
                      <div className="flex gap-2">
                        <EnhancedButton size="sm" className="gradient-bg hover:opacity-90">
                          Pro - 49 zł/app/mies
                        </EnhancedButton>
                        <EnhancedButton size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Expert - 200 zł/mies
                        </EnhancedButton>
                      </div>
                    </div>
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>
          )}

          {/* Quick Stats */}
          <div ref={statsRef} className="grid md:grid-cols-4 gap-6 mb-12">
            <RippleEffect>
              <GSAPCard className="stat-card glass-card border-white/10 hover:border-reno-blue/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Aktywne subskrypcje</p>
                      <p className="text-2xl font-bold text-white">{activeSubscriptions}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-reno-blue" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>

            <RippleEffect>
              <GSAPCard className="stat-card glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Projekty</p>
                      <p className="text-2xl font-bold text-white">
                        {currentProjects}{userTier === 'free' && `/${projectLimit}`}
                      </p>
                    </div>
                    <Folder className="w-8 h-8 text-reno-purple" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>

            <RippleEffect>
              <GSAPCard className="stat-card glass-card border-white/10 hover:border-reno-mint/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Miesięczny koszt</p>
                      <p className="text-2xl font-bold text-white">
                        {userTier === 'free' ? '0' : userTier === 'pro' ? '49' : '200'} zł
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-reno-mint" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>

            <RippleEffect>
              <GSAPCard className="stat-card glass-card border-white/10 hover:border-reno-blue/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Plan</p>
                      <p className="text-xl font-bold text-white">{tierInfo.name}</p>
                    </div>
                    <BarChart className="w-8 h-8 text-reno-blue" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>
          </div>

          {/* Apps Section */}
          <div ref={appsRef} className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Moje Aplikacje</h2>
              {appsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card border-white/10 p-6 animate-pulse">
                      <div className="h-20 bg-gray-700/50 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : appsError ? (
                <div className="glass-card border-red-500/50 p-6">
                  <p className="text-red-400">Błąd podczas ładowania aplikacji. Spróbuj odświeżyć stronę.</p>
                </div>
              ) : apps.length === 0 ? (
                <div className="glass-card border-white/10 p-6">
                  <p className="text-gray-400">Nie masz jeszcze żadnych aplikacji. Utwórz projekt, aby rozpocząć.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apps.map((app) => (
                  <RippleEffect key={app.id}>
                    <GSAPCard className="app-card glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                      <GSAPCardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl flex items-center justify-center shadow-xl border border-cyan-500/40">
                              <OptimizedImage 
                                src={app.icon} 
                                alt={`${app.name} Logo`} 
                                className={`object-contain ${app.name === 'CalcReno' ? 'w-14 h-14 -mt-0.5' : 'w-12 h-12'}`}
                              />
                            </div>
                            <div>
                              <GSAPCardTitle className="text-white">{app.name}</GSAPCardTitle>
                              <GSAPCardDescription className="text-gray-300">{app.description}</GSAPCardDescription>
                              {app.projectCount > 0 && (
                                <p className="text-sm text-gray-400 mt-1">
                                  {app.projectCount} {app.projectCount === 1 ? 'projekt' : app.projectCount < 5 ? 'projekty' : 'projektów'}
                                </p>
                              )}
                              {app.status === 'inactive' && (
                                <p className="text-sm text-reno-blue font-medium">{app.price}</p>
                              )}
                              {app.status === 'coming_soon' && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-200/20 text-blue-500 text-xs font-semibold animate-glow-pulse">Wkrótce</span>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={app.status === 'active' ? 'default' : app.status === 'limited' ? 'secondary' : 'secondary'}
                            className={
                              app.status === 'active' 
                                ? 'bg-reno-mint text-black' 
                                : app.status === 'limited'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : app.status === 'coming_soon'
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                : 'bg-gray-600 text-white'
                            }
                          >
                            {app.status === 'active' 
                              ? 'Aktywna' 
                              : app.status === 'limited'
                              ? 'Ograniczona'
                              : app.status === 'coming_soon' 
                              ? 'Wkrótce' 
                              : 'Nieaktywna'}
                          </Badge>
                        </div>
                      </GSAPCardHeader>
                      <GSAPCardContent>
                        {app.status === 'active' ? (
                          <div className="flex gap-2">
                            <EnhancedButton size="sm" className="gradient-bg hover:opacity-90">
                              <Download className="w-4 h-4 mr-2" />
                              Pobierz
                            </EnhancedButton>
                            <EnhancedButton size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              Otwórz
                            </EnhancedButton>
                          </div>
                        ) : app.status === 'limited' ? (
                          <div className="flex gap-2">
                            <EnhancedButton size="sm" variant="outline" className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10">
                              <Download className="w-4 h-4 mr-2" />
                              Eksportuj tylko
                            </EnhancedButton>
                            <EnhancedButton size="sm" className="gradient-bg hover:opacity-90">
                              Wykup subskrypcję
                            </EnhancedButton>
                          </div>
                        ) : app.status === 'coming_soon' ? (
                          <EnhancedButton size="sm" variant="outline" className="border-blue-400/40 text-blue-400 cursor-not-allowed opacity-70">
                            Wkrótce dostępne
                          </EnhancedButton>
                        ) : (
                          <EnhancedButton size="sm" className="gradient-bg hover:opacity-90">
                            Wykup subskrypcję - {app.price}
                          </EnhancedButton>
                        )}
                      </GSAPCardContent>
                    </GSAPCard>
                  </RippleEffect>
                  ))}
                </div>
              )}
            </div>

            {/* Subscription Management */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Zarządzanie Subskrypcją</h2>
              <RippleEffect>
                <GSAPCard className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                  <GSAPCardHeader>
                    <GSAPCardTitle className="text-white flex items-center gap-2">
                      Plan {tierInfo.name}
                      {userTier === 'expert' && <Crown className="w-5 h-5 text-yellow-500" />}
                    </GSAPCardTitle>
                    <GSAPCardDescription className="text-gray-300">
                      {userTier === 'free' 
                        ? 'Podstawowy dostęp z ograniczeniami' 
                        : userTier === 'pro' 
                        ? 'Pełny dostęp do wybranej aplikacji'
                        : 'Dostęp do wszystkich aplikacji i funkcji premium'
                      }
                    </GSAPCardDescription>
                  </GSAPCardHeader>
                  <GSAPCardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Twoje korzyści:</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {tierInfo.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-reno-mint rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {userTier !== 'free' && (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Miesięczna opłata</span>
                          <span className="text-white font-semibold">
                            {userTier === 'pro' ? '49' : '200'} zł
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Następna płatność</span>
                          <span className="text-white font-semibold">15.02.2024</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Status</span>
                          <Badge className="bg-reno-mint text-black">Aktywna</Badge>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-4 space-y-2">
                      {userTier === 'free' ? (
                        <div className="space-y-2">
                          <EnhancedButton className="w-full gradient-bg hover:opacity-90">
                            Plan Pro - 49 zł/app/mies
                          </EnhancedButton>
                          <EnhancedButton variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                            Plan Expert - 200 zł/mies
                          </EnhancedButton>
                        </div>
                      ) : (
                        <EnhancedButton className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                          Zmień plan
                        </EnhancedButton>
                      )}
                      {userTier !== 'free' && (
                        <EnhancedButton variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          Historia płatności
                        </EnhancedButton>
                      )}
                    </div>
                  </GSAPCardContent>
                </GSAPCard>
              </RippleEffect>
            </div>
          </div>
        </div>
      </section>
    </GradientBackground>
  );
};

export default Dashboard;
