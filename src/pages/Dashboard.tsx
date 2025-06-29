
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, BarChart, CreditCard, DollarSign, Download } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const apps = [
    {
      id: 'calcreno',
      name: 'CalcReno',
      description: 'Kalkulator materiałów budowlanych',
      icon: Folder,
      status: user.subscriptions?.includes('calcreno') ? 'active' : 'inactive'
    },
    {
      id: 'renotimeline',
      name: 'RenoTimeline',
      description: 'Zarządzanie projektami remontowymi',
      icon: BarChart,
      status: user.subscriptions?.includes('renotimeline') ? 'active' : 'inactive'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-24 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Witaj, {user.email}!
            </h1>
            <p className="text-gray-300 text-lg">Zarządzaj swoimi aplikacjami i subskrypcjami</p>
          </div>

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
                    <p className="text-gray-400 text-sm">Dostępne aplikacje</p>
                    <p className="text-2xl font-bold text-white">2</p>
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
                    <p className="text-2xl font-bold text-white">59 zł</p>
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
                    <p className="text-2xl font-bold text-white">Premium</p>
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
                            <app.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{app.name}</CardTitle>
                            <CardDescription className="text-gray-300">{app.description}</CardDescription>
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
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Wykup subskrypcję
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
                  <CardTitle className="text-white">Plan Premium</CardTitle>
                  <CardDescription className="text-gray-300">
                    Dostęp do wszystkich aplikacji i funkcji premium
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Miesięczna opłata</span>
                    <span className="text-white font-semibold">59 zł</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Następna płatność</span>
                    <span className="text-white font-semibold">15.02.2024</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Status</span>
                    <Badge className="bg-reno-mint text-black">Aktywna</Badge>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                      Zmień plan
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      Historia płatności
                    </Button>
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
