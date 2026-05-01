import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsletterModal } from '@/components/ui/newsletter-modal';

const APPS = [
  {
    key: 'calcreno',
    name: 'CalcReno',
    tag: 'Kalkulator',
    status: 'Wkrótce',
    color: '#00D4FF',
    desc: 'Policz koszt materiałów i robocizny pokój po pokoju. Z aktualnymi cenami z polskich hurtowni.',
    bullets: ['Kalkulator pokojów i stref', 'Baza cen 2026', 'Export PDF', 'Offline'],
    cta: 'Lista oczekujących',
    ctaAction: 'newsletter' as const,
    image: '/calcreno/screenshots/Cost summary.PNG',
    imageKind: 'phone' as const,
    strip: [
      { src: '/calcreno/screenshots/Material calculator.PNG', label: 'Materiały' },
      { src: '/calcreno/screenshots/Project detail.PNG', label: 'Projekt' },
    ],
    stripKind: 'phone' as const,
  },
  {
    key: 'renotimeline',
    name: 'RenoTimeline',
    tag: 'Harmonogram',
    status: 'Dostępne',
    color: '#00D4AA',
    desc: 'Planuj etapy remontu razem z wykonawcą. Zadania, terminy, koszty — na jednym widoku.',
    bullets: ['Zadania i kamienie milowe', 'Współdzielenie z ekipą', 'Śledzenie kosztów', 'Powiadomienia'],
    cta: 'Otwórz aplikację',
    ctaAction: 'external' as const,
    href: 'https://www.renotimeline.com',
    image: '/renotimeline/screenshots/dashboard.png',
    imageKind: 'desktop' as const,
    strip: [
      { src: '/renotimeline/screenshots/kanban.png', label: 'Kanban' },
      { src: '/renotimeline/screenshots/calendar.png', label: 'Kalendarz' },
    ],
    stripKind: 'desktop' as const,
  },
  {
    key: 'renoscout',
    name: 'RenoScout',
    tag: 'AI · Inwestycje',
    status: 'Beta',
    color: '#FF0080',
    desc: 'AI przegląda oferty mieszkań w Polsce i pokazuje, które realnie opłaca się kupić pod remont.',
    bullets: ['40+ portali', 'Analiza ROI', 'Alerty', 'Raport PDF'],
    cta: 'Dołącz do bety',
    ctaAction: 'internal' as const,
    href: '/renoscout',
    image: null,
    imageKind: 'placeholder' as const,
    strip: null,
    stripKind: null,
  },
] as const;

type AppKey = typeof APPS[number]['key'];

