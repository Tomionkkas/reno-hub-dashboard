import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/components/layout/AuthLayout';
import { toast } from 'sonner';

const INPUT_CLS = 'bg-white/[0.04] border-white/10 text-white placeholder-white/30 focus:border-[#7F67FF]/50 rounded-xl h-12';
const LABEL_CLS = 'text-[11px] font-medium text-white/50 tracking-[0.14em] uppercase block mb-2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
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
    } catch (error: any) {
      if (error?.message?.includes('Invalid login credentials')) {
        toast.error('Nieprawidłowy email lub hasło.');
      } else if (error?.message?.includes('Nie można połączyć się z serwerem')) {
        toast.error('Błąd połączenia z serwerem.');
      } else {
        toast.error('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Section label */}
      <p className="eyebrow mb-4" style={{ fontFamily: 'ui-monospace, monospace' }}>
        § Logowanie
      </p>
      <h1
        className="text-white font-bold mb-2"
        style={{ fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1.05 }}
      >
        Zaloguj się
      </h1>
      <p className="text-[#B8BCC8] mb-9" style={{ fontSize: 15, lineHeight: 1.55 }}>
        Wprowadź swoje dane, aby uzyskać dostęp do konta.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className={LABEL_CLS}>Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="twój@email.pl"
            className={INPUT_CLS}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className={LABEL_CLS + ' mb-0'}>Hasło</label>
            <Link
              to="/forgot-password"
              className="text-[12px] text-[#7F67FF] hover:text-[#00D4FF] transition-colors no-underline"
              style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
            >
              Zapomniałem hasła →
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="••••••••••"
            className={INPUT_CLS}
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={v => setRemember(!!v)}
            className="border-white/20 data-[state=checked]:bg-[#7F67FF] data-[state=checked]:border-[#7F67FF]"
          />
          <Label htmlFor="remember" className="text-[13px] text-[#B8BCC8] cursor-pointer font-normal">
            Zapamiętaj mnie na tym urządzeniu
          </Label>
        </div>

        <LoadingButton
          type="submit"
          loading={isLoading}
          loadingText="Logowanie…"
          className="w-full bg-white text-[#0A0B1E] font-semibold rounded-xl h-12 text-[15px] border-0 hover:bg-white/90 transition-colors mt-3"
        >
          Zaloguj się →
        </LoadingButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-white/[0.08]" />
        <span className="text-white/30 text-[11px]" style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          lub
        </span>
        <div className="flex-1 h-px bg-white/[0.08]" />
      </div>

      <p className="text-center text-[14px] text-[#B8BCC8]">
        Nie masz konta?{' '}
        <Link to="/register" className="text-white font-medium no-underline"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 1 }}>
          Zarejestruj się
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
