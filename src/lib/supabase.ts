import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';

// Create Supabase client only if credentials are available
export const supabase = env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null;

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
}

export class SupabaseAuthService {
  static async signInWithGoogle() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  static onAuthStateChange(callback: (user: any) => void) {
    if (!supabase) return () => {};
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      
      // If user just signed in with Google, create N8N compatible account
      if (event === 'SIGNED_IN' && user && user.app_metadata.provider === 'google') {
        try {
          const response = await fetch('/api/link-n8n-account', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.user_metadata.full_name || user.user_metadata.name,
              avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture,
            }),
          });
          
          const data = await response.json();
          
          // Store backend token if received
          if (data.backendToken) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('dex_backend_token', data.backendToken);
            }
            console.log('Backend token stored successfully');
          }
        } catch (error) {
          console.error('Failed to create N8N account:', error);
        }
      }
      
      callback(user);
    });

    return () => subscription.unsubscribe();
  }
}