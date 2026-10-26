import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const userData = profile
    ? {
        display_name: profile.display_name || user.email?.split('@')[0] || 'User',
        username: profile.username || user.email?.split('@')[0] || 'user',
        avatar_url: profile.avatar_url,
        email: user.email || '',
      }
    : {
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        username: user.email?.split('@')[0] || 'user',
        avatar_url: user.user_metadata?.avatar_url || null,
        email: user.email || '',
      };

  return <DashboardShell user={userData}>{children}</DashboardShell>;
}
