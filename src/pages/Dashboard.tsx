
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, BarChart, CreditCard, DollarSign, Download, Crown, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Update userTier type to include 'expert'
  const userTier: 'free' | 'pro' | 'expert' = user.tier || 'free';
  const projectLimit = userTier === 'free' ? 3 : null;
  const currentProjects = 2; // Mock data

  const apps = [
    {
      id: 'calcreno',
      name: 'CalcReno',
      description: 'Kalkulator materiałów budowlanych',
      icon: '/placeholder.svg',
      status: user.subscriptions?.includes('calcreno') ? 'active' : 'inactive',
      price: '20-40 zł/mies'
    },
    {
      id: 'renotimeline',
      name: 'RenoTimeline',
      description: 'Zarządzanie projektami remontowymi',
      icon: '/placeholder.svg',
      status: user.subscriptions?.includes('renotimeline') ? 'active' : 'inactive',
      price: '20-40 zł/mies'
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-24 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Witaj, {user.email}!
                </h1>
                <p className="text-gray-300 text-lg">Zarządzaj swoimi aplikacjami i subskrypcjami</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${tierInfo.color} text-white`}>
                  {userTier === 'expert' && <Crown className="w-4 h-4 mr-1" />}
                  Plan {tierInfo.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Free Tier Upgrade Prompt */}
          {userTier === 'free' && (
            <Card className="glass-card border-yellow-500/50 bg-yellow-500/10 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">Zwiększ swoje możliwości!</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      Używasz {currentProjects} z {projectLimit} dostępnych projektów. Przejdź na plan Pro lub Expert, aby uzyskać więcej możliwości.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="gradient-bg hover:opacity-90">
                        Pro - od 20 zł/app/mies
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Expert - 200 zł/mies
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Aktywne subskrypcje</p>
                    <p className="text-2xl font-bold text-white">{user.subscriptions?.length || 0}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-reno-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Projekty</p>
                    <p className="text-2xl font-bold text-white">
                      {currentProjects}{userTier === 'free' && `/${projectLimit}`}
                    </p>
                  </div>
                  <Folder className="w-8 h-8 text-reno-purple" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Miesięczny koszt</p>
                    <p className="text-2xl font-bold text-white">
                      {userTier === 'free' ? '0' : userTier === 'pro' ? '20-40' : '200'} zł
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-reno-mint" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Plan</p>
                    <p className="text-xl font-bold text-white">{tierInfo.name}</p>
                  </div>
                  <BarChart className="w-8 h-8 text-reno-blue" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apps Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Moje Aplikacje</h2>
              <div className="space-y-4">
                {apps.map((app) => (
                  <Card key={app.id} className="glass-card border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                            <img 
                              src={app.icon} 
                              alt={`${app.name} Logo`} 
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-white">{app.name}</CardTitle>
                            <CardDescription className="text-gray-300">{app.description}</CardDescription>
                            {app.status === 'inactive' && (
                              <p className="text-sm text-reno-blue font-medium">{app.price}</p>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={app.status === 'active' ? 'default' : 'secondary'}
                          className={app.status === 'active' ? 'bg-reno-mint text-black' : 'bg-gray-600 text-white'}
                        >
                          {app.status === 'active' ? 'Aktywna' : 'Nieaktywna'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {app.status === 'active' ? (
                        <div className="flex gap-2">
                          <Button size="sm" className="gradient-bg hover:opacity-90">
                            <Download className="w-4 h-4 mr-2" />
                            Pobierz
                          </Button>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Otwórz
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" className="gradient-bg hover:opacity-90">
                          Wykup subskrypcję - {app.price}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Subscription Management */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Zarządzanie Subskrypcją</h2>
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Plan {tierInfo.name}
                    {userTier === 'expert' && <Crown className="w-5 h-5 text-yellow-500" />}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {userTier === 'free' 
                      ? 'Podstawowy dostęp z ograniczeniami' 
                      : userTier === 'pro' 
                      ? 'Pełny dostęp do wybranej aplikacji'
                      : 'Dostęp do wszystkich aplikacji i funkcji premium'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          {userTier === 'pro' ? '20-40' : '200'} zł
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
                        <Button className="w-full gradient-bg hover:opacity-90">
                          Plan Pro - od 20 zł/app/mies
                        </Button>
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          Plan Expert - 200 zł/mies
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                        Zmień plan
                      </Button>
                    )}
                    {userTier !== 'free' && (
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        Historia płatności
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
