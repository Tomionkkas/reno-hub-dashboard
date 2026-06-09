// src/pages/RenoScoutFunnel.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchFunnelStats, type FunnelStats } from '@/utils/renoscoutStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const FUNNEL_ORDER = ['promo_view', 'promo_click', 'demo_start', 'demo_complete', 'signup_view', 'signup_complete'] as const;
const FUNNEL_LABEL: Record<string, string> = {
  promo_view: 'Wyświetlenia promo',
  promo_click: 'Kliknięcia',
  demo_start: 'Start demo',
  demo_complete: 'Demo ukończone',
  signup_view: 'Wejście na rejestrację',
  signup_complete: 'Konto założone',
};

// TODO(Plan D): set the real launch date; drives the pre-launch cohort cutoff.
const LAUNCH_DATE: string | null = null;

export default function RenoScoutFunnel() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [denied, setDenied] = useState<string | null>(null);

  // UX guard: bounce users who clearly aren't admins. Real enforcement is the edge function.
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) navigate('/');
  }, [user, isLoading, navigate]);

  useEffect(() => {
    fetchFunnelStats(LAUNCH_DATE).then((s) => {
      if (!s.success) setDenied(s.error ?? 'unknown');
      else setStats(s);
    });
  }, []);

  if (denied) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] text-white flex flex-col items-center justify-center gap-2">
        <div>Brak dostępu.</div>
        <div className="text-white/30 text-xs">({denied})</div>
      </div>
    );
  }
  if (!stats) {
    return <div className="min-h-screen bg-[#0A0B1E] text-white flex items-center justify-center">Ładowanie…</div>;
  }

  const funnelData = FUNNEL_ORDER.map((k) => ({ step: FUNNEL_LABEL[k], count: stats.byEvent[k] ?? 0 }));
  const dayData = Object.entries(stats.byDay).sort(([a], [b]) => a.localeCompare(b)).map(([day, count]) => ({ day, count }));
  const sources = Object.keys(stats.bySource);

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">RenoScout — lejek konwersji</h1>
      <p className="text-white/50 text-sm mb-8">Pierwszostronicowe zdarzenia z Supabase. Konwersje liczone z profili.</p>

      {/* Headline metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Metric label="Wyświetlenia promo" value={stats.byEvent['promo_view'] ?? 0} />
        <Metric label="Konta założone" value={stats.byEvent['signup_complete'] ?? 0} />
        <Metric label="Kohorta przed startem" value={stats.cohortCount} sub={LAUNCH_DATE ? `< ${LAUNCH_DATE}` : 'ustaw launch_date'} />
        <Metric label="Wszystkie profile" value={stats.totalProfiles} />
      </div>

      {/* Funnel bar chart */}
      <Section title="Lejek (równa waga)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis type="number" stroke="#9aa0b4" />
            <YAxis type="category" dataKey="step" width={140} stroke="#9aa0b4" />
            <Tooltip contentStyle={{ background: '#12142b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* By source */}
      <Section title="Wg źródła">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/50 text-left">
                <th className="py-2 pr-4">Źródło</th>
                {FUNNEL_ORDER.map((k) => <th key={k} className="py-2 px-2 text-right">{FUNNEL_LABEL[k]}</th>)}
              </tr>
            </thead>
            <tbody>
              {sources.map((src) => (
                <tr key={src} className="border-t border-white/10">
                  <td className="py-2 pr-4 font-medium">{src}</td>
                  {FUNNEL_ORDER.map((k) => <td key={k} className="py-2 px-2 text-right">{stats.bySource[src]?.[k] ?? 0}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Daily time series */}
      <Section title="Dziennie (wszystkie zdarzenia)">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="day" stroke="#9aa0b4" />
            <YAxis stroke="#9aa0b4" />
            <Tooltip contentStyle={{ background: '#12142b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
            <Line type="monotone" dataKey="count" stroke="#FF6B35" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Revenue panel — stub for Plan D */}
      <Section title="Przychód (wkrótce)">
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-white/40 text-sm">
          Free→paid % i MRR pojawią się tutaj po wdrożeniu Stripe (Plan D).
          Dane będą czytane z <code className="text-white/60">shared_schema.user_subscriptions</code>.
        </div>
      </Section>
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-2xl bg-[#12142b] border border-white/10 p-4">
      <div className="text-white/50 text-xs">{label}</div>
      <div className="text-2xl font-bold mt-1">{value.toLocaleString('pl-PL')}</div>
      {sub && <div className="text-white/30 text-[11px] mt-0.5">{sub}</div>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">{title}</h2>
      <div className="rounded-2xl bg-[#12142b] border border-white/10 p-4">{children}</div>
    </section>
  );
}
