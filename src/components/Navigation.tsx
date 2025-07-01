
import { Link, useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text hover-lift">
          RenoApp
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <EnhancedButton variant="ghost" size="sm" className="text-white hover:bg-white/10 nav-link">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </EnhancedButton>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <EnhancedButton variant="ghost" size="sm" className="text-white hover:bg-white/10 nav-link">
                    <User className="w-4 h-4 mr-2" />
                    Panel Admin
                  </EnhancedButton>
                </Link>
              )}
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 nav-link"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj
              </EnhancedButton>
            </>
          ) : (
            <>
              <Link to="/login">
                <EnhancedButton variant="ghost" size="sm" className="text-white hover:bg-white/10 nav-link">
                  Zaloguj się
                </EnhancedButton>
              </Link>
              <Link to="/register">
                <EnhancedButton size="sm" variant="gradient">
                  Zarejestruj się
                </EnhancedButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
