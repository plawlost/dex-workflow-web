"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "~/contexts/auth-context";
import { Button } from "~/components/ui/button";

function SignInContent() {
  const { signInWithGoogle, loading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      router.push(callbackUrl);
    }
  }, [user, loading, router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // Redirect will be handled by the auth callback
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setIsSigningIn(false);
      // Error will be handled by the callback page
    }
  };

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'configuration':
        return 'Authentication service is not properly configured.';
      case 'callback_failed':
        return 'Authentication failed. Please try again.';
      case 'no_session':
        return 'No active session found. Please sign in again.';
      case 'unexpected':
        return 'An unexpected error occurred. Please try again.';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-surface rounded-xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 p-2">
              <img 
                src="/logo.png" 
                alt="Dex Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-display font-medium text-deep-gray mb-2">
              Welcome to Dex
            </h1>
            <p className="text-caption text-slate-gray">
              Sign in with your Google account to get started
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-lg">
              <p className="text-sm text-error-red font-medium">
                {getErrorMessage(error)}
              </p>
            </div>
          )}

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 flex items-center justify-center gap-3"
          >
            {isSigningIn ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-stone-gray text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cosmic-gray/50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-gray border-t-accent-blue rounded-full animate-spin" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}