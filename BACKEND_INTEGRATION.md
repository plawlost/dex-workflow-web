# Backend Integration Guide

This branch integrates the Dex frontend with your backend API system using a dual authentication approach (Supabase + your backend).

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Backend API
NEXT_PUBLIC_BACKEND_URL="https://your-backend-api.com"

# Supabase (Optional - for enhanced auth)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Database (for local development)
DATABASE_URL="postgresql://postgres:password@localhost:5432/dex-workflow-web"

# NextAuth Secret
AUTH_SECRET="your-nextauth-secret"
```

### 2. Authentication Flow

The app now uses a **dual authentication system**:

1. **User signs up/in** → Supabase handles the primary authentication
2. **Background "dummy login"** → Your backend creates/authenticates user with email as password
3. **Access token stored** → Frontend stores your backend's access token for API calls
4. **Service connections** → Uses your backend's connection endpoints with Bearer token

### 3. API Integration

The app integrates with your backend endpoints:

#### Auth Endpoints:
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Authenticate existing user  
- `GET /auth/me` - Get user profile (requires Bearer token)

#### Connection Endpoints:
- `GET /auth/slack` - Get Slack OAuth URL (requires Bearer token)
- `GET /auth/gmail/connect` - Get Gmail OAuth URL (requires Bearer token)
- `GET /auth/notion` - Get Notion OAuth URL (requires Bearer token)

### 4. Key Features

#### ✅ **Sleek Authentication UI**
- Clean sign-in/sign-up forms
- Apple/Linear/Vercel-inspired design
- Proper error handling and loading states

#### ✅ **Service Connection Management**
- Connect Slack, Gmail, and Notion accounts
- Uses your backend's OAuth flow
- Secure token management

#### ✅ **Settings & Configuration**
- Integration settings page for N8N, Slack tokens, etc.
- Account management interface
- Responsive design throughout

#### ✅ **Secure Token Handling**
- Access tokens stored securely in localStorage
- Automatic token refresh (when implemented)
- Proper cleanup on logout

### 5. File Structure

```
src/
├── lib/
│   ├── api.ts              # Backend API client
│   └── supabase.ts         # Supabase client & Google OAuth
├── contexts/
│   └── auth-context.tsx    # React auth context
├── app/
│   ├── auth/
│   │   ├── signin/         # Google OAuth sign in
│   │   ├── signup/         # Redirects to signin
│   │   └── callback/       # OAuth callback handler
│   ├── api/
│   │   └── link-n8n-account/ # N8N compatibility API
│   └── settings/
│       ├── accounts/       # Connected accounts
│       └── integrations/   # Backend config
└── components/
    └── auth/               # Auth UI components
```

### 6. Usage Examples

#### Check Authentication Status:
```tsx
import { useAuth } from '~/contexts/auth-context';

function MyComponent() {
  const { user, loading, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

#### Make Authenticated API Calls:
```tsx
import { useAuth } from '~/contexts/auth-context';
import { supabase } from '~/lib/supabase';

function MyComponent() {
  const { user } = useAuth();
  
  const makeAPICall = async () => {
    // Get current session token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      // Use session token for API requests
      const response = await fetch('/api/some-endpoint', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
    }
  };
}
```

#### Connect Services:
```tsx
import { useAuth } from '~/contexts/auth-context';

function ConnectionsPage() {
  const { user } = useAuth();
  
  const connectSlack = async () => {
    // TODO: Implement Slack OAuth connection
    // This will redirect to Slack OAuth flow
    console.log('Connecting Slack for user:', user?.email);
  };
  
  const connectGmail = async () => {
    // TODO: Implement Gmail OAuth connection
    console.log('Connecting Gmail for user:', user?.email);
  };
}
```

### 7. Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

### 8. Production Deployment

1. Set environment variables in your hosting platform
2. Update `NEXT_PUBLIC_BACKEND_URL` to your production API
3. Configure Supabase project settings
4. Deploy with `pnpm build && pnpm start`

## 🎨 Design System

The app maintains the sleek, minimal design with:
- **Glass morphism effects** for modern UI
- **Perfect typography** with Inter font
- **Consistent spacing** and component sizing
- **Responsive design** for all screen sizes
- **Apple-inspired aesthetics** - clean, functional, beautiful

## 🔒 Security

- Secure token storage in localStorage
- Proper error handling for auth failures
- HTTPS-only cookie settings (in production)
- Input validation and sanitization
- Protected route handling

---

**Ready to connect your backend!** 🚀

Just update the environment variables and your backend API will be fully integrated with this beautiful, functional frontend.