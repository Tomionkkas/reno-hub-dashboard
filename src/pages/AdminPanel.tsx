
import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { GSAPCard, GSAPCardContent, GSAPCardDescription, GSAPCardHeader, GSAPCardTitle } from '@/components/animations/GSAPCard';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { RippleEffect } from '@/components/ui/micro-interactions';
import { GradientBackground } from '@/components/ui/visual-enhancements';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, CreditCard, TrendingUp, DollarSign, Download, Crown, UserCheck, Calendar } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
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

      // Simple fade-in for metrics cards
      gsap.fromTo(
        metricsRef.current?.querySelectorAll('.metric-card'),
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

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (!user || user.role !== 'admin') return null;

  // Updated mock data with new subscription model
  const monthlyRevenue = [
    { month: 'Sty', revenue: 15230 },
    { month: 'Lut', revenue: 23450 },
    { month: 'Mar', revenue: 31280 },
    { month: 'Kwi', revenue: 38920 },
    { month: 'Maj', revenue: 42150 },
    { month: 'Cze', revenue: 47230 },
  ];

  const subscriptionDistribution = [
    { name: 'Free', value: 58, color: '#6B7280', users: 724 },
    { name: 'Pro', value: 35, color: '#5A4BFF', users: 436 },
    { name: 'Expert', value: 7, color: '#7F67FF', users: 85 },
  ];

  const appUsage = [
    { name: 'CalcReno', active: 891, total: 1245, percentage: 71.6 },
    { name: 'RenoTimeline', active: 654, total: 1245, percentage: 52.5 },
    { name: 'RenoScout', active: 0, total: 1245, percentage: 0 },
  ];

  const recentSubscriptions = [
    { 
      id: 1, 
      email: 'jan.kowalski@gmail.com', 
      date: '2024-01-15', 
      tier: 'Expert',
      app: 'Wszystkie aplikacje',
      revenue: 200,
      status: 'active'
    },
    { 
      id: 2, 
      email: 'anna.nowak@onet.pl', 
      date: '2024-01-14', 
      tier: 'Pro',
      app: 'CalcReno',
      revenue: 49,
      status: 'active'
    },
    { 
      id: 3, 
      email: 'piotr.wisnia@wp.pl', 
      date: '2024-01-13', 
      tier: 'Pro',
      app: 'RenoTimeline',
      revenue: 49,
      status: 'active'
    },
    { 
      id: 4, 
      email: 'maria.dabrowska@gmail.com', 
      date: '2024-01-12', 
      tier: 'Expert',
      app: 'Wszystkie aplikacje',
      revenue: 200,
      status: 'trial'
    },
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Expert':
        return <Badge className="bg-reno-purple text-white"><Crown className="w-3 h-3 mr-1" />Expert</Badge>;
      case 'Pro':
        return <Badge className="bg-reno-blue text-white">Pro</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Aktywna</Badge>;
      case 'trial':
        return <Badge className="bg-yellow-500 text-white">Trial</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Anulowana</Badge>;
      default:
        return <Badge variant="secondary">Nieznany</Badge>;
    }
  };

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
        aria-labelledby="admin-heading"
      >
        <div className="container mx-auto">
          <div className="mb-12">
            <h1 
              ref={titleRef}
              id="admin-heading" 
              className="text-4xl md:text-5xl font-bold text-white mb-3"
            >
              Panel Administratora
            </h1>
            <p className="text-gray-300 text-lg md:text-xl">Monitoruj wyniki i zarządzaj nowym modelem subskrypcji</p>
          </div>

          {/* Key Metrics Overview */}
          <div ref={metricsRef} className="grid md:grid-cols-4 gap-6 mb-12">
            <RippleEffect>
              <GSAPCard className="metric-card glass-card border-white/10 hover:border-reno-blue/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Łączni użytkownicy</p>
                      <p className="text-3xl font-bold text-white">1,245</p>
                      <p className="text-reno-mint text-sm">+12% vs poprzedni miesiąc</p>
                    </div>
                    <Users className="w-10 h-10 text-reno-blue" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>

            <RippleEffect>
              <GSAPCard className="metric-card glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Płatne subskrypcje</p>
                      <p className="text-3xl font-bold text-white">521</p>
                      <p className="text-reno-mint text-sm">+18% vs poprzedni miesiąc</p>
                    </div>
                    <CreditCard className="w-10 h-10 text-reno-purple" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>

            <RippleEffect>
              <GSAPCard className="metric-card glass-card border-white/10 hover:border-reno-mint/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">MRR (miesięczny przychód)</p>
                      <p className="text-3xl font-bold text-white">47,230 zł</p>
                      <p className="text-reno-mint text-sm">+23% vs poprzedni miesiąc</p>
                    </div>
                    <DollarSign className="w-10 h-10 text-reno-mint" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>

            <RippleEffect>
              <GSAPCard className="metric-card glass-card border-white/10 hover:border-reno-blue/30 hover:shadow-lg transition-all duration-200">
                <GSAPCardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Współczynnik konwersji</p>
                      <p className="text-3xl font-bold text-white">41.8%</p>
                      <p className="text-reno-mint text-sm">+3.2% vs poprzedni miesiąc</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-reno-blue" />
                  </div>
                </GSAPCardContent>
              </GSAPCard>
            </RippleEffect>
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full lg:w-auto grid-cols-4 mb-6 bg-white/10 border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-reno-blue">Przegląd</TabsTrigger>
              <TabsTrigger value="subscriptions" className="text-white data-[state=active]:bg-reno-blue">Subskrypcje</TabsTrigger>
              <TabsTrigger value="apps" className="text-white data-[state=active]:bg-reno-blue">Aplikacje</TabsTrigger>
              <TabsTrigger value="users" className="text-white data-[state=active]:bg-reno-blue">Użytkownicy</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <RippleEffect>
                  <GSAPCard className="glass-card border-white/10 hover:border-reno-blue/30 hover:shadow-lg transition-all duration-200">
                    <GSAPCardHeader>
                      <GSAPCardTitle className="text-white">Miesięczne przychody</GSAPCardTitle>
                      <GSAPCardDescription className="text-gray-300">Wzrost przychodów z nowego modelu subskrypcji</GSAPCardDescription>
                    </GSAPCardHeader>
                    <GSAPCardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            dataKey="revenue" 
                            stroke="#5A4BFF" 
                            strokeWidth={3}
                            dot={{ fill: '#5A4BFF', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </GSAPCardContent>
                  </GSAPCard>
                </RippleEffect>

                <RippleEffect>
                  <GSAPCard className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                    <GSAPCardHeader>
                      <GSAPCardTitle className="text-white">Rozkład subskrypcji</GSAPCardTitle>
                      <GSAPCardDescription className="text-gray-300">Struktura użytkowników według planów</GSAPCardDescription>
                    </GSAPCardHeader>
                    <GSAPCardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={subscriptionDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            dataKey="value"
                          >
                            {subscriptionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-6 mt-4">
                        {subscriptionDistribution.map((plan, index) => (
                          <div key={index} className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-1">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: plan.color }}
                              />
                              <span className="text-gray-300 text-sm font-medium">{plan.name}</span>
                            </div>
                            <p className="text-white text-lg font-bold">{plan.users}</p>
                            <p className="text-gray-400 text-xs">użytkowników</p>
                          </div>
                        ))}
                      </div>
                    </GSAPCardContent>
                  </GSAPCard>
                </RippleEffect>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                {subscriptionDistribution.map((plan, index) => (
                  <RippleEffect key={index}>
                    <GSAPCard className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                      <GSAPCardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {plan.name === 'Expert' && <Crown className="w-5 h-5 text-yellow-500" />}
                            <h3 className="text-white font-semibold text-lg">Plan {plan.name}</h3>
                          </div>
                          <Badge 
                            className={`${plan.name === 'Expert' ? 'bg-reno-purple' : plan.name === 'Pro' ? 'bg-reno-blue' : 'bg-gray-600'} text-white`}
                          >
                            {plan.value}%
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Użytkownicy</span>
                            <span className="text-white font-bold">{plan.users}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Przychód/miesiąc</span>
                            <span className="text-white font-bold">
                              {plan.name === 'Free' ? '0 zł' : 
                               plan.name === 'Pro' ? `${Math.round(plan.users * 49)} zł` : 
                               `${plan.users * 200} zł`}
                            </span>
                          </div>
                        </div>
                      </GSAPCardContent>
                    </GSAPCard>
                  </RippleEffect>
                ))}
              </div>

              <RippleEffect>
                <GSAPCard className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                  <GSAPCardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <GSAPCardTitle className="text-white">Najnowsze subskrypcje</GSAPCardTitle>
                        <GSAPCardDescription className="text-gray-300">Ostatnie zmiany w planach użytkowników</GSAPCardDescription>
                      </div>
                      <EnhancedButton className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                        <Download className="w-4 h-4 mr-2" />
                        Eksportuj
                      </EnhancedButton>
                    </div>
                  </GSAPCardHeader>
                  <GSAPCardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-gray-300">Email</TableHead>
                          <TableHead className="text-gray-300">Data</TableHead>
                          <TableHead className="text-gray-300">Plan</TableHead>
                          <TableHead className="text-gray-300">Aplikacja</TableHead>
                          <TableHead className="text-gray-300">Przychód</TableHead>
                          <TableHead className="text-gray-300">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentSubscriptions.map((sub) => (
                          <TableRow key={sub.id} className="border-white/5 hover:bg-white/5">
                            <TableCell className="text-white">{sub.email}</TableCell>
                            <TableCell className="text-gray-300">{sub.date}</TableCell>
                            <TableCell>{getTierBadge(sub.tier)}</TableCell>
                            <TableCell className="text-gray-300">{sub.app}</TableCell>
                            <TableCell className="text-white font-semibold">{sub.revenue} zł/mies</TableCell>
                            <TableCell>{getStatusBadge(sub.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </GSAPCardContent>
                </GSAPCard>
              </RippleEffect>
            </TabsContent>

            <TabsContent value="apps" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {appUsage.map((app, index) => (
                  <RippleEffect key={index}>
                    <GSAPCard className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                      <GSAPCardHeader>
                        <GSAPCardTitle className="text-white flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-lg flex items-center justify-center shadow-xl border border-cyan-500/40">
                            <OptimizedImage 
                              src={app.name === 'CalcReno' ? '/calcreno-logo-full-transparent.png' : app.name === 'RenoTimeline' ? '/renotimeline-logo-transparent.png' : '/Renoscout logo.png'} 
                              alt={`${app.name} Logo`} 
                              className={`object-contain ${app.name === 'CalcReno' ? 'w-12 h-12 -mt-0.5' : 'w-10 h-10'}`}
                            />
                          </div>
                          {app.name}
                          {app.name === 'RenoScout' && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-200/20 text-blue-500 text-xs font-semibold">Coming soon</span>
                          )}
                        </GSAPCardTitle>
                      </GSAPCardHeader>
                      <GSAPCardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Aktywni użytkownicy</span>
                          <span className="text-white font-bold">{app.active}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Współczynnik użycia</span>
                          <span className="text-reno-mint font-bold">{app.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-reno-blue to-reno-purple h-2 rounded-full transition-all duration-300"
                            style={{ width: `${app.percentage}%` }}
                          />
                        </div>
                      </GSAPCardContent>
                    </GSAPCard>
                  </RippleEffect>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <RippleEffect>
                <GSAPCard className="glass-card border-white/10 hover:border-reno-purple/30 hover:shadow-lg transition-all duration-200">
                  <GSAPCardHeader>
                    <GSAPCardTitle className="text-white">Analiza użytkowników</GSAPCardTitle>
                    <GSAPCardDescription className="text-gray-300">Szczegółowe informacje o aktywności użytkowników</GSAPCardDescription>
                  </GSAPCardHeader>
                  <GSAPCardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <UserCheck className="w-8 h-8 text-reno-blue mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">892</p>
                        <p className="text-gray-400 text-sm">Aktywni dzisiaj</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <Calendar className="w-8 h-8 text-reno-purple mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">156</p>
                        <p className="text-gray-400 text-sm">Nowi w tym tygodniu</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-reno-mint mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">73%</p>
                        <p className="text-gray-400 text-sm">Retention rate</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-lg">
                        <DollarSign className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">91 zł</p>
                        <p className="text-gray-400 text-sm">ARPU</p>
                      </div>
                    </div>
                  </GSAPCardContent>
                </GSAPCard>
              </RippleEffect>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </GradientBackground>
  );
};

export default AdminPanel;