export default function AppSwitcherSection() {
  const [active, setActive] = useState<AppKey>('calcreno');
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const app = APPS.find(a => a.key === active)!;

  function renderCTA() {
    const base = 'bg-white text-[#0A0B1E] border-0 rounded-full px-7 py-3.5 text-[14px] font-semibold cursor-pointer hover:bg-white/90 transition-colors';
    if (app.ctaAction === 'newsletter') {
      return <button className={base} onClick={() => setNewsletterOpen(true)}>{app.cta} →</button>;
    }
    if (app.ctaAction === 'external') {
      return <a href={app.href} target="_blank" rel="noopener noreferrer" className={base + ' inline-block'}>{app.cta} →</a>;
    }
    return <Link to={app.href!} className={base + ' inline-block'}>{app.cta} →</Link>;
  }

  return (
    <section id="apps" className="px-5 md:px-14 py-24" style={{ background: '#0A0B1E' }}>
      <div className="max-w-[1168px] mx-auto">

        {/* Section label */}
        <div className="flex items-baseline justify-between pb-4 mb-10 border-b border-white/[0.08]">
          <span className="eyebrow" style={{ fontFamily: 'ui-monospace, monospace' }}>
            § 01 — Aplikacje
          </span>
          <span className="eyebrow" style={{ fontFamily: 'ui-monospace, monospace' }}>
            Trzy produkty · jedno konto
          </span>
        </div>

        {/* Tab pills */}
        <div className="flex gap-1 sm:gap-2 mb-16 p-1 sm:p-1.5 rounded-full w-full sm:w-fit border border-white/[0.08]"
             style={{ background: 'rgba(255,255,255,0.03)' }}>
          {APPS.map(a => (
            <button
              key={a.key}
              onClick={() => setActive(a.key as AppKey)}
              className="flex-1 sm:flex-none rounded-full px-3 sm:px-6 py-2 sm:py-2.5 text-[12px] sm:text-[14px] font-medium transition-all duration-200 border-0 cursor-pointer whitespace-nowrap"
              style={{
                background: active === a.key ? '#fff' : 'transparent',
                color: active === a.key ? '#0A0B1E' : '#B8BCC8',
              }}
            >
              {a.name}
            </button>
          ))}
        </div>

        {/* Main panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-center">

          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2.5 mb-6"
                 style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: app.color }}>
              <span style={{ width: 24, height: 1, background: app.color, display: 'inline-block' }} />
              {app.tag} · {app.status}
            </div>

            <h2 className="text-white font-bold m-0 mb-6"
                style={{ fontSize: 'clamp(48px, 5.5vw, 72px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {app.name}
            </h2>

            <p className="text-[#B8BCC8] mb-9" style={{ fontSize: 18, lineHeight: 1.55 }}>
              {app.desc}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {app.bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[14px] text-[#E5E7EB]">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: app.color }} />
                  {b}
                </div>
              ))}
            </div>

            {renderCTA()}
          </div>

          {/* Right: screenshot frame */}
          <div
            className="relative rounded-3xl overflow-hidden flex items-center justify-center border border-white/[0.08]"
            style={{
              aspectRatio: app.imageKind === 'phone' ? '9/17' : app.imageKind === 'desktop' ? '4/5' : '4/5',
              background: app.imageKind === 'phone' ? '#0A0B1E' : 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Color glow overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
              background: `radial-gradient(ellipse at 70% 30%, ${app.color}22 0%, transparent 60%)` }}
            />

            {app.imageKind === 'phone' && app.image && (
              <img
                src={app.image}
                alt={app.name}
                className="relative"
                style={{
                  zIndex: 1, width: '72%', maxHeight: '92%', objectFit: 'contain',
                  borderRadius: 28,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                }}
              />
            )}
            {app.imageKind === 'desktop' && app.image && (
              <img
                src={app.image}
                alt={app.name}
                className="relative"
                style={{
                  zIndex: 1, width: '92%', objectFit: 'contain',
                  borderRadius: 12,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              />
            )}
            {app.imageKind === 'placeholder' && (
              <div className="relative text-center px-6" style={{ zIndex: 1 }}>
                <p className="eyebrow mb-1" style={{ color: '#6B7280', fontFamily: 'ui-monospace, monospace' }}>
                  w produkcji
                </p>
                <p className="text-[#4B5563] text-xs" style={{ fontFamily: 'ui-monospace, monospace' }}>
                  Już wkrótce
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Secondary screenshot strip */}
        {app.strip && app.strip.length > 0 && (
          <div className="mt-14">
            <div className="flex items-baseline justify-between pb-3.5 mb-6 border-b border-white/[0.08]"
                 style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6B7280' }}>
              <span>Z aplikacji · {app.name}</span>
              <span>{app.strip.length} widoki</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {app.strip.map((s, i) => (
                <figure key={i} className="m-0">
                  <div
                    className="relative rounded-2xl overflow-hidden flex items-center justify-center border border-white/[0.08]"
                    style={{
                      aspectRatio: app.stripKind === 'phone' ? '9/15' : '16/10',
                      background: app.stripKind === 'phone' ? '#0A0B1E' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
                      background: `radial-gradient(ellipse at 70% 30%, ${app.color}1A 0%, transparent 60%)` }}
                    />
                    <img
                      src={s.src}
                      alt={s.label}
                      className="relative"
                      style={{
                        zIndex: 1,
                        width: app.stripKind === 'phone' ? '60%' : '94%',
                        maxHeight: '90%',
                        objectFit: 'contain',
                        borderRadius: app.stripKind === 'phone' ? 18 : 8,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                      }}
                    />
                  </div>
                  <figcaption className="mt-3.5 flex items-center gap-2"
                              style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, letterSpacing: '0.04em', color: '#B8BCC8' }}>
                    <span style={{ color: '#6B7280' }}>0{i + 2}</span>
                    {s.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>

      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </section>
  );
}
