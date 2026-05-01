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

function passwordScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_COLORS = ['#EF4444', '#EF4444', '#F59E0B', '#7F67FF', '#00D4FF'];
const STRENGTH_LABELS = ['', 'Słabe', 'Słabe', 'Średnie', 'Mocne', 'Bardzo mocne'];

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const score = passwordScore(password);
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full transition-colors duration-200"
            style={{ background: i <= score ? STRENGTH_COLORS[score] : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
      <p className="mt-1.5" style={{ fontSize: 11, color: '#6B7280', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}>
        {STRENGTH_LABELS[score]}{score === 2 ? ' · dodaj cyfrę i znak specjalny' : ''}
      </p>
    </div>
  );
}

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationPending, setRegistrationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }
    setIsLoading(true);
    try {
      const result = await registerUser(email, password, firstName, lastName);
      if (result.confirmationPending) {
        setRegisteredEmail(email);
        setRegistrationPending(true);
      } else {
        toast.success('Konto zostało utworzone pomyślnie!');
        navigate('/dashboard');
      }
    } catch {
      toast.error('Błąd podczas rejestracji. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {registrationPending ? (
        <div className="text-center py-8">
          <p className="eyebrow mb-6" style={{ fontFamily: 'ui-monospace, monospace' }}>§ Potwierdź email</p>
          <h1 className="text-white font-bold mb-4" style={{ fontSize: 36, letterSpacing: '-0.03em' }}>
            Sprawdź skrzynkę
          </h1>
          <p className="text-[#B8BCC8] mb-2" style={{ fontSize: 15, lineHeight: 1.55 }}>
            Wysłaliśmy link aktywacyjny na adres
          </p>
          <p className="text-[#7F67FF] font-medium mb-8" style={{ fontSize: 15 }}>{registeredEmail}</p>
          <p className="text-[#6B7280]" style={{ fontSize: 13 }}>
            Kliknij link w emailu, aby aktywować konto.
          </p>
          <div className="mt-8">
            <Link to="/login" className="text-[14px] text-[#B8BCC8] hover:text-white transition-colors no-underline">
              ← Wróć do logowania
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-4" style={{ fontFamily: 'ui-monospace, monospace' }}>§ Nowe konto</p>
          <h1
            className="text-white font-bold mb-2"
            style={{ fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Załóż konto
          </h1>
          <p className="text-[#B8BCC8] mb-9" style={{ fontSize: 15, lineHeight: 1.55 }}>
            Jedno konto otwiera CalcReno, RenoTimeline i RenoScout.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className={LABEL_CLS}>Imię</label>
                <Input id="firstName" type="text" value={firstName}
                       onChange={e => setFirstName(e.target.value)}
                       required placeholder="Anna" className={INPUT_CLS} />
              </div>
              <div>
                <label htmlFor="lastName" className={LABEL_CLS}>Nazwisko</label>
                <Input id="lastName" type="text" value={lastName}
                       onChange={e => setLastName(e.target.value)}
                       required placeholder="Kowalska" className={INPUT_CLS} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={LABEL_CLS}>Email</label>
              <Input id="email" type="email" value={email}
                     onChange={e => setEmail(e.target.value)}
                     required placeholder="twój@email.pl" className={INPUT_CLS} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={LABEL_CLS}>Hasło</label>
              <Input id="password" type="password" value={password}
                     onChange={e => setPassword(e.target.value)}
                     required placeholder="Min. 8 znaków" className={INPUT_CLS} />
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={LABEL_CLS}>Powtórz hasło</label>
              <Input id="confirmPassword" type="password" value={confirmPassword}
                     onChange={e => setConfirmPassword(e.target.value)}
                     required placeholder="••••••••••" className={INPUT_CLS} />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={v => setTermsAccepted(!!v)}
                required
                className="mt-0.5 border-white/20 data-[state=checked]:bg-[#7F67FF] data-[state=checked]:border-[#7F67FF]"
              />
              <Label htmlFor="terms" className="text-[12px] text-[#B8BCC8] cursor-pointer font-normal leading-relaxed">
                Akceptuję{' '}
                <Link to="/privacy-policy" className="text-white no-underline" style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                  regulamin
                </Link>{' '}
                i{' '}
                <Link to="/privacy-policy" className="text-white no-underline" style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                  politykę prywatności
                </Link>{' '}
                RenoHub.
              </Label>
            </div>

            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText="Tworzę konto…"
              className="w-full bg-white text-[#0A0B1E] font-semibold rounded-xl h-12 text-[15px] border-0 hover:bg-white/90 transition-colors mt-2"
            >
              Załóż konto →
            </LoadingButton>
          </form>

          <p className="text-center text-[14px] text-[#B8BCC8] mt-7">
            Masz już konto?{' '}
            <Link to="/login" className="text-white font-medium no-underline"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 1 }}>
              Zaloguj się
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default Register;
