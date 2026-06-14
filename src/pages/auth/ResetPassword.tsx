import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/layout/AuthLayout';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';

type PageState = 'loading' | 'form' | 'success' | 'error';

interface AppConfig {
  /** Success message. Falls back to a generic "log in with the new password". */
  message?: string;
  /** Return CTA. Omit for apps with no button (e.g. CalcReno mobile). */
  cta?: { label: string; href?: string; internal?: string };
}

// Per-app content, mirrors /auth/confirm. Selected by ?app= (top-level or nested
// inside ?redirect_to=). Add every app that resets via this shared page.
const APP_CONFIG: Record<string, AppConfig> = {
  renohub: { cta: { label: 'Przejdź do panelu', internal: '/dashboard' } },
  renotimeline: { cta: { label: 'Przejdź do RenoTimeline', href: 'https://www.renotimeline.com' } },
  renoscout: { cta: { label: 'Przejdź do RenoScout', href: 'https://renoscout.pl' } },
  calcreno: { message: 'Hasło zostało zmienione. Wróć do aplikacji CalcReno i zaloguj się.' },
};

const STATUS_VISUAL: Record<'loading' | 'success' | 'error', { color: string; tint: string; ring: string }> = {
  loading: { color: '#7F67FF', tint: 'rgba(127,103,255,0.10)', ring: 'rgba(127,103,255,0.28)' },
  success: { color: '#00D4FF', tint: 'rgba(0,212,255,0.10)', ring: 'rgba(0,212,255,0.32)' },
  error: { color: '#FF4D6D', tint: 'rgba(255,77,109,0.10)', ring: 'rgba(255,77,109,0.30)' },
};

const INPUT_CLS = 'bg-white/[0.04] border-white/10 text-white placeholder-white/30 focus:border-[#7F67FF]/50 rounded-xl h-12';
const LABEL_CLS = 'text-[11px] font-medium text-white/50 tracking-[0.14em] uppercase block mb-2';

