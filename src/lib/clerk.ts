import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCurrentUser() {
  // Get session from cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-shxncijzcgzwjbppcxfa-auth-token');
  
  if (!accessToken) return null;
  
  try {
    const tokenData = JSON.parse(accessToken.value);
    const authToken = Array.isArray(tokenData) ? tokenData[0] : tokenData;
    
    // Get user from Supabase auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(authToken);
    if (error || !user) return null;
    
    // Get user record from our users table
    const { data: userRecord } = await supabaseAdmin
      .from('users')
      .select('*, organizations(*)')
      .eq('clerk_id', user.id)
      .single();
    
    return userRecord;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Keep syncUserWithClerk for compatibility
export async function syncUserWithClerk(clerkUser: any) {
  return null; // Not used with Supabase auth
}
