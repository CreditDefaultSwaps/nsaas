import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAIL = 'randomdev296@gmail.com';

export async function requireAdmin() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error('Unauthorized');
  }

  if (session.user.email !== ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function getAdminSession() {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}
