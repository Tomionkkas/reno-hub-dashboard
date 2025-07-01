
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AnimatedCard, AnimatedCardContent, AnimatedCardDescription, AnimatedCardHeader, AnimatedCardTitle } from '@/components/ui/animated-card';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Zalogowano pomyślnie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-reno-purple/10 rounded-full floating-element"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-reno-blue/10 rounded-full floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-reno-mint/10 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
      </div>

      <AnimatedCard className="w-full max-w-md glass-card border-white/10 hover:border-reno-purple/30 relative z-10" hover="glow">
        <AnimatedCardHeader className="text-center">
          <Link to="/" className="text-3xl font-bold gradient-text mb-4 block hover-lift">
            RenoApp
          </Link>
          <AnimatedCardTitle className="text-2xl text-white">Zaloguj się</AnimatedCardTitle>
          <AnimatedCardDescription className="text-gray-300">
            Wprowadź swoje dane aby uzyskać dostęp do konta
          </AnimatedCardDescription>
        </AnimatedCardHeader>
        <AnimatedCardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 animate-slide-in-left" style={{animationDelay: '300ms'}}>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 transition-colors"
                placeholder="twoj@email.com"
              />
            </div>
            <div className="space-y-2 animate-slide-in-right" style={{animationDelay: '400ms'}}>
              <Label htmlFor="password" className="text-white">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 hover:border-white/20 focus:border-reno-purple/50 transition-colors"
                placeholder="Wprowadź hasło"
              />
            </div>
            <div className="animate-scale-in" style={{animationDelay: '500ms'}}>
              <LoadingButton
                type="submit"
                className="w-full"
                variant="gradient"
                loading={isLoading}
                loadingText="Logowanie..."
              >
                Zaloguj się
              </LoadingButton>
            </div>
          </form>
          
          <div className="mt-6 text-center space-y-2 animate-fade-in-up" style={{animationDelay: '600ms'}}>
            <p className="text-gray-400">
              Nie masz konta?{' '}
              <Link to="/register" className="text-reno-blue hover:text-reno-purple transition-colors nav-link">
                Zarejestruj się
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Demo: admin@renoapp.com / user@test.com
            </p>
          </div>
        </AnimatedCardContent>
      </AnimatedCard>
    </div>
  );
};

export default Login;
