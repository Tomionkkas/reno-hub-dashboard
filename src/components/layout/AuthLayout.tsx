import type { ReactNode } from 'react';
import AuthBrandPanel from './AuthBrandPanel';

const GRAD = 'linear-gradient(135deg, #00D4FF 0%, #7F67FF 50%, #FF0080 100%)';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#0A0B1E' }}>

      {/* Brand panel — desktop only */}
      <AuthBrandPanel />

      {/* Mobile header strip */}
      <div
        className="lg:hidden flex items-center px-6 pt-8 pb-5 relative overflow-hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.04) 0%, rgba(127,103,255,0.05) 100%)' }} />
        <div className="relative flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex-shrink-0" style={{ background: GRAD }} />
          <span className="text-white font-semibold" style={{ letterSpacing: '-0.02em' }}>RenoHub</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-20">
        <div className="w-full" style={{ maxWidth: 420 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
