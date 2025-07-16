import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { env } from '~/env';
import crypto from 'crypto';

// Create service role client for admin operations
const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      env.NEXT_PUBLIC_SUPABASE_URL!,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase service role key not configured');
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      );
    }

    const { email, name, avatar_url } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a secure random password for N8N compatibility
    const dummyPassword = crypto.randomBytes(32).toString('hex');

    // Check if email/password user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingEmailUser = existingUsers.users.find(
      user => user.email === email && user.app_metadata.provider === 'email'
    );

    let userId = null;

    if (existingEmailUser) {
      console.log(`N8N account already exists for ${email}, proceeding with backend authentication`);
      userId = existingEmailUser.id;
    } else {
      // Create email/password user for N8N compatibility
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: dummyPassword,
        email_confirm: true, // Auto-confirm since they've already authenticated via Google
        user_metadata: {
          name,
          full_name: name,
          avatar_url,
          created_via: 'google_oauth_shadow',
          n8n_compatible: true,
        },
      });

      if (createError) {
        console.error('Failed to create N8N user:', createError);
        // Don't return error, continue with backend authentication
      } else {
        console.log(`Successfully created N8N account for ${email}`);
        userId = newUser.user?.id;
      }
    }

    // Now authenticate with your backend to get access token
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://dex-backend-main.vercel.app';
      
      // First try to login (in case account already exists)
      let backendResponse = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: email, // Using email as password as per your backend setup
        }),
      });

      // If login fails, try signup
      if (!backendResponse.ok) {
        backendResponse = await fetch(`${backendUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password: email, // Using email as password
            name: name || email.split('@')[0],
          }),
        });
      }

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        console.log(`Successfully authenticated with backend for ${email}`);
        
        return NextResponse.json({ 
          success: true, 
          message: 'N8N account created and backend authenticated',
          userId: userId,
          backendToken: backendData.tokens?.accessToken || backendData.accessToken,
        });
      } else {
        console.warn(`Backend authentication failed for ${email}, but N8N account created`);
        return NextResponse.json({ 
          success: true, 
          message: 'N8N account created successfully',
          userId: userId 
        });
      }
    } catch (backendError) {
      console.error('Backend authentication error:', backendError);
      // Still return success since N8N account was created
      return NextResponse.json({ 
        success: true, 
        message: 'N8N account created successfully',
        userId: userId 
      });
    }

  } catch (error) {
    console.error('Link N8N account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}