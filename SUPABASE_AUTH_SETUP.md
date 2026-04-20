# Supabase Auth Setup for Night Shift

## Redirect URLs Configuration

In order for magic link authentication to work properly, you need to configure the redirect URLs in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select the project: `shxncijzcgzwjbppcxfa`
3. Navigate to: **Authentication** → **URL Configuration**
4. Add the following redirect URLs:
   - `https://nsaas-nine.vercel.app/auth/callback` (production)
   - `http://localhost:3000/auth/callback` (local development)

## How It Works

1. User enters their email on `/login`
2. Supabase sends a magic link email
3. User clicks the link → goes to `/auth/callback?code=xxx`
4. Callback route exchanges the code for a session
5. User is redirected to `/dashboard`
6. Dashboard reads the real user from Supabase (not demo user)
7. All requests persist to the user's actual organization

## Environment Variables

The following are already configured in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://shxncijzcgzwjbppcxfa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Test User

- Email: `randomdev296@gmail.com`
- Auth ID: `fae94709-fc3a-4364-8512-af959147cb11`
- User ID: `34a67af4-0959-4751-bc01-944f109df2a`
- Org ID: `c3dc269c-c9ad-4cd2-a5c3-603863ffb790`
