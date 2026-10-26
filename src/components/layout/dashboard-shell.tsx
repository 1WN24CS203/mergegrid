'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from './sidebar';
import { Topbar } from './topbar';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    display_name: string;
    username: string;
    avatar_url: string | null;
    email: string;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast({ type: 'info', title: 'Signed out successfully' });
    router.push('/login');
    router.refresh();
  };

  return (
    <SidebarProvider user={user} onSignOut={handleSignOut}>
      <Topbar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
