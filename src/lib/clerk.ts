import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from './supabase';

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*, organizations(*)')
    .eq('clerk_id', userId)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function syncUserWithClerk(clerkUser: {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}) {
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  
  if (!email) {
    throw new Error('User has no email address');
  }

  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(' ');

  // Check if user exists
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkUser.id)
    .single();

  if (existingUser) {
    // Update existing user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({
        email,
        full_name: fullName || existingUser.full_name,
        avatar_url: clerkUser.imageUrl || existingUser.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', clerkUser.id)
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  // Create new org for new user
  const { data: org, error: orgError } = await supabaseAdmin
    .from('organizations')
    .insert({
      name: `${fullName || email}'s Organization`,
      slug: `org-${Date.now()}`,
    })
    .select()
    .single();

  if (orgError) throw orgError;

  // Create new user
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_id: clerkUser.id,
      email,
      full_name: fullName,
      avatar_url: clerkUser.imageUrl,
      org_id: org.id,
      role: 'admin',
    })
    .select()
    .single();

  if (userError) throw userError;
  return user;
}
