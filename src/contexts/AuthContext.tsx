import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Public project config (same values shipped in src/integrations/supabase/client.ts).
const SUPABASE_URL = 'https://kralcmyhjvoiywcpntkg.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYWxjbXloanZvaXl3Y3BudGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzM3OTAsImV4cCI6MjA3MTQ0OTc5MH0.10JbU5SR2bwJyGorKifCVqCqQcnbBR4xup7NnYxz3AE';
const SESSION_STORAGE_KEY = 'sb-kralcmyhjvoiywcpntkg-auth-token';

function tokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? ((JSON.parse(raw)?.access_token as string) ?? null) : null;
  } catch {
    return null;
  }
}

/**
 * Resolve the caller's RenoHub role via a plain, timeout-guarded fetch to the
 * PostgREST RPC.
 *
 * We deliberately avoid supabase.rpc()/getSession here: during the sign-in
 * transition (and with multiple app tabs open) the supabase-js Web Locks auth
 * lock can deadlock and never release, hanging login on "Logowanie…" forever.
 * Pass the access token captured directly from the auth event; otherwise fall
 * back to the persisted token (lock-free). A hard timeout means this can never
 * block the auth flow — worst case it resolves to 'user'.
 */
async function resolveRole(accessToken?: string | null): Promise<'user' | 'admin'> {
  const token = accessToken ?? tokenFromStorage();
  if (!token) return 'user';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_my_renohub_role`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: '{}',
      signal: controller.signal,
    });
    if (!res.ok) return 'user';
    const data = await res.json();
    return data === 'admin' || data === 'owner' ? 'admin' : 'user';
  } catch {
    return 'user';
  } finally {
    clearTimeout(timeout);
  }
}

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  subscriptions?: string[];
  tier?: 'free' | 'pro' | 'expert';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ confirmationPending: boolean }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check Supabase auth session first
    const checkSession = async () => {
      try {
        // First, try getSession
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('[AuthContext] Session check:', { 
          hasSession: !!session, 
          userId: session?.user?.id, 
          email: session?.user?.email,
          error: sessionError 
        });
        
        if (session?.user && !sessionError) {
          // User is authenticated via Supabase
          const supabaseUser = session.user;
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            role: await resolveRole(session.access_token),
            subscriptions: [],
            tier: 'free'
          };
          console.log('[AuthContext] Setting Supabase user from session:', userData);
          setUser(userData);
          setIsLoading(false);
          return;
        }
        
        // If no session, try getUser (might work if there's a stored token)
        console.log('[AuthContext] No session found, trying getUser...');
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        console.log('[AuthContext] getUser result:', { 
          hasUser: !!currentUser, 
          userId: currentUser?.id, 
          email: currentUser?.email,
          error: userError 
        });
        
        if (currentUser && !userError) {
          const userData: User = {
            id: currentUser.id,
            email: currentUser.email || '',
            role: await resolveRole(),
            subscriptions: [],
            tier: 'free'
          };
          console.log('[AuthContext] Setting Supabase user from getUser:', userData);
          setUser(userData);
          setIsLoading(false);
          return;
        }
        
        // Only fallback to localStorage if no Supabase user found
        console.warn('[AuthContext] No Supabase user found. Checking localStorage...');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.warn('[AuthContext] WARNING: Using localStorage user (mock auth):', parsedUser);
          console.warn('[AuthContext] This user ID will NOT match Supabase project user_ids!');
          setUser(parsedUser);
        } else {
          console.log('[AuthContext] No user found in localStorage either');
        }
      } catch (error) {
        console.error('[AuthContext] Error checking session:', error);
        // Fallback to localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.warn('[AuthContext] Error fallback - using localStorage user:', parsedUser);
          setUser(parsedUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session?.user?.id);
      if (session?.user) {
        const supabaseUser = session.user;
        const userData: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: await resolveRole(session.access_token),
          subscriptions: [],
          tier: 'free'
        };
        console.log('[AuthContext] Setting user from auth state change:', userData);
        setUser(userData);
        // Clear localStorage mock user if it exists
        localStorage.removeItem('user');
      } else {
        console.log('[AuthContext] No session in auth state change, clearing user');
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('[AuthContext] Attempting Supabase login for:', email);
      
      // Try Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AuthContext] Supabase login error:', error);
        console.error('[AuthContext] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Provide more helpful error messages
        if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          const networkError = new Error('Nie można połączyć się z serwerem. Sprawdź połączenie internetowe lub czy projekt Supabase jest aktywny.');
          (networkError as { originalError?: unknown }).originalError = error;
          throw networkError;
        }
        
        // Don't fall back to mock auth - throw the error
        throw error;
      }
      
      if (data.user) {
        // Supabase auth successful
        console.log('[AuthContext] Supabase login successful, user ID:', data.user.id);
        const userData: User = {
          id: data.user.id,
          email: data.user.email || email,
          role: await resolveRole(data.session?.access_token),
          subscriptions: [],
          tier: 'free'
        };
        setUser(userData);
        // Clear any old localStorage mock user
        localStorage.removeItem('user');
        console.log('[AuthContext] User set and localStorage cleared');
      } else {
        throw new Error('No user data returned from Supabase');
      }
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<{ confirmationPending: boolean }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Use the current origin so the confirmation link returns to the exact
          // domain the user signed up on (www vs apex). Hardcoding the apex broke
          // confirmation once apex started 307-redirecting to www, dropping the
          // session token from the URL hash.
          emailRedirectTo: `${window.location.origin}/auth/confirm?app=renohub`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        // Fallback to mock auth for development
        console.warn('Supabase registration failed, using mock auth:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userData: User = {
          id: Date.now().toString(),
          email,
          role: 'user',
          subscriptions: [],
          tier: 'free',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { confirmationPending: false };
      }

      if (data.user) {
        if (data.session === null) {
          // Email confirmation required — user exists but is not yet active
          return { confirmationPending: true };
        }
        // Immediate session (email confirmation disabled in Supabase)
        const userData: User = {
          id: data.user.id,
          email: data.user.email || email,
          role: 'user',
          subscriptions: [],
          tier: 'free',
        };
        setUser(userData);
        return { confirmationPending: false };
      }

      return { confirmationPending: false };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password?app=renohub`,
    });
    if (error) throw error;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
