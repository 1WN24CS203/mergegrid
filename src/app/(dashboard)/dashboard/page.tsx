import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

async function DashboardContentLoader() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('mergegrid_demo_session')?.value;

  let displayName = 'Developer';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

  if (isConfigured) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (user) {
        // Check profile in database
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', user.id)
          .single();

        displayName =
          profile?.display_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.display_name ||
          user.user_metadata?.user_name ||
          user.user_metadata?.preferred_username ||
          user.email?.split('@')[0] ||
          'Developer';
      }
    } catch {
      // Fallback
    }
  }

  // Handle demo session naming if not logged into Supabase
  if (displayName === 'Developer' && demoCookie) {
    if (demoCookie.startsWith('github')) {
      displayName = '1WN24CS203';
    } else {
      displayName = 'Developer';
    }
  }

  return <DashboardContent displayName={displayName} />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-20 bg-neutral-100 rounded-xl" />
            <div className="h-20 bg-neutral-100 rounded-xl" />
            <div className="h-20 bg-neutral-100 rounded-xl" />
            <div className="h-20 bg-neutral-100 rounded-xl" />
          </div>
        </div>
      }
    >
      <DashboardContentLoader />
    </Suspense>
  );
}
