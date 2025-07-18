"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseAuthService, type SupabaseUser } from '~/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  backendToken?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshBackendToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Backend token storage helpers
  const storeBackendToken = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dex_backend_token', token);
    }
  };

  const getBackendToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dex_backend_token');
    }
    return null;
  };

  const clearBackendToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dex_backend_token');
    }
  };

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen to Supabase auth changes
    const unsubscribe = SupabaseAuthService.onAuthStateChange(async (supabaseUser: SupabaseUser | null) => {
      if (supabaseUser) {
        // User signed in, normalize user data
        const backendToken = getBackendToken();
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || null,
          avatar_url: supabaseUser.user_metadata.avatar_url || supabaseUser.user_metadata.picture || null,
          backendToken,
        };
        setUser(authUser);
      } else {
        // User signed out
        clearBackendToken();
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const initializeAuth = async () => {
    try {
      const supabaseUser = await SupabaseAuthService.getCurrentUser();
      if (supabaseUser) {
        const unparsedBackendToken = getBackendToken();
        const backendToken = unparsedBackendToken ? JSON.parse(unparsedBackendToken) : null;

        console.log('Backend token:', backendToken);
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata.full_name || supabaseUser.user_metadata.name || null,
          avatar_url: supabaseUser.user_metadata.avatar_url || supabaseUser.user_metadata.picture || null,
          backendToken: backendToken ? backendToken.accessToken : null,
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await SupabaseAuthService.signInWithGoogle();
      // Note: User state will be updated via onAuthStateChange callback
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await SupabaseAuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Signout error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshBackendToken = () => {
    if (user) {
      const backendToken = getBackendToken();
      console.log('Refreshing backend token:', backendToken ? 'Found' : 'Not found');
      setUser({
        ...user,
        backendToken,
      });
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    refreshBackendToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}