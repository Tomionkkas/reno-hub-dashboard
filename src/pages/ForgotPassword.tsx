import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/layout/AuthLayout';
import { toast } from 'sonner';

const INPUT_CLS = 'bg-white/[0.04] border-white/10 text-white placeholder-white/30 focus:border-[#7F67FF]/50 rounded-xl h-12';
const LABEL_CLS = 'text-[11px] font-medium text-white/50 tracking-[0.14em] uppercase block mb-2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      toast.error('Nie udało się wysłać linku. Sprawdź adres email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Link
        to="/login"
        className="inline-block text-[12px] text-[#6B7280] hover:text-white/60 transition-colors no-underline mb-7"
        style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
      >
        ← Wróć do logowania
      </Link>

      <p className="eyebrow mb-4" style={{ fontFamily: 'ui-monospace, monospace' }}>§ Reset hasła</p>

      {sent ? (
        <div className="py-4">
          <h1 className="text-white font-bold mb-4" style={{ fontSize: 36, letterSpacing: '-0.03em' }}>
            Sprawdź skrzynkę
          </h1>
          <p className="text-[#B8BCC8] mb-6" style={{ fontSize: 15, lineHeight: 1.55 }}>
            Wysłaliśmy link do zresetowania hasła na podany adres email. Zwykle przychodzi w ciągu minuty.
          </p>
          <p className="text-[#6B7280]" style={{ fontSize: 13 }}>
            Nie widzisz wiadomości? Sprawdź folder spam.
          </p>
          <div className="mt-8">
            <Link to="/login" className="text-[14px] text-[#B8BCC8] hover:text-white transition-colors no-underline">
              ← Wróć do logowania
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1
            className="text-white font-bold mb-2"
            style={{ fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Zapomniałeś hasła?
          </h1>
          <p className="text-[#B8BCC8] mb-9" style={{ fontSize: 15, lineHeight: 1.55 }}>
            Wpisz email — wyślemy link do zresetowania hasła. Zwykle przychodzi w ciągu minuty.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className={LABEL_CLS}>Email konta</label>
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
            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText="Wysyłam…"
              className="w-full bg-white text-[#0A0B1E] font-semibold rounded-xl h-12 text-[15px] border-0 hover:bg-white/90 transition-colors mt-1"
            >
              Wyślij link →
            </LoadingButton>
          </form>

          {/* Helper card */}
          <div
            className="mt-9 rounded-2xl p-5 border border-white/[0.08]"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="mb-2.5" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00D4FF', fontFamily: 'ui-monospace, monospace' }}>
              Pomoc
            </p>
            <p className="m-0 text-[#B8BCC8]" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Jeśli email nie dotrze w 5 minut — sprawdź spam, lub napisz do{' '}
              <a
                href="mailto:pomoc@renohub.org"
                className="text-white no-underline"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}
              >
                pomoc@renohub.org
              </a>
              .
            </p>
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
