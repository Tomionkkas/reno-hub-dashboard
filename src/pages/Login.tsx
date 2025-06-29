
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Zalogowano pomyślnie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center">
          <Link to="/" className="text-3xl font-bold gradient-text mb-4 block">
            RenoApp
          </Link>
          <CardTitle className="text-2xl text-white">Zaloguj się</CardTitle>
          <CardDescription className="text-gray-300">
            Wprowadź swoje dane aby uzyskać dostęp do konta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                placeholder="twoj@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                placeholder="Wprowadź hasło"
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-bg hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400">
              Nie masz konta?{' '}
              <Link to="/register" className="text-reno-blue hover:text-reno-purple transition-colors">
                Zarejestruj się
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Demo: admin@renoapp.com / user@test.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
