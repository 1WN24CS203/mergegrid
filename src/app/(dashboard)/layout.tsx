import React from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('mergegrid_demo_session')?.value;

  let user = null;
  let profile = null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured =
    supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;

      if (user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = userProfile;
      }
    } catch {
      user = null;
    }
  }

  // If neither Supabase user nor demo session exists, redirect to login
  if (!user && !demoCookie) {
    redirect('/login');
  }

  const userData = user
    ? {
        display_name:
          profile?.display_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.user_metadata?.user_name ||
          user.user_metadata?.preferred_username ||
          user.email?.split('@')[0] ||
          'Developer',
        username:
          profile?.username ||
          user.user_metadata?.user_name ||
          user.user_metadata?.preferred_username ||
          user.email?.split('@')[0] ||
          'developer',
        avatar_url:
          profile?.avatar_url ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          null,
        email: user.email || '',
      }
    : demoCookie?.startsWith('github')
    ? {
        display_name: '1WN24CS203 (GitHub)',
        username: '1WN24CS203',
        avatar_url: 'https://github.com/1WN24CS203.png',
        email: 'prathyushjain.cs24@bmsce.ac.in',
      }
    : {
        display_name: 'Developer',
        username: 'developer',
        avatar_url: null,
        email: 'developer@mergegrid.dev',
      };

  return <DashboardShell user={userData}>{children}</DashboardShell>;
}
