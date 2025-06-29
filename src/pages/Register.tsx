
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }

    try {
      await register(email, password);
      toast.success('Konto zostało utworzone pomyślnie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Błąd podczas rejestracji. Spróbuj ponownie.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center">
          <Link to="/" className="text-3xl font-bold gradient-text mb-4 block">
            RenoApp
          </Link>
          <CardTitle className="text-2xl text-white">Utwórz konto</CardTitle>
          <CardDescription className="text-gray-300">
            Zarejestruj się aby uzyskać dostęp do aplikacji
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
                placeholder="Minimum 8 znaków"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Potwierdź hasło</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                placeholder="Powtórz hasło"
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-bg hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Tworzę konto...' : 'Utwórz konto'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Masz już konto?{' '}
              <Link to="/login" className="text-reno-blue hover:text-reno-purple transition-colors">
                Zaloguj się
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
