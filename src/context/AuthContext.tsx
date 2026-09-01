import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  signInAsAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check if user.id exists in admin_users table
  const checkAdminStatus = async (userId: string): Promise<boolean> => {
    if (!isSupabaseConfigured() || !userId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error checking admin_users table:', error.message);
        return false;
      }

      return Boolean(data && data.user_id === userId);
    } catch (err) {
      console.error('Exception verifying admin credentials:', err);
      return false;
    }
  };

  const handleSessionChange = async (currentSession: Session | null) => {
    setIsLoading(true);
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const adminAuthorized = await checkAdminStatus(currentUser.id);
      setIsAdmin(adminAuthorized);
      if (!adminAuthorized) {
        setAuthError('You are signed in, but you are not authorized as an admin.');
      } else {
        setAuthError(null);
      }
    } else {
      setIsAdmin(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (mounted) {
          await handleSessionChange(initialSession);
        }
      } catch (err) {
        console.error('Failed to get initial session:', err);
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (mounted) {
          await handleSessionChange(newSession);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInAsAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      const msg = 'Supabase credentials are not yet configured in environment variables.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      // 1. Sign in with supabase.auth.signInWithPassword()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message = error.message || 'Invalid login credentials.';
        setAuthError(message);
        setIsLoading(false);
        return { success: false, error: message };
      }

      if (!data.user) {
        const message = 'Unable to retrieve user credentials.';
        setAuthError(message);
        setIsLoading(false);
        return { success: false, error: message };
      }

      // 2. Use authenticated user's id to check admin_users.user_id
      const isAuthorized = await checkAdminStatus(data.user.id);
      
      setUser(data.user);
      setSession(data.session);
      setIsAdmin(isAuthorized);
      setIsLoading(false);

      if (!isAuthorized) {
        const msg = 'You are signed in, but you are not authorized as an admin.';
        setAuthError(msg);
        return { success: false, error: msg };
      }

      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected authentication error occurred.';
      setAuthError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      setAuthError(null);
      setIsLoading(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        authError,
        signInAsAdmin,
        signOut,
        clearAuthError,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
