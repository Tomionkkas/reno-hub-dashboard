import { Link } from 'react-router-dom';

const LINKS = [
  {
    heading: 'Aplikacje',
    items: [
      { label: 'CalcReno', href: '/#apps' },
      { label: 'RenoTimeline', href: 'https://www.renotimeline.com', external: true },
      { label: 'RenoScout', href: '/renoscout' },
    ],
  },
  {
    heading: 'Firma',
    items: [
      { label: 'O nas', href: '/o-nas' },
      { label: 'Blog', href: '/blog' },
      { label: 'Dołącz do bety', href: '/waitlist' },
    ],
  },
  {
    heading: 'Prawne',
    items: [
      { label: 'Polityka prywatności', href: '/privacy-policy' },
      { label: 'Regulamin', href: '/privacy-policy' },
      { label: 'Cookies', href: '/privacy-policy' },
    ],
  },
];

export default function FooterD() {
  return (
    <footer
      className="px-5 md:px-14 pt-16 pb-8 border-t border-white/[0.06]"
      style={{ background: '#0A0B1E' }}
    >
      <div className="max-w-[1168px] mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand col */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/Renohub-logo.png" alt="RenoHub" className="h-7 w-auto" />
              <span className="font-semibold text-[15px] text-white" style={{ letterSpacing: '-0.01em' }}>RenoHub</span>
            </div>
            <p className="m-0 text-[13px] leading-relaxed text-[#6B7280]" style={{ maxWidth: 280 }}>
              Polskie aplikacje dla każdego, kto planuje remont świadomie.
            </p>
          </div>

          {/* Link cols */}
          {LINKS.map(col => (
            <div key={col.heading}>
              <p
                className="eyebrow mb-3.5"
                style={{ fontFamily: 'ui-monospace, monospace' }}
              >
                {col.heading}
              </p>
              <nav className="flex flex-col gap-2">
                {col.items.map(item =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-[#B8BCC8] hover:text-white transition-colors no-underline"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="text-[13px] text-[#B8BCC8] hover:text-white transition-colors no-underline"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between pt-5 border-t border-white/[0.06]"
          style={{ fontSize: 12, color: '#6B7280' }}
        >
          <span>© 2026 RenoHub · Zrobione w Polsce</span>
          <span style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.08em', color: '#4B5563' }}>
            RH-LAND-V2
          </span>
        </div>
      </div>
    </footer>
  );
}
