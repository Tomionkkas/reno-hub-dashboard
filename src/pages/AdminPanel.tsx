
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, CreditCard, TrendingUp, DollarSign, Download } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  // Mock data for charts
  const monthlyUsers = [
    { month: 'Sty', users: 120 },
    { month: 'Lut', users: 180 },
    { month: 'Mar', users: 240 },
    { month: 'Kwi', users: 300 },
    { month: 'Maj', users: 380 },
    { month: 'Cze', users: 450 },
  ];

  const appPopularity = [
    { name: 'CalcReno', value: 65, color: '#5A4BFF' },
    { name: 'RenoTimeline', value: 35, color: '#7F67FF' },
  ];

  const recentUsers = [
    { id: 1, email: 'jan.kowalski@gmail.com', date: '2024-01-15', plan: 'Premium' },
    { id: 2, email: 'anna.nowak@onet.pl', date: '2024-01-14', plan: 'Basic' },
    { id: 3, email: 'piotr.wisnia@wp.pl', date: '2024-01-13', plan: 'Enterprise' },
    { id: 4, email: 'maria.dabrowska@gmail.com', date: '2024-01-12', plan: 'Premium' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="pt-24 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Panel Administratora</h1>
            <p className="text-gray-300 text-lg">Monitoruj wyniki i zarządzaj platformą</p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Aktywni użytkownicy</p>
                    <p className="text-3xl font-bold text-white">1,245</p>
                    <p className="text-reno-mint text-sm">+12% vs poprzedni miesiąc</p>
                  </div>
                  <Users className="w-10 h-10 text-reno-blue" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Aktywne subskrypcje</p>
                    <p className="text-3xl font-bold text-white">892</p>
                    <p className="text-reno-mint text-sm">+8% vs poprzedni miesiąc</p>
                  </div>
                  <CreditCard className="w-10 h-10 text-reno-purple" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">MRR (miesięczny przychód)</p>
                    <p className="text-3xl font-bold text-white">47,230 zł</p>
                    <p className="text-reno-mint text-sm">+15% vs poprzedni miesiąc</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-reno-mint" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Współczynnik konwersji</p>
                    <p className="text-3xl font-bold text-white">12.4%</p>
                    <p className="text-reno-mint text-sm">+2.1% vs poprzedni miesiąc</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-reno-blue" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Aktywni użytkownicy (miesięcznie)</CardTitle>
                <CardDescription className="text-gray-300">Wzrost liczby aktywnych użytkowników</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyUsers}>
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
                    <Bar dataKey="users" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5A4BFF" />
                        <stop offset="100%" stopColor="#7F67FF" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Popularność aplikacji</CardTitle>
                <CardDescription className="text-gray-300">Rozkład użytkowników według aplikacji</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appPopularity}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {appPopularity.map((entry, index) => (
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
                  {appPopularity.map((app, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: app.color }}
                      />
                      <span className="text-gray-300 text-sm">{app.name} ({app.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Najnowsi użytkownicy</CardTitle>
                  <CardDescription className="text-gray-300">Ostatnie rejestracje w systemie</CardDescription>
                </div>
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <Download className="w-4 h-4 mr-2" />
                  Eksportuj CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Data rejestracji</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Plan</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{user.email}</td>
                        <td className="py-3 px-4 text-gray-300">{user.date}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.plan === 'Premium' 
                              ? 'bg-reno-purple/20 text-reno-blue' 
                              : user.plan === 'Enterprise'
                              ? 'bg-reno-mint/20 text-reno-mint'
                              : 'bg-gray-600/20 text-gray-300'
                          }`}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                            Zobacz szczegóły
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
