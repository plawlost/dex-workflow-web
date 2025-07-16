"use client";

import { SupabaseAuthService } from './supabase';
import { backendAPI, type LoginResponse } from './api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  supabaseUser?: any;
}

export class AuthService {
  private static readonly STORAGE_KEY = 'dex_auth_tokens';

  // Store tokens securely in localStorage
  private static storeTokens(tokens: { accessToken: string; refreshToken: string }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));
    }
  }

  // Get stored tokens
  private static getStoredTokens(): { accessToken: string; refreshToken: string } | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Clear stored tokens
  private static clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // Dual signup: Supabase + Backend
  static async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    try {
      // 1. Sign up with Supabase
      const supabaseResult = await SupabaseAuthService.signUp(email, password, name);
      console.log('Supabase signup result:', supabaseResult);
      
      // 2. Create account in your backend (dummy login)
      const backendResult = await backendAPI.signup(email, password, name);
      console.log('Backend signup result:', backendResult);
      
      // 3. Store backend tokens
      this.storeTokens({
        accessToken: backendResult.tokens.accessToken,
        refreshToken: backendResult.tokens.refreshToken,
      });
      console.log('Tokens stored:', this.getStoredTokens());

      return {
        id: backendResult.user.id,
        email: backendResult.user.email,
        name: backendResult.user.name,
        accessToken: backendResult.tokens.accessToken,
        refreshToken: backendResult.tokens.refreshToken,
        supabaseUser: supabaseResult.user,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // Dual login: Supabase + Backend
  static async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      // 1. Sign in with Supabase
      const supabaseResult = await SupabaseAuthService.signIn(email, password);
      console.log('Supabase signin result:', supabaseResult);
      
      // 2. Login to your backend (dummy login with email as password)
      const backendResult = await backendAPI.login(email, password);
      console.log('Backend signin result:', backendResult);
      
      // 3. Store backend tokens
      this.storeTokens({
        accessToken: backendResult.tokens.accessToken,
        refreshToken: backendResult.tokens.refreshToken,
      });
      console.log('Tokens stored:', this.getStoredTokens());

      return {
        id: backendResult.user.id,
        email: backendResult.user.email,
        name: backendResult.user.name,
        accessToken: backendResult.tokens.accessToken,
        refreshToken: backendResult.tokens.refreshToken,
        supabaseUser: supabaseResult.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Sign out from both services
  static async signOut(): Promise<void> {
    try {
      // Sign out from Supabase
      await SupabaseAuthService.signOut();
      
      // Clear backend tokens
      this.clearTokens();
    } catch (error) {
      console.error('Signout error:', error);
      // Clear tokens even if signout fails
      this.clearTokens();
    }
  }

  // Get current user with backend tokens
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const tokens = this.getStoredTokens();
      if (!tokens) return null;

      console.log('Stored tokens:', tokens);

      // Get user profile from backend
      const profile = await backendAPI.getProfile(tokens.accessToken) as {
        id: string;
        email: string;
        name: string;
      };

      console.log('Profile from backend:', profile);
      
      // Get Supabase user
      const supabaseUser = await SupabaseAuthService.getCurrentUser();

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        supabaseUser,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear invalid tokens
      this.clearTokens();
      return null;
    }
  }

  // Get stored access token for API calls
  static getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.accessToken || null;
  }

  // Connection methods using backend API
  static async getSlackConnection(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) throw new Error('Not authenticated');
    
    await backendAPI.getSlackConnection(accessToken);
  }

  static async getGmailConnection(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) throw new Error('Not authenticated');
    
    await backendAPI.getGmailConnection(accessToken);
  }

  static async getNotionConnection(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) throw new Error('Not authenticated');
    
    await backendAPI.getNotionConnection(accessToken);
  }
}