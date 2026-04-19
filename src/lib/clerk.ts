import { supabaseAdmin } from './supabase';

// Demo user for development (always returns demo user for now)
const demoUser = {
  id: '00000000-0000-0000-0000-000000000002',
  org_id: '00000000-0000-0000-0000-000000000001',
  clerk_id: 'demo-user',
  email: 'demo@nsaas.dev',
  full_name: 'Demo User',
  role: 'admin',
  organizations: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Demo Org',
    slug: 'demo-org',
    plan: 'starter'
  }
};

export async function getCurrentUser() {
  // Always return demo user for now
  return demoUser;
}

export async function requireAuth() {
  // Always return demo user for now
  return demoUser;
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
