import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/layout/AuthLayout';

type PageState = 'loading' | 'success' | 'error' | 'already_confirmed';

interface AppConfig {
  /** Success message. Falls back to a generic "you can log in now" when omitted. */
  message?: string;
  /**
   * Return CTA. Omit entirely for apps with no button (e.g. CalcReno, which has no
   * app-store build yet — a `calcreno://` deep-link button would just dead-end).
   */
  cta?: {
    label: string;
    /** External URL or custom scheme (deep link). */
    href?: string;
    /** Internal SPA route — used for RenoHub itself. */
    internal?: string;
  };
}

// Per-app content for this universal confirmation page. The `?app=` query param
// (set by each app's emailRedirectTo) selects the entry. Add every app that points
// its Supabase confirm/redirect links at www.renohub.org/auth/confirm here.
const APP_CONFIG: Record<string, AppConfig> = {
  renohub: { cta: { label: 'Przejdź do panelu', internal: '/dashboard' } },
  renotimeline: { cta: { label: 'Przejdź do RenoTimeline', href: 'https://www.renotimeline.com' } },
  renoscout: { cta: { label: 'Przejdź do RenoScout', href: 'https://renoscout.pl' } },
  // No button — CalcReno users just return to the mobile app to log in.
  calcreno: { message: 'Twoje konto zostało aktywowane. Wróć do aplikacji CalcReno i zaloguj się.' },
};

// Visual treatment per state — tinted icon chip + accent, cohesive with the auth palette.
const STATUS_VISUAL: Record<PageState, { color: string; tint: string; ring: string }> = {
  loading: { color: '#7F67FF', tint: 'rgba(127,103,255,0.10)', ring: 'rgba(127,103,255,0.28)' },
  success: { color: '#00D4FF', tint: 'rgba(0,212,255,0.10)', ring: 'rgba(0,212,255,0.32)' },
  already_confirmed: { color: '#00D4FF', tint: 'rgba(0,212,255,0.08)', ring: 'rgba(0,212,255,0.22)' },
  error: { color: '#FF4D6D', tint: 'rgba(255,77,109,0.10)', ring: 'rgba(255,77,109,0.30)' },
};

const Confirm = () => {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appParam = searchParams.get('app');
  const appConfig = appParam ? APP_CONFIG[appParam] : undefined;
  const isKnownApp = Boolean(appConfig);

  useEffect(() => {
    // Supabase's detectSessionInUrl processes the URL hash during client initialization
    // and stores the session before this component mounts. Use getSession() to read it.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        setErrorMessage('Link potwierdzający jest nieprawidłowy lub wygasł. Spróbuj zarejestrować się ponownie.');
        setPageState('error');
      } else {
        // Universal confirmation page for every app — show the "done" state and
        // offer a per-app return CTA instead of redirecting to the RenoHub root.
        setPageState('success');
      }
    });
  }, []);

  const eyebrow = pageState === 'error' ? '§ Błąd weryfikacji' : '§ Potwierdzenie konta';

  const title =
    pageState === 'loading'
      ? 'Weryfikacja e-maila'
      : pageState === 'error'
      ? 'Coś poszło nie tak'
      : pageState === 'already_confirmed'
      ? 'Już potwierdzono'
      : 'Email potwierdzony!';

  const body =
    pageState === 'loading'
      ? 'Trwa weryfikacja Twojego adresu e-mail…'
      : pageState === 'error'
      ? errorMessage
      : pageState === 'already_confirmed'
      ? 'Twój adres e-mail był już wcześniej potwierdzony.'
      : appConfig?.message ?? 'Twoje konto zostało aktywowane. Możesz teraz się zalogować.';

  const visual = STATUS_VISUAL[pageState];
  const StatusIcon =
    pageState === 'loading' ? Loader2 : pageState === 'error' ? AlertTriangle : CheckCircle2;

  const goTo = (cta: NonNullable<AppConfig['cta']>) => {
    if (cta.internal) {
      navigate(cta.internal);
    } else if (cta.href) {
      window.location.href = cta.href;
    }
  };

  const renderCta = () => {
    if (pageState === 'loading') return null;

    if (pageState === 'error') {
      return (
        <button
          onClick={() => navigate('/login')}
          className="text-[13px] text-[#7F67FF] hover:text-[#00D4FF] transition-colors"
          style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
        >
          Wróć do logowania →
        </button>
      );
    }

    // success / already_confirmed
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

    // Known app with no button (CalcReno) — just a quiet "you can close this" hint.
    if (isKnownApp) {
      return (
        <p
          className="text-white/30 text-[12px]"
          style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
        >
          Możesz zamknąć tę kartę.
        </p>
      );
    }

    // Unknown / missing app param — fall back to the RenoHub login.
    return (
      <button
        onClick={() => navigate('/login')}
        className="text-[13px] text-[#7F67FF] hover:text-[#00D4FF] transition-colors"
        style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.04em' }}
      >
        Przejdź do logowania →
      </button>
    );
  };

  return (
    <AuthLayout>
      <div className="animate-fade-in-up">
        {/* Status chip */}
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

        <h1
          className="text-white font-bold mb-3"
          style={{ fontSize: 40, letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          {title}
        </h1>

        <p className="text-[#B8BCC8] mb-8" style={{ fontSize: 15, lineHeight: 1.6 }}>
          {body}
        </p>

        {renderCta()}
      </div>
    </AuthLayout>
  );
};

export default Confirm;
