import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06]"
         style={{ background: 'rgba(10,11,30,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-[1280px] mx-auto px-14 py-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <img src="/Renohub-logo.png" alt="RenoHub" className="h-8 w-auto" />
          <span className="font-semibold text-white text-base" style={{ letterSpacing: '-0.02em' }}>RenoHub</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <>
              <Link to="/#apps" className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Aplikacje</Link>
              <Link to="/blog" className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Blog</Link>
              <Link to="/dashboard" className="text-sm text-[#B8BCC8] hover:text-white transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-[#B8BCC8] hover:text-white transition-colors flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-[#B8BCC8] hover:text-white transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <a href="/#apps" className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Aplikacje</a>
              <Link to="/blog" className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Blog</Link>
              <Link to="/pomoc" className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Pomoc</Link>
              <Link to="/login" className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Zaloguj</Link>
            </>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          {user ? null : (
            <Link
              to="/waitlist"
              className="text-sm font-medium text-white border border-white/20 rounded-full px-5 py-2.5 hover:bg-white/5 transition-colors"
            >
              Dołącz do listy →
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-white/[0.06] ${
          mobileOpen ? 'max-h-96' : 'max-h-0'
        }`}
        style={{ background: 'rgba(10,11,30,0.98)' }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm text-[#B8BCC8] hover:text-white transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-[#B8BCC8] hover:text-white transition-colors flex items-center gap-2">
                  <User className="w-4 h-4" /> Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm text-[#B8BCC8] hover:text-white transition-colors flex items-center gap-2 text-left">
                <LogOut className="w-4 h-4" /> Wyloguj
              </button>
            </>
          ) : (
            <>
              <a href="/#apps" onClick={() => setMobileOpen(false)} className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Aplikacje</a>
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Blog</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-[#B8BCC8] hover:text-white transition-colors">Zaloguj się</Link>
              <Link
                to="/waitlist"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white border border-white/20 rounded-full px-5 py-2.5 text-center hover:bg-white/5 transition-colors"
              >
                Dołącz do listy →
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
