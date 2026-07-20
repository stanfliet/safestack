import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email?: string;
  aud?: string;
  role?: string;
  app_metadata?: Record<string,any>;
  user_metadata?: Record<string,any>;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasFreeAccess: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string, company?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const FREE_ACCESS_EMAILS = ['hambaniks@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u as User | null);
      if (u) loadProfile(u);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u as User | null);
      if (u) loadProfile(u);
      else { setProfile(null); }
    });
    return () => subscription?.unsubscribe();
  }, []);

  async function loadProfile(u: User) {
    let { data } = await supabase.from('profiles').select('*').eq('id', u.id).single();
    
    // Auto-set admin role for free access emails
    if (u.email && FREE_ACCESS_EMAILS.includes(u.email.toLowerCase())) {
      if (!data || (data.role !== 'admin' && data.role !== 'super_admin')) {
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', u.id);
        data = { ...data, role: 'admin' };
      }
    }
    
    setProfile(data);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }

  async function signUp(email: string, password: string, fullName: string, company?: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data.user && !error) {
      // Determine role based on email
      const role = FREE_ACCESS_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
      await supabase.from('profiles').upsert({ 
        id: data.user.id, email, full_name: fullName, company: company || null, role 
      });
    }
    return { error, user: data.user as User | null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null); setProfile(null);
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';
  const hasFreeAccess = isAdmin || isSuperAdmin || (user?.email ? FREE_ACCESS_EMAILS.includes(user.email.toLowerCase()) : false);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isSuperAdmin, hasFreeAccess, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
