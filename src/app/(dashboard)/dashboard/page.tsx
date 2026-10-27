import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
