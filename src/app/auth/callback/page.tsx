"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '~/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        console.error('Supabase not configured');
        router.push('/auth/signin?error=configuration');
        return;
      }

      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth/signin?error=callback_failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to dashboard
          router.push('/');
        } else {
          // No session found, redirect to sign in
          router.push('/auth/signin?error=no_session');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/auth/signin?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 p-2">
          <img 
            src="/logo.png" 
            alt="Dex Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin mx-auto mb-4" />
        <p className="text-caption text-slate-gray">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}