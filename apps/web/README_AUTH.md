# Authentication Setup for Squire

This document outlines the authentication system implemented for Squire using Supabase.

## Overview

The authentication system provides:
- User registration and login
- Password reset functionality
- Protected routes
- Automatic user settings creation
- Integration with existing database schema

## Components

### Authentication Hook (`/lib/auth.ts`)
- `useAuth()` - Main hook for authentication state management
- Provides: `user`, `session`, `loading`, `signUp`, `signIn`, `signOut`, `resetPassword`

### UI Components
- `AuthForm` - Reusable form for login/signup
- `AuthLayout` - Layout wrapper for auth pages

### Pages
- `/login` - User login page
- `/signup` - User registration page  
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/dashboard` - Protected user dashboard

## Setup Instructions

1. **Environment Variables**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Database Setup**
   Run the migrations in order:
   ```bash
   # Apply the existing schema
   supabase db reset
   
   # Or apply migrations individually
   supabase migration up
   ```

3. **Supabase Configuration**
   - Enable email auth in Supabase dashboard
   - Configure email templates for password reset
   - Set up proper URL configuration for redirects

## Features

### Authentication Flow
1. Users can sign up with email/password
2. Email verification (optional, controlled by Supabase settings)
3. Automatic user_settings record creation via database trigger
4. Protected dashboard access

### Password Reset
1. User requests reset on `/forgot-password`
2. Email sent with secure reset link
3. User sets new password on `/reset-password`

### Route Protection
- Dashboard automatically redirects unauthenticated users to login
- Header shows different navigation based on auth status

## Database Integration

The auth system integrates with the existing schema:
- `auth.users` (Supabase managed)
- `user_settings` (automatically created via trigger)
- RLS policies protect user data

## Usage Examples

### In Components
```tsx
import { useAuth } from '@/lib/auth'

function MyComponent() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return (
    <div>
      Welcome {user.email}
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Server-side Protection
```tsx
import { withAuth } from '@/lib/auth'

export const POST = withAuth(async ({ user, request }) => {
  // user is guaranteed to exist here
  return Response.json({ user: user.id })
})
```

## Current Status

✅ Basic authentication flow  
✅ Password reset functionality  
✅ Protected routes  
✅ User settings auto-creation  
✅ Landing page CTA integration  
🔄 Gmail OAuth integration (coming soon)  
🔄 User preferences management (coming soon) 