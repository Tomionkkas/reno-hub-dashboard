import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type FormState = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';

export default function CTASectionD() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === 'loading') return;
    setState('loading');
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { email: email.trim() },
      });
      if (error) throw error;
      if (data?.status === 'duplicate') {
        setState('duplicate');
      } else {
        setState('success');
        setEmail('');
      }
    } catch {
      setState('error');
    }
  };

  return (
    <section className="px-5 md:px-14 py-24 overflow-hidden" style={{ background: '#0A0B1E' }}>
      <div className="gradient-border-card max-w-[1168px] mx-auto p-6 sm:p-10 lg:p-[72px_56px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <p className="eyebrow mb-5" style={{ fontFamily: 'ui-monospace, monospace' }}>
              § Premiera CalcReno
            </p>
            <h2
              className="text-white font-bold m-0 mb-5"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
            >
              Zacznij od{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 400,
                  background: GRAD,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                liczb.
              </em>
            </h2>
            <p className="text-[#B8BCC8] m-0" style={{ fontSize: 16, maxWidth: 420 }}>
              Zarejestruj konto i korzystaj z CalcReno przez pierwsze 3 miesiące za darmo.
            </p>
          </div>

          {/* Right: form */}
          <div>
            {state === 'success' ? (
              <div className="rounded-2xl p-6 border border-white/10 text-center"
                   style={{ background: 'rgba(0,212,170,0.08)' }}>
                <p className="text-[#00D4AA] text-sm font-medium mb-1">Zapisano!</p>
                <p className="text-[#B8BCC8] text-sm">Damy znać, gdy CalcReno będzie gotowe.</p>
              </div>
            ) : state === 'duplicate' ? (
              <div className="rounded-2xl p-6 border border-white/10 text-center"
                   style={{ background: 'rgba(127,103,255,0.08)' }}>
                <p className="text-[#7F67FF] text-sm font-medium mb-1">Już jesteś na liście!</p>
                <p className="text-[#B8BCC8] text-sm">Twój email był już zapisany.</p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div
                    className="flex flex-1 gap-1.5 p-1.5 rounded-full border border-white/[0.08] min-w-0"
                    style={{ background: 'rgba(0,0,0,0.35)' }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="twój@email.pl"
                      required
                      disabled={state === 'loading'}
                      className="flex-1 bg-transparent border-0 outline-none text-white text-[14px] px-5 min-w-0"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="bg-white text-[#0A0B1E] font-semibold rounded-full px-6 py-3 text-[14px] border-0 cursor-pointer hover:bg-white/90 transition-colors disabled:opacity-60 flex-shrink-0"
                  >
                    {state === 'loading' ? 'Zapisuję…' : 'Zapisz się'}
                  </button>
                </form>
                {state === 'error' && (
                  <p className="text-red-400 text-xs mt-2 pl-2">Coś poszło nie tak — spróbuj ponownie.</p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] flex-shrink-0" />
                  <span className="text-[12px] text-[#6B7280]">
                    +1 840 osób już czeka · 3 miesiące gratis przy rejestracji
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
