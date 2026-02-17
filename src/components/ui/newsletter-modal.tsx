import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

function BellIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      const el = contentRef.current;
      if (!el) return;

      const logo = el.querySelector<HTMLElement>('.modal-logo');
      const sep = el.querySelector<HTMLElement>('.modal-sep');
      const items = el.querySelectorAll<HTMLElement>('.modal-anim');

      const tl = gsap.timeline();

      if (logo) {
        tl.fromTo(
          logo,
          { scale: 0.4, opacity: 0, rotation: -15 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.8)' }
        );
      }

      if (items.length > 0) {
        tl.fromTo(
          items,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
          logo ? '-=0.3' : 0
        );
      }

      if (sep) {
        tl.fromTo(
          sep,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'center' },
          '-=0.5'
        );
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setFormState('loading');
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { firstName: firstName.trim(), email: email.trim() },
      });

      if (error) throw new Error(error.message);

      if (data?.alreadySubscribed) {
        setFormState('duplicate');
      } else {
        setFormState('success');
      }
    } catch (err) {
      setErrorMsg('Coś poszło nie tak. Spróbuj ponownie.');
      setFormState('error');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setFirstName('');
      setEmail('');
      setFormState('idle');
      setErrorMsg('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-[#0b1120] border border-cyan-500/25 text-white w-[calc(100%-32px)] max-w-md max-h-[90dvh] overflow-y-auto overflow-x-hidden p-0 gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >

        {/* Top accent bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent flex-shrink-0" />

        <div ref={contentRef} className="p-6 sm:p-8">
          <DialogHeader className="space-y-0 mb-0">

            {/* Logo with ambient glow */}
            <div className="modal-logo relative inline-flex mb-5">
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-xl" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-900 via-[#0c3050] to-cyan-800 rounded-xl flex items-center justify-center shadow-2xl border border-cyan-500/40">
                <img
                  src="/calcreno-logo-full-transparent.webp"
                  alt="CalcReno"
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                />
              </div>
            </div>

            <DialogTitle className="modal-anim text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bądź pierwszy!
            </DialogTitle>

            <DialogDescription className="modal-anim text-gray-400 text-sm sm:text-[0.9rem] leading-relaxed pt-1">
              CalcReno — mobilny kalkulator materiałów budowlanych — jest w przygotowaniu.
              Dołącz do listy i bądź pierwszym, który dowie się o starcie.
            </DialogDescription>

            {/* Benefit chips */}
            <div className="modal-anim flex flex-wrap gap-2 pt-4">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[11px] font-medium text-cyan-400">
                <BellIcon /> Beta powiadomienia
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[11px] font-medium text-purple-400">
                <ZapIcon /> Wczesny dostęp
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-medium text-emerald-400">
                <ShieldIcon /> Zero spamu
              </span>
            </div>
          </DialogHeader>

          {/* Separator */}
          <div className="modal-sep h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

          {/* Success state */}
          {formState === 'success' && (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 mb-5">
                <CheckIcon />
              </div>
              <p className="text-white font-bold text-xl mb-1.5">Dziękujemy, {firstName}!</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Sprawdź swoją skrzynkę — wysłaliśmy Ci e-mail powitalny.
              </p>
              <Button
                className="w-full bg-emerald-600/80 hover:bg-emerald-500/90 text-white border-0 rounded-xl py-3 font-semibold"
                onClick={handleClose}
              >
                Zamknij
              </Button>
            </div>
          )}

          {/* Duplicate state */}
          {formState === 'duplicate' && (
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 mb-5">
                <StarIcon />
              </div>
              <p className="text-white font-bold text-lg mb-1.5">Już jesteś na liście!</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Ten adres jest już zarejestrowany. Damy Ci znać przy starcie.
              </p>
              <Button
                className="w-full bg-amber-600/70 hover:bg-amber-500/80 text-white border-0 rounded-xl py-3 font-semibold"
                onClick={handleClose}
              >
                Zamknij
              </Button>
            </div>
          )}

          {/* Form */}
          {(formState === 'idle' || formState === 'loading' || formState === 'error') && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="modal-anim">
                <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-2">
                  Imię
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="np. Marcin"
                  required
                  disabled={formState === 'loading'}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all duration-200 disabled:opacity-50 text-base"
                />
              </div>

              <div className="modal-anim">
                <label className="block text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-2">
                  Adres e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="np. marcin@example.com"
                  required
                  disabled={formState === 'loading'}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all duration-200 disabled:opacity-50 text-base"
                />
              </div>

              {formState === 'error' && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}

              <Button
                type="submit"
                disabled={formState === 'loading' || !firstName.trim() || !email.trim()}
                className="modal-anim w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-40 transition-all duration-200 border-0 shadow-lg shadow-cyan-900/40"
              >
                {formState === 'loading' ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    Zapisz mnie na listę
                    <span className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-rotate-45 inline-block">→</span>
                  </>
                )}
              </Button>

              <p className="modal-anim flex items-center justify-center gap-1.5 text-[11px] text-gray-600 pt-1">
                <LockIcon />
                Bez spamu. Tylko ważne info. Rezygnacja w każdej chwili.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
