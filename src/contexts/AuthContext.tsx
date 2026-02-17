import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
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
            role: supabaseUser.email === 'admin@renohub.com' ? 'admin' : 'user',
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
            role: currentUser.email === 'admin@renohub.com' ? 'admin' : 'user',
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session?.user?.id);
      if (session?.user) {
        const supabaseUser = session.user;
        const userData: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: supabaseUser.email === 'admin@renohub.com' ? 'admin' : 'user',
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
          (networkError as any).originalError = error;
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
          role: email === 'admin@renohub.com' ? 'admin' : 'user',
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

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      // Try Supabase auth first
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        // If Supabase auth fails, fall back to mock auth for development
        console.warn('Supabase registration failed, using mock auth:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData: User = {
          id: Date.now().toString(),
          email,
          role: 'user',
          subscriptions: [],
          tier: 'free'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else if (data.user) {
        // Supabase registration successful
        const userData: User = {
          id: data.user.id,
          email: data.user.email || email,
          role: 'user',
          subscriptions: [],
          tier: 'free'
        };
        setUser(userData);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