const ResetPassword = () => {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // App id from top-level ?app= or nested inside ?redirect_to=…?app=…
  const appParam = (() => {
    const direct = searchParams.get('app');
    if (direct) return direct;
    const rt = searchParams.get('redirect_to');
    if (!rt) return null;
    try {
      return new URL(rt).searchParams.get('app');
    } catch {
      return null;
    }
  })();
  const appConfig = appParam ? APP_CONFIG[appParam] : undefined;
  const isKnownApp = Boolean(appConfig);

  useEffect(() => {
    const onResult = (ok: boolean) => {
      if (ok) {
        setPageState('form');
      } else {
        setErrorMessage('Link resetowania hasła jest nieprawidłowy lub wygasł. Poproś o nowy.');
        setPageState('error');
      }
    };

    // Preferred: token_hash flow (cross-domain — no PKCE code_verifier needed).
    // The reset email links here with &token_hash={{ .TokenHash }}&type=recovery.
    const tokenHash = searchParams.get('token_hash');
    if (tokenHash) {
      const type = (searchParams.get('type') as EmailOtpType | null) ?? 'recovery';
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type })
        .then(({ data, error }) => onResult(!error && !!data.session));
      return;
    }

    // Fallback: same-domain PKCE/implicit flow already exchanged into a session.
    supabase.auth.getSession().then(({ data: { session }, error }) => onResult(!error && !!session));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Hasła nie są identyczne.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      console.error('[ResetPassword] updateUser error:', error);
      if (error.message?.includes('different from the old password')) {
        setErrorMessage('Nowe hasło musi być inne niż obecne.');
      } else if (error.message?.includes('session')) {
        setErrorMessage('Sesja wygasła. Poproś o nowy link resetowania hasła.');
      } else {
        setErrorMessage('Nie udało się zmienić hasła. Spróbuj ponownie.');
      }
    } else {
      setPageState('success');
    }
  };

  const goTo = (cta: NonNullable<AppConfig['cta']>) => {
    if (cta.internal) {
      navigate(cta.internal);
    } else if (cta.href) {
      window.location.href = cta.href;
    }
  };

  const loginLink = (label: string) => (
    <button
      onClick={() => navigate('/login')}
      className="text-[13px] text-[#7F67FF] hover:text-[#00D4FF] transition-colors"
      style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
    >
      {label}
    </button>
  );

  const renderSuccessCta = () => {
    if (appConfig?.cta) {
      const cta = appConfig.cta;
      return (
        <button
          onClick={() => goTo(cta)}
          className="group w-full flex items-center justify-center gap-2 bg-white text-[#0A0B1E] font-semibold rounded-xl h-12 text-[15px] border-0 hover:bg-white/90 transition-colors"
        >
          {cta.label}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      );
    }
    if (isKnownApp) {
      return (
        <p className="text-white/30 text-[12px]" style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}>
          Możesz zamknąć tę kartę.
        </p>
      );
    }
    return loginLink('Przejdź do logowania →');
  };

  // --- Status (loading / success / error) ---
  if (pageState !== 'form') {
    const visualKey = pageState === 'success' ? 'success' : pageState === 'error' ? 'error' : 'loading';
    const visual = STATUS_VISUAL[visualKey];
    const StatusIcon = pageState === 'success' ? CheckCircle2 : pageState === 'error' ? AlertTriangle : Loader2;

    const eyebrow = pageState === 'error' ? '§ Błąd resetowania' : '§ Reset hasła';
    const title =
      pageState === 'loading' ? 'Weryfikacja linku' : pageState === 'error' ? 'Coś poszło nie tak' : 'Hasło zmienione!';
    const body =
      pageState === 'loading'
        ? 'Trwa weryfikacja linku resetowania hasła…'
        : pageState === 'error'
        ? errorMessage
        : appConfig?.message ?? 'Możesz teraz zalogować się przy użyciu nowego hasła.';

    return (
      <AuthLayout>
        <div className="animate-fade-in-up">
          <div
            className="mb-7 inline-flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: visual.tint,
              border: `1px solid ${visual.ring}`,
              boxShadow: `0 0 44px -10px ${visual.color}`,
            }}
          >
            <StatusIcon
              size={28}
              strokeWidth={2}
              color={visual.color}
              className={pageState === 'loading' ? 'animate-spin' : ''}
            />
          </div>

          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="text-white font-bold mb-3" style={{ fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {title}
          </h1>
          <p className="text-[#B8BCC8] mb-8" style={{ fontSize: 15, lineHeight: 1.6 }}>
            {body}
          </p>

          {pageState === 'success' ? renderSuccessCta() : pageState === 'error' ? loginLink('Wróć do logowania →') : null}
        </div>
      </AuthLayout>
    );
  }

  // --- Form ---
  return (
    <AuthLayout>
      <div className="animate-fade-in-up">
        <p className="eyebrow mb-4">§ Reset hasła</p>
        <h1 className="text-white font-bold mb-2" style={{ fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          Ustaw nowe hasło
        </h1>
        <p className="text-[#B8BCC8] mb-9" style={{ fontSize: 15, lineHeight: 1.55 }}>
          Wprowadź nowe hasło dla swojego konta.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="password" className={LABEL_CLS}>Nowe hasło</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Minimum 8 znaków"
              className={INPUT_CLS}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={LABEL_CLS}>Potwierdź hasło</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Powtórz hasło"
              className={INPUT_CLS}
            />
          </div>

          {errorMessage && <p className="text-[#FF4D6D] text-[13px]">{errorMessage}</p>}

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            loadingText="Zapisywanie…"
            className="w-full bg-white text-[#0A0B1E] font-semibold rounded-xl h-12 text-[15px] border-0 hover:bg-white/90 transition-colors mt-2"
          >
            Zmień hasło
          </LoadingButton>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
