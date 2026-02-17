import { useState } from 'react';
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

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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
      <DialogContent className="bg-[#0f1729] border border-cyan-500/30 text-white w-[calc(100%-32px)] max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-900 via-cyan-800 to-cyan-700 rounded-xl flex items-center justify-center mb-2 shadow-xl border border-cyan-500/40">
            <img
              src="/calcreno-logo-full-transparent.png"
              alt="CalcReno"
              className="w-9 h-9 sm:w-12 sm:h-12 object-contain"
            />
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-white">
            Bądź pierwszy!
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-sm sm:text-base">
            CalcReno — mobilny kalkulator materiałów budowlanych — jest w przygotowaniu.
            Zapisz się, aby otrzymać powiadomienie o starcie beta i pełnym uruchomieniu.
          </DialogDescription>
        </DialogHeader>

        {formState === 'success' && (
          <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-center">
            <p className="text-green-400 font-semibold text-lg">Dziękujemy, {firstName}!</p>
            <p className="text-gray-300 text-sm mt-1">
              Sprawdź swoją skrzynkę — wysłaliśmy Ci e-mail powitalny.
            </p>
            <Button
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={handleClose}
            >
              Zamknij
            </Button>
          </div>
        )}

        {formState === 'duplicate' && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4 text-center">
            <p className="text-yellow-400 font-semibold">Już jesteś na liście!</p>
            <p className="text-gray-300 text-sm mt-1">
              Ten adres e-mail jest już zarejestrowany. Damy Ci znać przy starcie.
            </p>
            <Button
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={handleClose}
            >
              Zamknij
            </Button>
          </div>
        )}

        {(formState === 'idle' || formState === 'loading' || formState === 'error') && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Imię
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="np. Marcin"
                required
                disabled={formState === 'loading'}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Adres e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="np. marcin@example.com"
                required
                disabled={formState === 'loading'}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition disabled:opacity-50"
              />
            </div>

            {formState === 'error' && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={formState === 'loading' || !firstName.trim() || !email.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 disabled:opacity-50"
            >
              {formState === 'loading' ? 'Zapisywanie...' : 'Zapisz mnie na listę'}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Bez spamu. Tylko ważne informacje o CalcReno. Możesz zrezygnować w każdej chwili.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
